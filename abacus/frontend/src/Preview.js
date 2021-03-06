/*******************************************************************************
 * Copyright (c) Team.Dat / Team 7147 GATech.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 * Ian Ewell, Logan Gillespie, Ginna Groover, Brighton Trugman, Caroline Zhang
 *******************************************************************************/

import React from 'react';
import ReactQuill from 'react-quill';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import {fireStorageComplete} from "./fire";
import {fireAuth} from "./fire";

/**
 * This component allows the user to view the results of their conversion
 * in the requested format
 */
export default class Preview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLatex: false,
            imageFile: "",
            editorHtml: '',
            theme: 'snow',
            texFile: "",
            textFile: "",
            pdfFile: ""
        };
        this.latex = this.latex.bind(this);
        this.pdf = this.pdf.bind(this);
        this.download = this.download.bind(this);
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(html) {
        this.setState({editorHtml: html});
    }

    /**
     * Gets the src URL for the converted image from Google Cloud Storage
     *
     * @param fileName the name of the original uploaded image which will match
     *        the file name of the converted image
     */
    download(fileName, isPDF) {
        var wait = 1000;
        var interval = setInterval(function () {
            for (let i = 0; i < fileName.length; i++) {
                if (fileName[i] === " ") {
                    fileName[i] = "_";
                }
            }
            wait = wait * 2;

            fireStorageComplete.child(fireAuth().currentUser.uid + '/' + fileName).getDownloadURL().then(url => {
                if (isPDF)
                    this.setState({pdfFile: url});
                else {
                    this.setState({imageFile: url});
                }
            }).catch(error => {
                console.log(error);
            });
            if (this.state.imageFile !== "") {
                clearInterval(interval);
            }
        }.bind(this), wait);


    }

    /**
     * Toggle view mode to TEX
     */
    latex() {
        this.setState({showLatex: true});
    }

    downloadLatex(texFileName) {
        var wait = 1000;
        var interval = setInterval(function () {
            for (let i = 0; i < texFileName.length; i++) {
                if (texFileName[i] === " ") {
                    texFileName[i] = "_";
                }
            }
            wait = wait * 2;
            var blob = new Blob();
            fireStorageComplete.child(fireAuth().currentUser.uid + '/' + texFileName).getDownloadURL().then(url => {
                this.setState({texFile: url});
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url);
                xhr.responseType = "blob";
                xhr.onload = () => {
                    blob = xhr.response;
                    var myReader = new FileReader();
                    myReader.onload = (event) => {
                        this.state.textFile = myReader.result;
                    };
                    var text = myReader.readAsText(blob);
                };
                xhr.send();

            }).catch(error => {
                console.log(error);
            });
            if (this.state.texFile !== "") {
                clearInterval(interval);
            }
        }.bind(this), wait);
    }

    /**
     * Toggle view mode to PDF
     */
    pdf() {
        this.setState({showLatex: false});
    }

    /**
     * Construct the contents of the component
     * @returns {XML}
     */
    render() {

        /**
         * Sets the dimensions of the preview container
         * @type {{width: string, height: string, position: string}}
         */
        var container_style = {
            "width": "530px",
            "height": "550px",
            "position": "relative"
        };

        /**
         * Sets the style for the pre-conversion div
         * @type {{width: string, height: string, position: string, top: string, left: string, textAlign: string, margin: string}}
         */
        var style = {
            "width": "50%",
            "height": "25%",
            "position": "absolute",
            "top": "45%",
            "left": "25%",
            "textAlign": "center",
            "margin": "-40 0 0 -170"
        };

        /**
         * Sets the style for the post-conversion div
         * @type {{width: string, height: string, position: string, marginLeft: string, marginRight: string, marginTop: string, textAlign: string}}
         */
        var download_container_style = {
            "width": "530px",
            "height": "80px",
            "position": "relative",
            "marginLeft": "0px",
            "marginRight": "0px",
            "marginTop": "0px",
            "textAlign": "center"
        };

        /**
         * The following objects set the styles for the edit buttons (TEX or PDF),
         * download button, and the preview image
         */

        var button_container = {
            "width": "70%",
            "height": "100%",
            "position": "absolute",
        };

        var edit_container = {
            "width": "30%",
            "height": "100%",
            "position": "absolute",
            "right": "0%"
        };

        var image_style = {
            "maxWidth": "100%",
            "maxHeight": "100%"
        };

        /**
         * The user has not yet requested a conversion
         */
        if (this.props.convert === "false") {
            return (
                <div className="container">
                    <Jumbotron style={container_style}>
                        <div style={style}>
                            <p>Your rendered document will appear here.</p>
                        </div>
                    </Jumbotron>
                </div>
            );
        } else {
            if (!this.state.imageFile) {
                console.log("spawning");
                var jpgFileName = this.props.filename.split(".")[0] + ".jpg";
                var pdfFileName = this.props.filename.split(".")[0] + ".pdf";
                var texFileName = this.props.filename.split(".")[0] + ".tex";
                this.download(jpgFileName, false);
                this.downloadLatex(texFileName);
                this.download(pdfFileName, true);
            }
        }

        /**
         * Initiate the edit buttons and their actions based on the
         * toggled view mode (TEX or PDF)
         */
        var edit_button_stlye = {
            "width": "100%"
        };
        var editbuttons;
        if (!this.state.showLatex) {
            editbuttons = (
                <ButtonGroup>
                    <Button bsStyle="primary">PDF</Button>
                    <Button onClick={this.latex}>Edit LaTeX</Button>
                </ButtonGroup>
            );
        } else {
            editbuttons = (
                <ButtonGroup style={edit_button_stlye}>
                    <Button onClick={this.pdf}>PDF</Button>
                    <Button bsStyle="primary">Edit LaTeX</Button>
                </ButtonGroup>
            );
        }

        /**
         * This element allows the user to download the file
         * once it is retrieved from GCS after conversion
         * @type {XML}
         */
        var left_button_style = {
            "width": "49%",
            "float": "left"
        };
        var right_button_style = {
            "width": "49%",
            "float": "right",
            "marginRight": "4px"
        };

        var download_bar = this.state.imageFile ? (
            <div style={download_container_style}>
                <div style={button_container}>
                    <a href={this.state.pdfFile} download={this.props.filename.split(".")[0] + ".pdf"}
                       className="btn btn-large btn-primary" style={left_button_style}>
                        Download PDF
                    </a>
                    <a href={this.state.texFile} download={this.props.filename.split(".")[0] + ".tex"}
                       className="btn btn-large btn-primary" style={right_button_style}>
                        Download LaTeX
                    </a>
                </div>
                <div style={edit_container}>
                    {editbuttons}
                </div>
            </div>
        ) : (<div/>);


        /**
         * Shows the converted image or LaTeX
         */
        if (!this.state.showLatex) {
            return (
                <div className="container">
                    <Jumbotron style={container_style}>
                        <div style={image_style}>
                            {this.state.imageFile ?
                                <img src={this.state.imageFile} alt="previewImage" style={image_style} id="image"/>
                                :
                                <div className="loader-pencil-content">
                                    <p>Loading...</p>
                                    <svg id="loader-pencil" xmlns="http://www.w3.org/2000/svg" width="667" height="182"
                                         viewBox="0 0 677.34762 182.15429">
                                        <g>
                                            <path id="body-pencil"
                                                  d="M128.273 0l-3.9 2.77L0 91.078l128.273 91.076 549.075-.006V.008L128.273 0zm20.852 30l498.223.006V152.15l-498.223.007V30zm-25 9.74v102.678l-49.033-34.813-.578-32.64 49.61-35.225z">
                                            </path>
                                            <path id="line" d="M134.482 157.147v25l518.57.008.002-25-518.572-.008z">
                                            </path>
                                        </g>
                                    </svg>
                                </div>
                            }
                        </div>
                    </Jumbotron>
                    {download_bar}
                </div>
            );
        } else {
            var contents = this.state.texFile;
            return (
                <div className="container">
                    <Jumbotron style={container_style} id="containerText">
                        <div className="App">
                            <ReactQuill
                                onChange={this.handleChange}
                                placeholder={this.state.placeholder}
                                value={this.state.textFile}
                                modules={Preview.modules}
                                formats={Preview.formats}
                                bounds={'.App'}
                                theme={"snow"} // pass false to use minimal theme
                            >
                                <div key="editor" ref="editor" className="quill-contents" id="editor"/>
                            </ReactQuill>
                        </div>
                    </Jumbotron>
                    {download_bar}
                </div>
            );
        }
    }
}

/* 
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
Preview.modules = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'},
            {'indent': '-1'}, {'indent': '+1'}],
        ['clean']
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    }
};

Preview.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
];


  

  
