# Abacus
##### A document generation tool to bridge the gap between your notes and LaTeX
Our site is live at https://abacus-teamdat.firebaseapp.com

### Why?
We discovered, for many users, picking up LaTeX with no knowledge
is often difficult. This difficulty is caused by the
large number of packages built on the LaTeX platform, as well
as the general syntax the user must learn to be able to successfully
create a renderable document.

### Functions:
* Convert images to LaTeX (`.tex`) documents
* Provide rendered downloads of LaTeX code in `.pdf` format
* Provide intuitive modification of document within the user's browser

### Members:
* [Ian Ewell](https://github.com/iewell)
* [Logan Gillespie](https://github.com/logancgillespie)
* [Ginna Groover](https://github.com/ggroover)
* [Brighton Trugman](https://github.com/brightont)
* [Caroline Zhang](https://github.com/czhang363)

### Release Notes
* Version: Abacus 1.0
* Features:
  * Handwritten note conversion to downloadable PDF and LaTeX documents
  * User feedback
* Bug Fixes Since Last Release:
  * None (Abacus 1.0 is the first release)
* Current Bugs:
  * Selection boxes for editing of uploaded document do not work.
  * Editing text output in browser is not fully supported/integrated with Quill

### Install Guide:
### Prerequisites:
  * Firebase: 4.6.2
  * React: 16.1.1
  * Node.js: 8.9.1
### Dependent Libraries (also see package.json):
  * Node Modules:
    * Axios 0.16.2
    * Bootstrap: 3.3.7
    * Firebase-admin: 5.5.1
    * Firebase-functions: 0.7.3
    * Mkdir-promise: 5.0.1
    * OS: 0.1.1
    * React-Bootstrap: 0.31.5
    * React-Dom: 16.1.1
    * React-Quill: 1.1.0
    * React-Router-Dom: 4.2.2
    * React-Scripts: 1.0.17
    * Url-Template: 2.0.8

### Download Instructions (To be completed in order):
 * Git clone this repository to get our latest code
 * Download Node.js from this website for your specific computer: https://nodejs.org/en/download/
 * Install Firebase using `npm install` Firebase (version 4.6.2 is the latest) in command window
 * Add Abacus project to Firebase
   * Create a project via web console in [Google Firebase](https://firebase.google.com/)
   * Install Firebase command line tools
   * Run command `firebase init` in command window
        * Default options are applicable except for the public build folder which compiles to `build`, not the default `public`
   * Follow directions on command prompt to connect your Gmail account and project to the Firebase CLI
 * Install packages using npm install (insert packages listed above)
   * Run command `npm update` in command window
 * Build Instructions (Using command window):
   * `npm install`
   * `npm run build`
   * `firebase serve`
 * Install instructions:
   * By running npm install before you build, the installation procedure for the website is complete.
 * Run instructions (Using command window):
   * `firebase deploy`
 * Troubleshooting errors:
   * Must install node.js before installing any of the packages.
   * Run `npm update` to reflect the updated package changes.
   * For any other issues, create an issue on this git repository.

### Backend Setup
##### This project is set up as a Google Cloud Platform project and requires the following steps to work in the GCP environment. We assume some experience with this or similar cloud platforms as well as with development on Linux systems and basic Python knowledge.
* Set up two storage buckets, one for pending input files and another for completed output files.
* Configure a service account using `gsutil` that will alert the worker service to changes in the bucket you are using for pending files by following [these instructions](https://cloud.google.com/solutions/media-processing-pub-sub-compute-engine#creating-sa). If you do not have `gsutil` set up, you can also find the instructions [here](https://cloud.google.com/sdk/docs/#deb).
* Create an Ubuntu 16.04 Compute Engine VM with your desired attributes. If you would like to use another OS or version you are welcome to try but the project is verified to work on this system. You should see an option to ssh into the VM after it is created.
* Install SESHAT
  * [SESHAT: Handwritten math expression parser](https://github.com/falvaro/seshat)
    * Follow the installation and build instructions provided in the repository (dependencies include the xerces-c library, in our experience versions 3.x work best - DO NOT use apt-get, use install instructions and download from the xerces website)
* Determine [how to transfer files](https://cloud.google.com/compute/docs/instances/transfer-files) to the VM in your development environment.
* Create a `worker` directory and place all files from the eponymous project directory in it; also verify that the paths to executables which are called as subprocesses in `worker.py` are correct for your VM. In this directory, also create `input` and `output` directories. You may change the directory structure but this will require changes in `worker.py`.
* `pip install requirements.txt` to set up the worker service's dependencies.
* `sudo apt-get install texlive-latex-base` to install `pdflatex` for PDF generation.
* `sudo apt-get install imagemagick` for image conversion.
* Start `worker.py` from within the worker directory with the parameter `--subscription <mytopic>` where `<mytopic>` is the name of the topic in which the previously configured service account is sending notifications. If you want the process to continue running after you disconnect from the VM, you can use `nohup` like so:  
`nohup python worker.py --subscription <mytopic>`  
The service should begin running and listening for events. If you need to restart the service for any reason such as updates or changes, you first need to kill the currently running service with `kill -9 <proc_num>` where `proc_num` can be seen with `pgrep -af python` to view running python processes. Then use the above command again to start the service. You can still see the output in `nohup.out`.
* Troubleshooting:   
If SESHAT errors and cannot find the Xerces library, try the following commands:  
```bash
LD_LIBRARY_PATH=/usr/local/lib
LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/libxerces-c-3.2.so
export LD_LIBRARY_PATH
```   
Where the path matches the location of Xerces on your machine. You can set these commands as a startup script on the VM by following [these instructions](https://cloud.google.com/compute/docs/startupscript).   

##### If any steps seem to be missing or are unclear you may contact the contributors to this repository for more information or create an issue, since this readme's goal is not only to provide instructions for future contributors but also to provide a guide for beginners to this platform and aggregate information about it in an orderly way in the context of an actual functioning project.  

### Copyright
##### Team.Dat / Team 7147 Georgia Institute of Technology
###### All rights reserved. This program and the accompanying materials are made available under the terms of the Eclipse Public License v1.0 which accompanies this distribution, and is available at http://www.eclipse.org/legal/epl-v10.html