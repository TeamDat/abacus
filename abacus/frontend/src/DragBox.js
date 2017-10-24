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

export default class DragBox extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    /**
     * Construct the contents of the component
     * @returns {XML}
     */
    render() {
        var x = this.props.x;
        var y = this.props.y;
        var width = this.props.width;
        var height = this.props.height;
        var number = this.props.number;
        var style = {
            "position": "absolute",
            "width": width.toString(),
            "height": height.toString(),
            "left": (x).toString() + "px",
            "top": (y).toString() + "px",
            "borderStyle": "solid",
            "borderWidth": "1px",
            "borderColor": "#00e0f0"
        };
        if (number < 10) {
            var box_style = {
                "position": "relative",
                "width": "10",
                "height": "20",
                "top": "-1",
                "left": "-10",
                "backgroundColor": "#00e0f0",
                "color": "white",
                "fontSize": "5"
            }
        } else {
            var box_style = {
                "position": "relative",
                "width": "18",
                "height": "20",
                "top": "-1",
                "left": "-18",
                "backgroundColor": "#00e0f0",
                "color": "white",
                "fontSize": "5"
            }
        }
        var number_style = {
            "fontSize": "15"
        }

        return (
            <div style={style}>
                <div style={box_style}>
                    <p style={number_style}>{number}</p>
                </div>
            </div>
        );
    }
}
