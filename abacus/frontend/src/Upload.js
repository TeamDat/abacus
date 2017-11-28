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
import DragBox from './DragBox.js';


export default class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {imageFile: '', boxes: []};

        this.handleFile = this.handleFile.bind(this);
        this.uploadClicked = this.uploadClicked.bind(this);
        this.handleImageClick = this.handleImageClick.bind(this);
        this.imageDrag = this.imageDrag.bind(this);
    }

    /**
     * Handle the file uploaded from the user and set its image type
     *
     * @param event Generated event from the html frontend code
     */
    handleFile(event) {
        var file = event.target.files[0];
        var imageType = /^image\//;
        if (!imageType.test(file.type)) {
            return;
        }
        this.setState({imageFile: file});
    }

    /**
     * Retrieve the document uploaded by the user
     *
     * @param event  Generated event from the html frontend code
     */
    uploadClicked(event) {
        var fileElem = document.getElementById("docFile");
        if (fileElem) {
            fileElem.click();
        }
    }

    /**
     * Record the areas specified by the user
     *
     * @param event  Generated event from the html frontend code
     */
    imageDrag(event) {
        event.preventDefault();
        var boxArray = this.state.boxes;
        var boxidx = this.state.boxes.length - 1;
        var boxX = boxArray[boxidx].x;
        var boxY = boxArray[boxidx].y;
        var e = event.target;
        var dim = e.getBoundingClientRect();
        boxArray[boxidx].width = event.clientX - dim.left - boxX + 55;
        boxArray[boxidx].height = event.clientY - dim.top - boxY + 43;
        this.setState({boxes: boxArray});
    }

    /**
     * Define a default box size if the user chooses not to drag or prepare a box which can be modified by the
     * users
     *
     * @param event Generated event from the html frontend code
     */
    handleImageClick(event) {
        var dragIcon = document.createElement('img');
        dragIcon.src = "blank.png";
        event.dataTransfer.setDragImage(dragIcon, -5, -5);
        var box = Object();
        var e = event.target;
        var dim = e.getBoundingClientRect();
        box.x = event.clientX - dim.left + 55;
        box.y = event.clientY - dim.top + 43;
        box.width = 15;
        box.height = 5;
        var boxArray = this.state.boxes;
        box.number = this.state.boxes.length + 1;
        boxArray.push(box);
        this.setState({boxes: boxArray});
    }

    render() {
        var container_style = {
            "width": "530px",
            "height": "550px",
            "position": "relative",
        };

        var convert_container_style = {
            "width": "500px",
            "height": "80px",
            "position": "relative",
            "textAlign": "center"
        };

        var button_container = {
            "width": "50%",
            "height": "100%",
            "position": "absolute",
            "left": "25%",
        };

        var style = {
            "width": "40%",
            "height": "25%",
            "position": "absolute",
            "top": "40%",
            "left": "30%",
            "textAlign": "center",
            "margin": "-40 0 0 -170"
        };
        var upload_style = {
            "display": "none"
        }
        var image_style = {
            "maxWidth": "100%",
            "maxHeight": "100%"
        }

        if (this.state.imageFile !== '') {
            var reader = new FileReader();
            reader.onload = (function () {
                return function (e) {
                    document.getElementById("thumbnail").src = e.target.result;
                };
            })();
            reader.readAsDataURL(this.state.imageFile);
            var boxes = this.state.boxes.map((box) =>
                <DragBox x={box.x} y={box.y} width={box.width} height={box.height} number={box.number}/>)
            return (
                <div>
                    <Jumbotron style={container_style}>
                        <div style={image_style} draggable="true" onDragStart={this.handleImageClick}
                             onDrag={this.imageDrag}>
                            <img src="" alt="nothing" id="thumbnail" style={image_style} draggable="false"/>
                        </div>
                        {boxes}
                    </Jumbotron>
                    <div style={convert_container_style}>
                        <div style={button_container}>
                            <p>Select the document sections to be converted.</p>
                            <Button bsStyle="primary"
                                    onClick={() => this.props.onConvert(this.state.imageFile, this.state.boxes)}>Convert</Button>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className="container">
                <Jumbotron style={container_style}>
                    <div style={style}>
                        <Button bsStyle="primary" bsSize="large" block onClick={this.uploadClicked}>Upload</Button>
                        <p>Or drag and drop your file here</p>
                        <input type="file" id="docFile" accept="image/*" style={upload_style}
                               onChange={this.handleFile}/>
                    </div>
                </Jumbotron>
            </div>
        );
    }
}
