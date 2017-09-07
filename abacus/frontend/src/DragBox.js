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
            "left": (x-155).toString() + "px",
            "top": (y-100).toString() + "px",
            "borderStyle": "solid",
            "borderWidth": "1px",
            "borderColor": "#00e0f0"
        };
        var number_style = {
            "position": "relative",
            "width": "16",
            "height": "32",
            "top": "0",
            "left": "0",
            "backgroundColor": "#00e0f0",
            "color": "white",
            "fontSize": "50%"
        }
        return (
            <div style={style}>
                <div style={number_style}>
                    <p>{number}</p>
                </div>
            </div>
        );
    }
}
