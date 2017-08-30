import React from 'react';

import Jumbotron from 'react-bootstrap/lib/Jumbotron';

export default class About extends React.Component {
    render() {
        var center = {
            "textAlign": "center"
        };

        return (
            <div className="container">
            <Jumbotron>
                <div style={center}>
                    <h2>Abacus</h2>
                    <p>Welcome to Abacus, an application that converts your handwritten notes to PDF/LaTeX.</p>
                    <p>If you have any questions or concerns, please contact us at <a href="mailto:info@abacus.com">info@abacus.com</a></p>
                </div>
            </Jumbotron>
            </div>
        );
    }
}
