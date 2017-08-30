import React from 'react';
import Header from './Header.js'
import About from './About.jsx'
import Upload from './Upload.jsx'
import Preview from './Preview.jsx'
import MainView from './MainView.jsx'

export default class App extends React.Component {
  render() {
    return (
        <div>
            <Header />
            <MainView />
        </div>
     );
  }
}

