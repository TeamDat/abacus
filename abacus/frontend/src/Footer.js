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
/**text-center
 * className="col-md-5"
 * **/

import React from 'react';
import NavItem from 'react-bootstrap/lib/NavItem';

export default class Footer extends React.Component {
    render() {

        return (
            <footer className="footer-div">
                <div className="container text-center">
                    <div className="row footer-content">
                        <NavItem Link to href="/messages">Leave Feedback</NavItem>
                        <p>If you have any questions or concerns, please contact us at <a href="mailto:info@abacus.com">info@abacus.com</a></p>
                        <p><b>DISCLAIMER: This service is provided as is and does not guarantee either the security of uploaded documents nor the accuracy of the results. DO NOT use this service for any sensitive documents.</b></p>
                    </div>
                </div>
            </footer>
        );
    }
}
