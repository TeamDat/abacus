# Abacus -
##### A document generation tool to bridge the gap between your notes and LaTeX
Find our live site at: https://abacus-teamdat.firebaseapp.com

### Why?
We discovered, for many users, picking up LaTeX with no knowledge
is often difficult. This difficulty is caused by the 
large number of packages built on the LaTeX platform, as well
as the general syntax the user must learn to be able to successfully
create a renderable document. 

### Functions:
* Convert images to LaTeX (`.tex`) documents
* Provide rendered downloads of LaTeX code in `.pdf` format
* Provide intuitive modification of document within the users browser

### Members:
* Ian Ewell
* Logan Gillespie
* Ginna Groover
* Brighton Trugman
* Caroline Zhang

### Release Notes
* Version: Abacus 1.0
* Feature:
  * Handwritten note conversion to downloadable pdf and LaTex documents
  * User feedback 
* Bug Fixes Since Last Release:
  * None (Abacus 1.0 is the first release)
* Current Bugs:
  * Selection boxes for editing of uploaded document do not work.
  * Cannot interpret complex equations.
  * Misinterprets messy handwriting.
  
### Install Guide:
* Prerequisites: 
  * Firebase: 4.6.2
  * React: 16.1.1
  * Node.js: 8.9.1  
* Dependent Libraries (also see package.json):
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
 * Executables:
   * Download from: https://github.com/falvaro/seshat
* Download Instructions (To be completed in order):
 * Git clone this repository to get our latest code
 * Download Node.js from this website for your specific computer: https://nodejs.org/en/download/
 * Install Firebase using npm install firebase (version 4.6.2 is the lastest) in command window
 * Add Abacus project to Firebase 
   * Import google project (abacus-teamdat) via web console
   * Run command "firebase init" in command window
    * Follow directions on command prompt to connect your gmail account to firebase
 * Install packages using npm install (insert packages listed above)
 * Run commad "npm update" in command window
* Build Instructions (Using command window):
 * npm install
 * npm run build
 * firebase serve
* Install instructions:
 * By running npm install before you build, the installation procedure is complete.
* Run instructions (Using command window):
 * firebase deploy
* Troubleshooting errors:
 * Must install node.js before installing any of the packages. 
 * Run npm update to reflect the updated package changes.
 * For any other issues, email lg@gatech.edu.

 
