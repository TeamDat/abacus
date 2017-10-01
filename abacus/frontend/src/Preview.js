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
import os from 'os'
import {fireStorage, fireStorageComplete, fireStoragePending} from "./fire";
import {fireAuth} from "./fire";


export default class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showLatex: false, imageFile: ''};
        this.props = props;
        this.latex = this.latex.bind(this);
        this.pdf = this.pdf.bind(this);
    }

    download() {
        const options = {
            // The path to which the file should be downloaded, e.g. "./file.txt"
            destination: "./tmp/this.filename",
        };

        this.state.imageFile = fireStoragePending.file(fireAuth().currentUser.uid + '/' + this.filename).download(options).then(() => {
            console.log(
                `downloaded`
            );
        })
            .catch(err => {
                console.error('ERROR:', err);
            });

    }

    latex() {
        this.setState({showLatex: true});
    }

    pdf() {
        this.setState({showLatex: false});
    }

    render() {
        var container_style = {
            "width": "530",
            "height": "550",
            "position": "relative"
        };
        var style = {
            "width": "50%",
            "height": "25%",
            "position": "absolute",
            "top": "45%",
            "left": "25%",
            "textAlign": "center",
            "margin": "-40 0 0 -170"
        };

        var download_container_style = {
            "width": "500",
            "height": "80",
            "position": "relative",
            "marginLeft": "0",
            "marginRight": "0",
            "marginTop": "0",
            "textAlign": "center"
        };

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

        console.log(this.state.convert);
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
        }

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

        var download_bar = (
            <div style={download_container_style}>
                <div style={button_container}>
                    <Button bsStyle="primary" bsSize="large" block>Download</Button>
                </div>
                <div style={edit_container}>
                    {editbuttons}
                </div>
            </div>
        );

        if (!this.state.showLatex) {
            if (this.state.imageFile !== '') {
                var reader = new FileReader();
                reader.onload = (function () {
                    return function (e) {
                        document.getElementById("image").src = e.target.result;
                    };
                })();
                reader.readAsDataURL(this.state.imageFile);
            }

            return (
                <div className="container">
                    <Jumbotron style={container_style}>
                        <div style={image_style}>
                            <img src="" alt="previewImage" style={image_style} id="image"/>
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
