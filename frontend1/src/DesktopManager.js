//import react
import React, {useState} from 'react';
//import the icons
import directoryImage from "./directory.png";
import fileImage from "./file.png";
import {removeTag} from "./functions.js";

import {useFilePicker} from 'use-file-picker'

import axios from 'axios'


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

        this.selectFiles = this.selectFiles.bind(this)

    }

    async selectFiles(path) {

        const directoryHandle = await window.showDirectoryPicker({})

            if (!directoryHandle) return;

            let listOfValues = {};
            let semanticValues = []

            for await (const file of directoryHandle.values()) {
                if (file.name[0] == ".") continue;
                console.log(file.name);
                listOfValues[file.name] = file.kind;

                if(file.name.indexOf(".txt") == file.name.length - 4 || file.name.indexOf(".text") == file.length - 5) {
                    const textfile = await file.getFile();
                    const text = await textfile.text();
                    semanticValues.push(text.replace(".", ""));
                } 
                
                semanticValues.push(file.name);
                const titles = semanticValues.map(value => removeTag(value))

                localStorage.setItem("FileHandle", JSON.stringify(listOfValues));
                localStorage.setItem("titles", JSON.stringify(titles));
                localStorage.setItem("phrases", JSON.stringify(semanticValues)); //semantic values are phrases
                
            }

    }


    render(){
        //this.waitForElement();
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
            <button id="openDirectory" onClick={this.selectFiles}>Open Directory</button>
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