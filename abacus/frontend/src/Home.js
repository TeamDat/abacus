import React, { Component } from 'react'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import Upload from './Upload'
import Preview from './Preview'


export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {convert: "false"};
        this.convert = this.convert.bind(this);
    }

    convert() {
        this.setState({convert: "true"})
    }

    render() {
        const style = {
            "paddingTop": "100"
        };
        return (
            <div style={style}>
              <Grid>
                <Row>
                  <Col md={6} mdPush={6}><Preview convert={this.state.convert} /></Col>
                  <Col md={6} mdPull={6}><Upload onConvert={() => this.convert()}/></Col>
                </Row>
              </Grid>
            </div>
        );
    }
}