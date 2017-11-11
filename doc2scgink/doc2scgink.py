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
    # This implements a naive horizontal scanline based vectorizer which is pretty
    # much only good for the "1" character

    # Extract a sequence of ranges and the median for each horizontal scanline
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
    if blobs[i][0][2] > blobs[i][0][3]:
        x, y = vectorize_blob_horizontal_scan(blobs[i])
    else:
        x, y = vectorize_blob_vertical_scan(blobs[i])
    vv.subplot(4, 4, i+1)
    vv.imshow(blobs[i][1])
    vv.plot(x, y, lc='r', ms='.', mc='g', mw=4, lw=2)
app = vv.use()
app.Run()
