//import react
import React from 'react';
//import the file that finds similiar files
import Similarity from './Similarity';

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

export default App