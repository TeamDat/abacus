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
* Ian Ewell
* Logan Gillespie
* Ginna Groover
* Brighton Trugman
* Caroline Zhang

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
    * Mathquill: 0.10.1-a
    * Firebase-admin: 5.5.1
    * Firebase-functions: 0.7.3
    * Mkdirp-promise: 5.0.1
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
 * Install Firebase using npm install firebase (version 4.6.2 is the lastest) in command window
 * Add Abacus project to Firebase
   * Import google project (abacus-teamdat) via web console
   * Run command `firebase init` in command window
   * Follow directions on command prompt to connect your gmail account and project to the firebase CLI
 * Install packages using npm install (insert packages listed above)
   * Run command `npm update` in command window
 * Build Instructions (Using command window):
   * npm install
   * npm run build
   * firebase serve
 * Install instructions:
   * By running npm install before you build, the installation procedure for the website is complete.
 * Run instructions (Using command window):
   * firebase deploy
 * Troubleshooting errors:
   * Must install node.js before installing any of the packages.
   * Run npm update to reflect the updated package changes.
   * For any other issues, create an issue on this git repository.

### Backend Setup
##### This project is set up as a Google Cloud Platform project and requires the following steps to work in the GCP environment. We assume some experience with this platform.
* Create an Ubuntu 16.04 (verified to work) VM with your desired attributes
* Install SESHAT
  * [SESHAT: Handwritten math expression parser](https://github.com/falvaro/seshat)
    * Follow the installation and build instructions provided in the repository (dependencies include the xerces-c library, in our experience versions 3.x work best - DO NOT use apt-get, use install instructions and download from the xerces website)
* Create a worker directory and place all files from the eponymous project directory in it
* Troubleshooting:  
If SESHAT errors and cannot find the Xerces library, try the following commands:  
```bash
LD_LIBRARY_PATH=/usr/local/lib
LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/libxerces-c-3.2.so
export LD_LIBRARY_PATH
```

