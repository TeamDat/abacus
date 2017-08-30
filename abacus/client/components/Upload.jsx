// Component to upload a document

import React from 'react';

import Jumbotron from 'react-bootstrap/lib/Jumbotron';
import Button from 'react-bootstrap/lib/Button';

import DragBox from './DragBox.jsx'

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

    handleFile(event) {
        var file = event.target.files[0];
        var imageType = /^image\//;
        if (!imageType.test(file.type)) {
            return;
        }
        this.setState({imageFile: file});
    }

    uploadClicked(event) {
        var fileElem = document.getElementById("docFile");
        if (fileElem) {
            fileElem.click();
        }
    }
    
    imageDrag(event) {
        event.preventDefault();
        var boxArray = this.state.boxes;
        var boxidx = this.state.boxes.length - 1;
        var boxX = boxArray[boxidx].x;
        var boxY = boxArray[boxidx].y;
        boxArray[boxidx].width = event.pageX - boxX;
        boxArray[boxidx].height = event.pageY - boxY;
        this.setState({boxes: boxArray});
    }
    
    handleImageClick(event) {
        var dragIcon = document.createElement('img');
        dragIcon.src = "blank.png";
        event.dataTransfer.setDragImage(dragIcon, -5, -5);
        var box = Object();
        box.x = event.pageX;
        box.y = event.pageY;
        box.width = 1;
        box.height = 1;
        var boxArray = this.state.boxes;
        box.number = this.state.boxes.length + 1;
        boxArray.push(box);
        this.setState({boxes: boxArray});
    }

    render() {
        var container_style = {
            "width": "530",
            "height": "550",
            "position": "relative",
        };

        var convert_container_style = {
            "width": "500",
            "height": "80",
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
            "text-align": "center",
            "margin": "-40 0 0 -170"
        };
        var upload_style = {
            "display": "none"
        }
        var image_style = {
            "maxWidth": "100%",
            "maxHeight": "100%"
        }

        if (this.state.imageFile != '') {
            var reader = new FileReader();
            reader.onload = (function() { return function(e) { document.getElementById("thumbnail").src = e.target.result; }; })();
            reader.readAsDataURL(this.state.imageFile);
            console.log("rerender");
            var boxes = this.state.boxes.map((box) =>
                <DragBox x={box.x} y={box.y} width={box.width} height={box.height} number={box.number} />)
            return (
                <div>
                <Jumbotron style={container_style}>
                <div style={image_style} draggable="true" onDragStart={this.handleImageClick} onDrag={this.imageDrag}>
                    <img src="" id="thumbnail" style={image_style} draggable="false" />
                </div>
                {boxes}
                </Jumbotron>
                <div style={convert_container_style}>
                    <h4>Select the document sections to be converted.</h4>
                    <div style={button_container}>
                    <Button bsStyle="primary" bsSize="large" block onClick={this.props.onConvert}>Convert</Button>
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
                    <input type="file" id="docFile" accept="image/*" style={upload_style} onChange={this.handleFile} />
                </div>
            </Jumbotron>
            </div>
        );
    }
}
