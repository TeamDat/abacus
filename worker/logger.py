import requests
import click

from googleapiclient.discovery import build
from oauth2client.client import GoogleCredentials

METADATA_URL_PROJECT = "http://metadata/computeMetadata/v1/project/"
METADATA_URL_INSTANCE = "http://metadata/computeMetadata/v1/instance/"
METADTA_FLAVOR = {'Metadata-Flavor' : 'Google'}

class Logger(object):
    """Tool to log data from a compute engine to Cloud Logging"""
    credentials = GoogleCredentials.get_application_default()
    client =  build('logging', 'v2beta1', credentials=credentials)
    p_id = requests.get(METADATA_URL_PROJECT + 'project-id', headers=METADTA_FLAVOR).text
    i_id = requests.get(METADATA_URL_INSTANCE + 'id', headers=METADTA_FLAVOR).text
    i_name = requests.get(METADATA_URL_INSTANCE + 'hostname', headers=METADTA_FLAVOR).text
    i_zone_url = requests.get(METADATA_URL_INSTANCE + 'zone', headers=METADTA_FLAVOR).text
    i_zone = i_zone_url.split('/')[0]

    @classmethod
    def log_writer(cls, msg):
        """Writer msg to the logs. Can be seen in Cloud Logging.
        Args:
            p_id: The project id to where the log will be written
            i_id: The id that references to the instance that is writing
            i_zone: The zone where the writing instance is deployed in
        Returns:
            None
        Raises:
            None
        """

        body = {
            "entries": [{
                "logName": "projects/{0}/logs/syslog".format(cls.p_id),
                "resource": {
                    "type": "gce_instance",
                    "labels": {
                        "instance_id": cls.i_id,
                        "zone": cls.i_zone
                    }
                },
                "textPayload": msg
            }]
        }
        cls.client.entries().write(body=body).execute()