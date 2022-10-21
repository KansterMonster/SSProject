//import react and reactDOM to start the react project
import React from 'react';
import ReactDOM from 'react-dom/client';
//import the css file
import './index.css';
//import the file that finds similiar files
import Similarity from './Similarity';

const root = ReactDOM.createRoot(document.getElementById('root'));

//the react component that oversees the desktop manager and the nav bar, which will be more useful in the future.
class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
    }
  }

  render(){
    return(
      <div id="main">
        <Similarity/>
        {/* <div id="nav"></div> Might add back in the future*/ } 
      </div>
    )
  }
}


//render the app component
root.render(
  <App/>
);