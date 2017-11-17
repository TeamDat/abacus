from collections import deque
import numpy as np
import imageio
import sys

import visvis as vv

def load_image(file_name):
    handle = open(file_name, "r")
    return imageio.imread(handle)

def convert_to_greyscale(image):
    channel_count = image.shape[2]

    # return if already greyscale
    if channel_count == 1:
        return image

    # Cut the alpha channel if there is one
    if channel_count == 4:
        image = image[:, :, 0:3]

    # average and return
    return np.average(image, axis=2)

def threshold_image(image, threshold):
    # should yield a binary true/false bit image
    return image > threshold

# Extract the individual handwritten literals from the document
# and discard blobs that are smol
def create_blobs(bitmap):
    # Label all the blobs using depth-first search
    labels = np.zeros(bitmap.shape, dtype=np.int)
    label = 1
    width = bitmap.shape[1]
    height = bitmap.shape[0]
    bounds = []
    for row in range(bitmap.shape[0]):
        for col in range(bitmap.shape[1]):
            if bitmap[row, col] == True or labels[row, col] != 0:
                continue
            queue = list()
            queue.append((row, col))
            bounds.append([row, col, 1, 1])
            while len(queue) > 0:
                r, c = queue.pop()
                labels[r, c] = label

                # Update bounds for region
                r0 = bounds[label-1][0]
                r1 = r0 + bounds[label-1][2] - 1
                c0 = bounds[label-1][1]
                c1 = c0 + bounds[label-1][3] - 1
                if r < r0:
                    bounds[label-1][0] = r
                    bounds[label-1][2] += (r0-r)
                if r > r1:
                    bounds[label-1][2] += (r-r1)
                if c < c0:
                    bounds[label-1][1] = c
                    bounds[label-1][3] += (c0-c)
                if c > c1:
                    bounds[label-1][3] += (c-c1)
                
                # Add unlabeled neighbors to queue
                if r + 1 < height and bitmap[r + 1, c] == False and labels[r + 1, c] == 0:
                    labels[r + 1, c] = label
                    queue.append((r + 1, c))
                if r - 1 > 0 and bitmap[r - 1, c] == False and labels[r - 1, c] == 0:
                    labels[r - 1, c] = label
                    queue.append((r - 1, c))
                if c + 1 < width and bitmap[r, c + 1] == False and labels[r, c + 1] == 0:
                    labels[r, c + 1] = label
                    queue.append((r, c + 1))
                if c - 1 > 0 and bitmap[r, c - 1] == False and labels[r, c - 1] == 0:
                    labels[r, c - 1] = label
                    queue.append((r, c - 1))

            label += 1

    # Go through the bounding boxes and generate bitmaps for each blob
    blobs = []
    for i in range(len(bounds)):
        print bounds[i]
        # Reject the blob if its area is below a threshold
        if bounds[i][2] * bounds[i][3] <= 30:
            continue
        # Add a 10px black boarder around the blob as a vecotrizer algorithm depends on it
        bounds[i][0] -= 10
        bounds[i][1] -= 10
        bounds[i][2] += 20
        bounds[i][3] += 20

        # Extract the bitmap for this blob from the main image
        bitmap = labels == i + 1
        bitmap = bitmap[bounds[i][0] : bounds[i][0]+bounds[i][2], bounds[i][1] : bounds[i][1]+bounds[i][3]]
        blobs.append(((bounds[i][0], bounds[i][1], bounds[i][2], bounds[i][3]), bitmap))

    return blobs 

# Attempt to recover a list of strokes for a given blob
def vectorize_blob_horizontal_scan(blob, absolute_coords=False):
    # This implements a naive horizontal scanline based vectorizer which is pretty
    # much only good for the "1" character

    # Extract a sequence of ranges and the median for each horizontal scanline
    bitmap = blob[1]
    stroke_x = []
    stroke_y = []
    for row in range(bitmap.shape[0]):
        col = 0
        while col < bitmap.shape[1] and bitmap[row, col] == False:
            col += 1
        if col >= bitmap.shape[1]:
            continue
        mini = col
        while col < bitmap.shape[1] and bitmap[row, col] == True:
            col += 1
        maxi = col
        if (absolute_coords):
            stroke_x.append(((mini + maxi) / 2) + blob[0][1])
            stroke_y.append(row + blob[0][0])
        else:
            stroke_x.append((mini + maxi) / 2)
            stroke_y.append(row)
    return (stroke_x, stroke_y)

def vectorize_blob_vertical_scan(blob, absolute_coords=False):
    # Use vertical scanlines instead of horizontal ones
    bitmap = blob[1]
    stroke_x = []
    stroke_y = []
    for col in range(bitmap.shape[1]):
        row = 0
        while row < bitmap.shape[0] and bitmap[row, col] == False:
            row += 1
        if row >= bitmap.shape[1]:
            continue
        mini = row
        while row < bitmap.shape[0] and bitmap[row, col] == True:
            row += 1
        maxi = row
        if (absolute_coords):
            stroke_y.append(((mini + maxi) / 2) + blob[0][0])
            stroke_x.append(col + blob[0][1])
        else:
            stroke_y.append((mini + maxi) / 2)
            stroke_x.append(col)
    return (stroke_x, stroke_y)

# Counts the number of corners in a region that are "on" in a bitmap
def corner_count(bitmap, box):
    row = box[0]
    col = box[1]
    height = box[2]
    width = box[3]
    count = 0
    if bitmap[row, col] == True:
        count += 1
    if bitmap[row+height-1, col] == True:
        count += 1
    if bitmap[row, col+width-1] == True:
        count += 1
    if bitmap[row+height-1, col+width-1] == True:
        count += 1
    return count

# Return a list of plottable points for a box
def box_coords(box):
    row = box[0]
    col = box[1]
    height = box[2]
    width = box[3]
    y = np.array([row, row+height-1, row+height-1, row, row])
    x = np.array([col, col, col+width-1, col+width-1, col])
    return (x, y)

# Returns the "mass" or the number of lit pixels in a box
def box_mass(blob, box):
    row = box[0]
    col = box[1]
    height = box[2]
    width = box[3]
    a = blob[row : row + height, col : col + width]
    return np.apply_over_axes(np.sum, a, [0,1])[0][0]

def box_coverage(blob, box):
    return float(box_mass(blob, box)) / float(box[2] * box[3])

# Center of mass used to derive a point from a box
def box_center_of_mass(blob, box):
    row = box[0]
    col = box[1]
    height = box[2]
    width = box[3]
    c_x = 0
    c_y = 0
    mass = 0
    for x in range(col, col+width):
        for y in range(row, row+height):
            if blob[y, x]:
                c_x += x
                c_y += y
                mass += 1
    return (c_x/mass, c_y/mass)

# Uses hill climbing to shift a box along an axis to locally maximize fill
def box_optimize_fill(blob, box, axis):
    row = box[0]
    col = box[1]
    height = box[2]
    width = box[3]

    shift_limit = height if axis[0] else width
    shift_limit /= 2

    fill = box_coverage(blob, box)
    fill_neg = 0.0
    if row - axis[0] >= 0 and col - axis[1] >= 0:
        fill_neg = box_coverage(blob, [row - axis[0], col - axis[1], height, width])
    fill_pos = 0.0
    if row + height + axis[0] <= blob.shape[0] and col + width + axis[1] <= blob.shape[1]:
        fill_pos = box_coverage(blob, [row + axis[0], col + axis[1], height, width])
    while (fill < fill_neg or fill < fill_pos) and shift_limit > 0:
        shift_limit -= 1
        if fill_neg > fill_pos:
            row -= axis[0]
            col -= axis[1]
            fill_pos = fill
            fill = fill_neg
            fill_neg = 0.0
            if row - axis[0] >= 0 and col - axis[1] >= 0:
                fill_neg = box_coverage(blob, [row - axis[0], col - axis[1], height, width])
        else:
            row += axis[0]
            col += axis[1]
            fill_neg = fill
            fill = fill_pos
            fill_pos = 0.0
            if row + height + axis[0] <= blob.shape[0] and col + width + axis[1] <= blob.shape[1]:
                fill_pos = box_coverage(blob, [row + axis[0], col + axis[1], height, width])
    return [row, col, height, width]


# Returns the neighboring boxes for a box and their directions
def box_neighbors(blob, box):
    # To determine if a neighbor exists, we use two factors:
    # fill percentage and connectedness
    minimum_fill_a = 0.15
    minimum_fill_b = 0.4
    neighbors = []
    
    row = box[0]
    col = box[1]
    height = box[2]
    width = box[3]

    # Check all the neighbors
    north = [row-height, col, height, width]
    if north[0] >= 0 and box_coverage(blob, north) > minimum_fill_a:
        north = box_optimize_fill(blob, north, (0, 1))
        if box_coverage(blob, north) > minimum_fill_b:
            neighbors.append((north, (-1, 0)))
    south = [row+height, col, height, width]
    if south[0] + south[2] <= blob.shape[0] and box_coverage(blob, south) > minimum_fill_a:
        south = box_optimize_fill(blob, south, (0, 1))
        if box_coverage(blob, south) > minimum_fill_b:
            neighbors.append((south, (1, 0)))
    west = [row, col-width, height, width]
    if west[1] >= 0 and box_coverage(blob, west) > minimum_fill_a:
        west = box_optimize_fill(blob, west, (1, 0))
        if box_coverage(blob, west) > minimum_fill_b:
            neighbors.append((west, (0, -1)))
    east = [row, col+width, height, width]
    if east[1] + east[3] <= blob.shape[1] and box_coverage(blob, east) > minimum_fill_a:
        east = box_optimize_fill(blob, east, (1, 0))
        if box_coverage(blob, east) > minimum_fill_b:
            neighbors.append((east, (0, 1)))

    # Sort by coverage
    def coverage(a):
        return box_coverage(blob, a[0])

    return sorted(neighbors, key=coverage, reverse=True)

def vectorize_blob_boxgrid(blob, absolute_coords=False):
    # This vectorizer attemps to recover strokes by approximating the character
    # with a graph of connecting axis-aligned squares that reasemble the character.
    # The strokes are then reconstructed using graph algorithms to find paths that
    # traverse the graph
    bitmap = blob[1]
    bitmap_copy = np.array(blob[1])

    # Start the first square from the first pixel in the image. Probably not the best
    # heuristic but it's quick
    first_pixel = np.nonzero(bitmap[10])[0][0]
    first_box = [9, first_pixel-1, 2, 2]
    
    # Use a heuristic to get a decent first box: first expand the box to the bottom-right
    # until at least two of the corners of the box have part of the blob, and then expand
    # until one or fewer corners are "lit"
    corners = 1
    while corners == 1:
        first_box[2] += 1
        first_box[3] += 1
        corners = corner_count(bitmap, first_box)
    if corners > 1:
        while corners > 1:
            first_box[2] += 1
            first_box[3] += 1
            corners = corner_count(bitmap, first_box)

    # Use a coverage based heuristic to extend in the bottom left direction to get a better
    # first box
    cvg = box_coverage(bitmap, first_box)
    print cvg
    target_cvg = cvg*0.95
    while cvg > target_cvg and corners > 0:
        first_box[1] -= 1
        first_box[2] += 1
        first_box[3] += 1
        corners = corner_count(bitmap, first_box)
        cvg = box_coverage(bitmap, first_box)
        print "   " + str(cvg)

    # Clear the box from the bitmap and find the neighboring boxes
    bitmap[first_box[0] : first_box[0] + first_box[2], first_box[1] : first_box[1] + first_box[3]] = False
    neighbors = box_neighbors(bitmap, first_box)

    # Use BFS to get all the other squares
    squares = [first_box]
    queue = deque(neighbors)
    while len(queue) > 0:
        box = queue.pop()[0]
        if box_coverage(bitmap, box) < 0.4:
            continue
        bitmap[box[0] : box[0] + box[2], box[1] : box[1] + box[3]] = False
        for n in box_neighbors(bitmap, box):
            queue.append(n)
        squares.append(box)

    xs = []
    ys = []
    for n in squares:
        x, y = box_coords(n)
        vv.plot(x, y, lc='r', ms='.', mc='g', mw=2, lw=3)
        x, y = box_center_of_mass(bitmap_copy, n)
        print x
        print y
        xs.append(x)
        ys.append(y)
    return (xs, ys)

def generate_scgink(blobs, output_file):
    strokes = []
    for blob in blobs:
        if blob[0][2] > blob[0][3]:
            strokes.append(vectorize_blob_horizontal_scan(blob, True))
        else:
            strokes.append(vectorize_blob_vertical_scan(blob, True))
    out = open(output_file, "w")
    out.write("SCG_INK\n")
    out.write(str(len(strokes)) + "\n")
    for stroke in strokes:
        out.write(str(len(stroke[0])) + "\n")
        for i in range(len(stroke[0])):
            out.write(str(stroke[0][i]) + " " + str(stroke[1][i]) + "\n")
    out.close()


image = load_image(sys.argv[1])
greyscale = convert_to_greyscale(image)
threshold = threshold_image(greyscale, 128)
blobs = create_blobs(threshold)
generate_scgink(blobs, sys.argv[2])
fig = vv.figure()
fig.position.w = 700
for i in range(len(blobs)):
    #if blobs[i][0][2] > blobs[i][0][3]:
    #    x, y = vectorize_blob_horizontal_scan(blobs[i])
    #else:
    #    x, y = vectorize_blob_vertical_scan(blobs[i])
    vv.subplot(4, 4, i+1)
    vv.imshow(blobs[i][1])
    x, y = vectorize_blob_boxgrid(blobs[i])
    vv.plot(x, y, lc='r', ms='.', mc='g', mw=2, lw=1)
app = vv.use()
app.Run()
