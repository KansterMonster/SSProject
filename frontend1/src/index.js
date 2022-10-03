import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import FileManager from "react-file-manager-ui";
import {BrowserRouter, Route, Routes} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));

class Desktop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      downloadsFolder: "hello"
    }
  }
  render(){
    return(
      <div id="main">
        <div id="nav"></div>
        <FileManager id="desktop"></FileManager>
      </div>
    )
  }
}

root.render(
  <Desktop/>
  // <BrowserRouter>
  //   <Routes>
  //     <Route path="/" element={<Desktop/>}/>
  //   </Routes>
  // </BrowserRouter>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
