from __future__ import division

import base64
import json
import time, datetime
import requests
import click
import urllib3
import os

import subprocess

from google.cloud import pubsub
from google.cloud import storage
from google.cloud.storage import Blob

from recurror import Recurror

METADATA_URL_PROJECT = "http://metadata/computeMetadata/v1/project/"
METADATA_URL_INSTANCE = "http://metadata/computeMetadata/v1/instance/"
METADTA_FLAVOR = {'Metadata-Flavor' : 'Google'}

# Get the metadata related to the instance using the metadata server
PROJECT_ID = requests.get(METADATA_URL_PROJECT + 'project-id', headers=METADTA_FLAVOR).text
INSTANCE_ID = requests.get(METADATA_URL_INSTANCE + 'id', headers=METADTA_FLAVOR).text
INSTANCE_NAME = requests.get(METADATA_URL_INSTANCE + 'hostname', headers=METADTA_FLAVOR).text
INSTANCE_ZONE_URL = requests.get(METADATA_URL_INSTANCE + 'zone', headers=METADTA_FLAVOR).text
INSTANCE_ZONE = INSTANCE_ZONE_URL.split('/')[0]

# Path to xerces dependency for seshat
LD_LIBRARY_PATH = '/usr/local/lib/libxerces-c-3.2.so'

"""Set up shared library path for seshat to use xerces"""
# done by startup script on vm, access thru GCP console -> vm page -> edit -> custom metadata, key "startup-script" value [contents]
# if it does not work (seshat error says it cannot find shared library xerces, this should be the only error)
# then run startup.sh in worker directory
#ldLoad = "LD_LIBRARY_PATH=/usr/local/lib && LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/libxerces-c-3.2.so && export LD_LIBRARY_PATH"
#ldLoadProcess = subprocess.call(ldLoad.split())

"""Create the API clients."""
pubsub_client = pubsub.Client()
gcs_client = storage.Client()

"""Print output updates?"""
debug = 0

# Parameters to call with the script
@click.command()
@click.option('--toprocess', default=1,
              help='Number of medias to process on one instance at a time - Not implemented')
@click.option('--subscription', required=True, help='Name of the subscription to get new messages')
@click.option('--refresh', default=25, help='Acknowledge deadline refresh time')
@click.option('--dataset_id', default='media_processing', help='Name of the dataset where to save transcript')
@click.option('--table_id', default='speech', help='Name of the table where to save transcript')
def main(toprocess, subscription, refresh, dataset_id, table_id):
    """
    """
    subscription_id = "projects/{0}/subscriptions/{1}".format(PROJECT_ID, 'convertflow')
    subscription = pubsub.subscription.Subscription('convertflow', client=pubsub_client)

    if not subscription.exists():
        sys.stderr.write('Cannot find subscription {0}\n'.format(sys.argv[1]))
        return

    r = Recurror(refresh - 10, postpone_ack)

    # pull() blocks until a message is received
    while True:
        #[START sub_pull]
        resp = subscription.pull()
        #[END sub_pull]

        for ack_id, message in resp:
            # We need to do this to get contentType. The rest is in attributes
            #[START msg_format]
            data = message.data
            if debug: print data
            msg_data = json.loads(message.data)
            content_type = msg_data["contentType"]

            attributes = message.attributes
            event_type = attributes['eventType']
            bucket_id = attributes['bucketId']
            object_id = attributes['objectId']
            generation = attributes['objectGeneration']
            #[END msg_format]

            # Start refreshing the acknowledge deadline.
            r.start(ack_ids=[ack_id], refresh=refresh, sub=subscription)

            start_process = datetime.datetime.now() # for future logging
            if debug: print "\nmaking user dirs"
            uid = msg_data['name'].split("/")[0] #get user
            #create user dirs
            userInputPath = os.path.join(os.getcwd(), 'input', uid)
            if not os.path.isdir(userInputPath):
                os.makedirs(userInputPath)
            userSCGPath = os.path.join(os.getcwd(), 'scg', uid)
            if not os.path.isdir(userSCGPath):
                os.makedirs(userSCGPath)
            userOutputPath = os.path.join(os.getcwd(), 'output', uid)
            if not os.path.isdir(userOutputPath):
                os.makedirs(userOutputPath)

            if debug: print "\nmade user dirs\n"

            filename = msg_data['name'].split("/")[1].replace(" ", "_")[:-4] #get original filename, replace spaces, remove extension
            ext = msg_data['name'][-4:]

            pendingBucket = gcs_client.get_bucket('abacus-pending')
            blob = pendingBucket.get_blob(msg_data['name'])
            inputFileName = "input/" + uid + "/" + filename + ext
            inputFile = open(str(inputFileName), "w")
            blob.download_to_file(inputFile)
            inputFile.close()

            if debug:
                print "downloaded pubsub event blob to file " + inputFileName + "\n"
                print "starting vectorization"
            #changing inputFileName to math3.png for debugging
            #inputFileName = "math3.png"
            #filename = "math3"
            scgcmd = "python doc2scgink.py " + inputFileName + " scg/" + uid + "/" + filename + ".scgink"
            scgProc = subprocess.Popen(scgcmd.split(), stdout=subprocess.PIPE)
            scgProc.wait()

            if debug:
                print "\nvectorization finished\n"
                print "starting seshat\n"

            args = "/home/ginnagroover/seshat/seshat -c Config/CONFIG -i scg/" + uid + "/" + filename + ".scgink -o output/" + uid + "/" + filename + ".inkml -r output/" + uid + "/" + filename + ".pgm -d output/" + uid + "/" + filename + ".dot"
            popen = subprocess.Popen(args.split(), stdout=subprocess.PIPE)
            popen.wait()
            output = popen.stdout.read()
            outputStrs = output.split("LaTeX:")
            latex = ""
            texPath = "output/" + uid + "/" + filename + ".tex"
            if len(outputStrs) == 2: #seshat found some latex
                latex = outputStrs[1]
                texFile = open(str(texPath), "w")
                texFile.write(latex)
                texFile.close()

            if debug: print "seshat finished, latex: " + latex

            if debug: print "uploading completed files"

            completeBucket = gcs_client.get_bucket('abacus-complete')

            upTexBlob = Blob(uid + "/" + filename + ".tex", completeBucket)
            with open(texPath, "rb") as upTex:
                upTexBlob.upload_from_file(upTex)

            upInkMLBlob = Blob(uid + "/" + filename + ".inkml", completeBucket)
            with open("output/" + uid + "/" + filename + ".inkml", "rb") as upInkML:
                upInkMLBlob.upload_from_file(upInkML)

            upPGMBlob = Blob(uid + "/" + filename + ".pgm", completeBucket)
            with open("output/" + uid + "/" + filename + ".pgm", "rb") as upPGM:
                upPGMBlob.upload_from_file(upPGM)

            upDotBlob = Blob(uid + "/" + filename + ".dot", completeBucket)
            with open("output/" + uid + "/" + filename + ".dot", "rb") as upDot:
                upDotBlob.upload_from_file(upDot)

            if debug: print "finished uploading completed files"

            end_process = datetime.datetime.now()

            #[START ack_msg]
            # Delete the message in the queue by acknowledging it.
            subscription.acknowledge([ack_id])
            #[END ack_msg]

            # Stop the ackDeadLine refresh until next message.
            r.stop()

def postpone_ack(params):
    """Postpone the acknowledge deadline until the media is processed
    Will be paused once a message is processed until a new one arrives
    Args:
        ack_ids: List of the message ids in the queue
    Returns:
        None
    Raises:
        None
    """
    #ack_ids = params['ack_ids']
    #refresh = params['refresh']
    #sub = params['sub']

    #[START postpone_ack]
    #Increment the ackDeadLine to make sure that file has time to be processed
    for ack_id in params['ack_ids']:
        try:
            params['sub'].modify_ack_deadline(ack_id.encode("utf-8"), params['refresh'])
        except Exception, e:
            pass #it was already acknowledged in main so an exception is raised when it tries to extend the deadline and there's not an easy way to check beforehand

    #[END postpone_ack]

"""Launch the loop to pull media to process."""
if __name__ == '__main__':
    main()