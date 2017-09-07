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

export default class About extends React.Component {
    render() {
        return (
            <div className="container">
                <Jumbotron>
                    <div>
                        <h2>Abacus</h2>
                        <p>Welcome to Abacus, an application that converts your handwritten notes to PDF/LaTeX.</p>
                        <p>If you have any questions or concerns, please contact us at <a href="mailto:info@abacus.com">info@abacus.com</a></p>
                    </div>
                </Jumbotron>
            </div>
        );
    }
}
