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
        this.state = {showLatex: false, imageFile: ""};
        this.props = props;
        this.latex = this.latex.bind(this);
        this.pdf = this.pdf.bind(this);
        this.download = this.download.bind(this);
    }

    /**
     * Gets the src URL for the converted image from Google Cloud Storage
     *
     * @param jpgFileName the name of the original uploaded image which will match
     *        the file name of the converted image
     */
    download(jpgFileName) {
        fireStorageComplete.child(fireAuth().currentUser.uid + '/' + jpgFileName).getDownloadURL().then(url => {
                this.setState({imageFile: url});
            }).catch( error => {
                /*switch (error.code) {
                    case "storage/object-not-found":
                        var delay = Math.pow(2, n) + Math.floor(Math.random() * (2000 - 1000 + 1) + 500);
                        if (delay <= maxBackoff && this.state.imageFile === "") {
                            console.log("setting timeout");
                            setTimeout(function() { this.download(jpgFileName, n+1, maxBackoff).bind(this); }.bind(this), delay);
                        } else if (delay > maxBackoff) {
                            console.log("reached max backoff");
                        }
                        break;
                    default:
                        console.log(error);
                        break;
                }*/
                console.log(error);
            });
    }

    /**
     * Toggle view mode to TEX
     */
    latex() {
        this.setState({showLatex: true});
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
            "width": "530",
            "height": "550",
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
            "width": "500",
            "height": "80",
            "position": "relative",
            "marginLeft": "0",
            "marginRight": "0",
            "marginTop": "0",
            "textAlign": "center"
        };

        /**
         * The following objects set the styles for the edit buttons (TEX or PDF),
         * download button, and the preview image
         */

        var button_container = {
            "width": "50%",
            "height": "100%",
            "position": "absolute",
        };

        var edit_container = {
            "width": "50%",
            "height": "100%",
            "position": "absolute",
            "right": "0%"
        };

        var image_style = {
            "maxWidth": "100%",
            "maxHeight": "100%"
        }

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
            var jpgFileName = this.props.filename.split(".")[0] + ".jpg";
            setTimeout(function() { this.download(jpgFileName); }.bind(this), 5000);
        }

        /**
         * Initiate the edit buttons and their actions based on the
         * toggled view mode (TEX or PDF)
         */
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
                <ButtonGroup>
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
        var download_bar = (
            <div style={download_container_style}>
                <div style={button_container}>
                    <a href={this.state.imageFile} download={this.props.filename.split(".")[0] + ".jpg"}>
                    <Button bsStyle="primary" bsSize="large" block>Download</Button>
                    </a>
                </div>
                <div style={edit_container}>
                    {editbuttons}
                </div>
            </div>
        );

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
                                    <svg id="loader-pencil" xmlns="http://www.w3.org/2000/svg" width="667" height="182" viewBox="0 0 677.34762 182.15429">
                                        <g>
                                            <path id="body-pencil" d="M128.273 0l-3.9 2.77L0 91.078l128.273 91.076 549.075-.006V.008L128.273 0zm20.852 30l498.223.006V152.15l-498.223.007V30zm-25 9.74v102.678l-49.033-34.813-.578-32.64 49.61-35.225z">
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
            var fillerLatex = `4 $\\delta y \\delta z {fx(x_0, y_0, z_0) + \\delta x
\\frac{\\delta fx}{\\delta x} (x_0, y_0, z_0) + ...$\\

$-(fx(x_0, y_0, z_0) - \\delta x \\frac{\\delta fx}{\\delta x} (x_0, y_0, z_0) + ...)$\\

$= 4 \\delta y \\delta z { 2 \\delta x \\frac{\\delta fx}{\\delta x} (x_0, y_0, z_0) } = \\delta V \\frac{\\delta fx}{\\delta x} (x_0, y$ \\`;
            return (
                <div className="container">
                    <Jumbotron style={container_style}>
                    <textarea rows="22" cols="55">
                    {fillerLatex}
                    </textarea>
                    </Jumbotron>
                    {download_bar}
                </div>
            );
        }
    }
}
