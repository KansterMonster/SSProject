//import react and reactDOM to start the react project
import React from 'react';
//import the file manager AOU
import "browser-fs-access";
//import the icons
import directoryImage from "./directory.png";
import fileImage from "./file.png";

//rendered is checking if the react component "desktopManager" is rendered
let rendered = undefined;
let files = 0;

//get rid of tags at the end of file names (ie Untitled.js => Untitled)
function removeTags(titles) {
  let returnList = [];
  for(let i = 0; i < titles.length; i++){
    if(titles[i].includes(".")){
      let tokens = titles[i].split('');
      console.log(tokens);
      let finalStr = "";
      if(tokens[0] != '.'){
        let reversed = tokens.reverse();
        finalStr = '';
        let start = false;
        for (let j = 0; j < reversed.length; j++) {
          if(start){
            finalStr = finalStr+reversed[j];
          }
          if(reversed[j] == '.'){
            start = true;
          }
        }
        tokens = finalStr.split('');
        tokens = tokens.reverse();
      }
      finalStr = tokens.join('');
      returnList.push(finalStr);
    }
  }
  return(returnList);
}

//The react component for the desktop file manager
class DesktopManager extends React.Component {
  //runs when the object is rendered
  componentDidMount() {
    //rendered is checking if the Desktop item is rendered so that the Window object can add an event listener
    rendered = 1;
  }
  constructor(props) {
    super(props);
    //creating a react state
    this.state = {
      //This will only run when the local storage has a FileHandle object
      DesktopFiles:localStorage.getItem("FileHandle")
    }
  }

  waitForElement(){
    //Runs until the variable "rendered" is defined, which is shown in ComponentDidMount()
    if(typeof rendered !== "undefined"){
      console.log(this);
      document.getElementById("openDirectory").addEventListener('click', async function function1(){
        // open file picker
        let fileHandle = await window.showDirectoryPicker({
          startIn: 'pictures'
        });
        //listOfValues is an object with the keys being the file name and the definition the file type
        let listOfValues = {};
        //semanticValues is a list of file names with extensions (ie Untited.rtf, Document.docx)
        let semanticValues = []
        if (fileHandle.kind === 'directory') {
          for await (const entry of fileHandle.values()) {
            if (entry.name !== ".DS_Store"){
              listOfValues[entry.name] = entry.kind;
              if (entry.kind === "file") {
                semanticValues.push(entry.name);;
              }
            }
          }
        }
        //titles is semanticValues list without the file extensions (ie Untitled, Document)
        const titles = removeTags(semanticValues);
        console.log(JSON.stringify(fileHandle.values()), fileHandle.values(), listOfValues, titles);
        //Sets these items to local storage so it can be accessed by the other react components as well as the smart search algorithm
        localStorage.setItem("FileHandle", JSON.stringify(listOfValues));
        localStorage.setItem("titles", JSON.stringify(titles));
      });
    } else{
      //if the variable isn't defined, it tries again after 250 milliseconds
      console.log(this);
      setTimeout(this.waitForElement, 250);
    }
  }

  render(){
    this.waitForElement();
    //once the element is defined, get the dictionary "listOfValues" from localstorage
    files = JSON.parse(this.state.DesktopFiles);
    console.log(files);
    //list1 is a processed list that will go straight into html
    let htmlParsed = [];
    for (let file in files){
      //duplicate the fileString so that it doesn't alter the file key
      let fileString = file;
      //if the length of the file is greater than 10, then cut off the rest and replace with "..."
      if (file.length >= 10){
        fileString = file.slice(0, 10);
        fileString = fileString + "...";
      }
      if (files[file] === "file") {
        //Parse the info into html form so that it can be displayed to the user (uses a file image)
        htmlParsed.push(
        <div className="files">
          <button id="fileButton">
            <img src={fileImage} height={64} width={64}/>
          </button>
          <p className="captions">{fileString}</p>
        </div>);
      } else if (files[file] === "directory"){
        //Parse the info into html form so that it can be displayed to the user (uses a directory image)
        htmlParsed.push(
        <div className="files">
          <button id="directoryButton">
            <img src={directoryImage} height={64} width={64}/>
          </button>
          <p className="captions">{fileString}</p>
        </div>);
      }
    }
    return(
      <div>
        <button id="openDirectory">Open Directory</button>
        <div id="fileManager">{htmlParsed}</div>        
      </div>
    )
  }
}

export default DesktopManager