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

import React, { Component } from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Upload from './Upload';
import Preview from './Preview';
import {fireStoragePending} from './fire';
import {fireAuth} from './fire';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {convert: "false", filename: ""};
        this.convert = this.convert.bind(this);
    }

    convert(file, boxes) {
        var imgRef = fireStoragePending.child(fireAuth().currentUser.uid + '/' + file.name);
        this.setState({filename: file.name});
        if (boxes) {
            var boxesJSON = JSON.stringify(boxes);
            var metadata = {
                customMetadata: {
                    'boxes': boxesJSON
                }
            };
            imgRef.put(file, metadata).then(function(snapshot) {
                console.log('convert method uploaded file with box data successfully');
            });
        } else {
            imgRef.put(file).then(function(snapshot) {
                console.log('convert method uploaded file without box data successfully');
            });
        }
        this.setState({convert: "true"});
    }

    render() {
        const style = {
            "paddingTop": "100"
        };
        return (
            <div style={style}>
              <Grid>
                <Row>
                  <Col md={6} mdPush={6}><Preview filename={this.state.filename} convert={this.state.convert} /></Col>
                  <Col md={6} mdPull={6}><Upload filename={this.state.filename} currentUser={this.props.currentUser} onConvert={(file, boxes) => this.convert(file, boxes)}/></Col>
                </Row>
              </Grid>
            </div>
        );
    }
}
