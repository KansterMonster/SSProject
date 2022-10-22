//import react
import React from 'react';
//import the icons
import directoryImage from "./directory.png";
import fileImage from "./file.png";
import {removeTags} from "./functions.js";

//rendered is checking if the react component "desktopManager" is rendered
let rendered = undefined;
let files = 0;

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
            document.getElementById("openDirectory").addEventListener('click', async function function1(){

                // open file picker
                let fileHandle = await window.showDirectoryPicker({
                });

                //listOfValues is an object with the keys being the file name and the definition the file type
                let listOfValues = {};

                //semanticValues is a list of file names with extensions (ie Untited.rtf, Document.docx)
                let semanticValues = []
                console.log(fileHandle);
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
                const phrases = semanticValues;
                console.log(JSON.stringify(fileHandle.values()), fileHandle.values(), listOfValues, titles);

                //Sets these items to local storage so it can be accessed by the other react components as well as the smart search algorithm
                localStorage.setItem("FileHandle", JSON.stringify(listOfValues));
                localStorage.setItem("titles", JSON.stringify(titles));
                localStorage.setItem("phrases", JSON.stringify(phrases));
            });

        } else{
            //if the variable isn't defined, it tries again after 250 milliseconds
            setTimeout(this.waitForElement, 250);
        }
    }

    updateSim(){

    }

    render(){
        this.waitForElement();
        //once the element is defined, get the dictionary "listOfValues" from localstorage
        files = JSON.parse(this.state.DesktopFiles);

        /*filesNoDirectories is an object 
        WITHOUT ANY FOLDERS, ONLY FILES*/
        let filesNoDirectories = []
        for (let item in files){if(files[item] === "file"){filesNoDirectories.push(item)}}

        //htmlParsed is a processed list that will go straight into html
        let htmlParsed = [];

        let i = 0;
        //iterate through all the files
        for (let file in files){
            //duplicate the fileString so that it doesn't alter the file key
            let fileString = file;
            //if the length of the file is greater than 10, then cut off the rest and replace with "..."
            if (file.length >= 10){
                fileString = file.slice(0, 10);
                fileString = fileString + "...";
            }

            if (files[file] === "file") {
                // console.log(this.props.updateSim(filesNoDirectories.indexOf(file)));
                //Parse the info into html form so that it can be displayed to the user (uses a file image)
                htmlParsed.push(
                <li className="files" key={i}>
                    <button id="fileButton" onClick={this.props.updateSim.bind(this, filesNoDirectories.indexOf(file))}>
                        <img src={fileImage} height={64} width={64}/>
                    </button>
                    <p className="captions">{fileString}</p>
                </li>
                );

            } else if (files[file] === "directory"){
                //Parse the info into html form so that it can be displayed to the user (uses a directory image)
                htmlParsed.push(
                <li className="files" key={i}>
                <button id="directoryButton">
                    <img src={directoryImage} height={64} width={64}/>
                </button>
                <p className="captions">{fileString}</p>
                </li>);
            }
            i++;
        }
        return(
        <div>
            <button id="openDirectory">Open Directory</button>
            <div id="fileManager">
            <ul>
                {htmlParsed}
            </ul>
            </div>
        </div>
        )
  }
}

export default DesktopManager