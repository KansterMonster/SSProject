
  require('@tensorflow/tfjs');
  const use = require('@tensorflow-models/universal-sentence-encoder');
  const { dot, forEach } = require('mathjs')
  const epLoc = 'ep';
  const edLoc = 'ed';


  // pull file content (currently same as titles) from local storage
  function getPhrases() {
    let phrases = JSON.parse(localStorage.getItem("phrases"));
    console.log("retrieved", phrases);
    return phrases
  }
  //For when the user clicks on a directory symbol on the frontend
  async function enter_directory(name){
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
    localStorage.setItem("FileHandleOld", localStorage.getItem("FileHandle"))
    localStorage.setItem("FileHandle", JSON.stringify(listOfValues));
    localStorage.setItem("titlesOld", localStorage.getItem("titles"));
    localStorage.setItem("titles", JSON.stringify(titles));
    localStorage.setItem("phrasesOld", localStorage.getItem("phrases"));
    localStorage.setItem("phrases", JSON.stringify(phrases));

    //Increment the current position forward (will be used for the history array in the future for better navigation)
    localStorage.setItem("currentPos", localStorage.getItem("currentPos")+1)

    window.location.reload();
  }
  async function navigate_back(){
    //Reset to previous values, in the future these should be based on the history array
    localStorage.setItem("FileHandle", localStorage.getItem("FileHandleOld"))
    localStorage.setItem("titles", localStorage.getItem("titlesOld"));
    localStorage.setItem("phrases", localStorage.getItem("phrasesOld"));
    localStorage.setItem("FileHandleOld", "")
    localStorage.setItem("titlesOld", "")
    localStorage.setItem("phrasesOld", "")
    //Increment the current position backwards (will be used for the history array in the future for better navigation)
    localStorage.setItem("currentPos", localStorage.getItem("currentPos")-1)
    window.location.reload()
  }
  // pull file titles from local storage
  function getTitles() {
    let phrases = JSON.parse(localStorage.getItem("titles"));
    console.log("retrieved", phrases);
    return phrases
  }

  // create 2D title similarity array
  function initDots(phrasesLoc, dotsLoc) {
    console.log("Redoing Dots...")
    // pull file content from local storage
    var phrases = JSON.parse(localStorage.getItem(phrasesLoc));
    // phraseDots will be the 2d array
    var phraseDots = [];
    for(var i = 0; i < phrases.length; i++){
      var phraseDotsRow = [];
      for(var j = 0; j < phrases.length; j++){
        // calculate text similarity using dot product of the 512-d vectors
        phraseDotsRow.push(dot(phrases[j], phrases[i]))
      }
      phraseDots.push(phraseDotsRow);
    }
    localStorage.setItem(dotsLoc, JSON.stringify(phraseDots));
    console.log("Done")
  }

  // update one row of the similarity array
  function updateDots(phrasesLoc, dotsLoc, index) {
    console.log("Updating Dots...")
    // pull neccesary info from localStorage
    var phrases = JSON.parse(localStorage.getItem(phrasesLoc));
    var phraseDots = JSON.parse(localStorage.getItem(dotsLoc));
    for(var i = 0; i < phrases.length; i++){
      // one row and one column are updated because the 2d array has reduncancies (should be fixed)
      phraseDots[index, i] = dot(phrases[index], phrases[i])
      phraseDots[i, index] = dot(phrases[index], phrases[i])
    }
    // put the updated array back into localStorage
    localStorage.setItem(dotsLoc, JSON.stringify(phraseDots));
    console.log("Done")
  }

  //get rid of tags at the ends of file names
  // EXAMPLE: "this.jpg" -> "this", "this.document.pdf" -> "this.document"
  function removeTags(titles) {
    let returnList = [];
    for(let i = 0; i < titles.length; i++){
      if(titles[i].includes(".")){
        let tokens = titles[i].split('');
        let finalStr = "";
        // if the string begins with a period, then it is something like ".DS_Store", and can be ignored
        if(tokens[0] != '.'){
          // reverse the string to get rid of all characters after the last '.'
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
          // re-reverse to get the original string order back
          tokens = finalStr.split('');
          tokens = tokens.reverse();
        }
        finalStr = tokens.join('');
        returnList.push(finalStr);
      }
    }
    return(returnList);
  }

  // add one row to the similarity array
  function addDots(phrasesLoc, dotsLoc, index) {
    console.log("Adding Dots...")
    // pull neccesary info from localStorage
    var phrases = JSON.parse(localStorage.getItem(phrasesLoc));
    var phraseDots = JSON.parse(localStorage.getItem(dotsLoc));
    var phraseDotsRow = [];
    for(var i = 0; i < phrases.length - 1; i++){
      // one row and one column are add because the 2d array has reduncancies (should be fixed)
      phraseDotsRow.push(dot(phrases[index], phrases[i]));
      phraseDots[i].push(dot(phrases[index], phrases[i]));
    }
    phraseDotsRow.push(dot(phrases[index], phrases[index]));
    phraseDots.push(phraseDotsRow);
    // put the updated array back into localStorage
    localStorage.setItem(dotsLoc, JSON.stringify(phraseDots));
    console.log("Done")
  }

  // store data (THIS FUNCTION IS UNNECESSARY AND SHOULD BE REMOVED)
  function toLocalStorage(array1, location) {
    console.log("Storing...");
    localStorage.setItem(location, JSON.stringify(array1));
    console.log("Done");
  }

  // withdraw data (THIS FUNCTION IS UNNECESSARY AND SHOULD BE REMOVED)
  function fromLocalStorage(location) {
    console.log("Withdrawing...");
    var stored = JSON.parse(localStorage.getItem(location));
    console.log("Done");
    return stored;
  }

  // find and return sorted files by similarity to a specific file
  function findSim(index) {
    console.log("Finding Similar...")
    var dots = fromLocalStorage(edLoc);
    // janky deepcopy
    var tempRow = JSON.parse(JSON.stringify(dots[index]));
    var row = [];
    // reorganize data
    for(let i = 0; i < tempRow.length; i++){
      // don't include self in list of similar files
      if(i != index){
        let tempArr = [];
        tempArr.push(tempRow[i], i);
        row.push(tempArr);
      }
    }
    // sort based on similarity, not index
    row.sort(function(a, b) {
      return a[0] - b[0];
    })
    row.reverse();
    console.log("Done\nSimilar:")
    console.log(row);
    return row;
  }

  // encode default test strings
  function redoPhrases() {
    // encode strings using tensorflow model
    use.load().then(model => {
      // Embed an array of phrases.
      let phrases = getPhrases();
      
      model.embed(phrases).then(embeddings => {
        // `embeddings` is a 2D tensor consisting of the 512-dimensional embeddings for each sentence.
        // So in this example `embeddings` has the shape [2, 512].
        // embeddings.print(true /* verbose */);
        // toLocalStorage(embeddings);
        // console.log(fromLocalStorage(array1));
        let encodedPhrases = embeddings.array().then(encodedPhrases =>{
          console.log("Encoded Phrases: ");
          console.log(encodedPhrases);
          toLocalStorage(encodedPhrases, epLoc);
          // once the phrases have been embedded, calculate their similarities
          initDots(epLoc, edLoc)
          return encodedPhrases;
        });
      });
    });  
  }

  async function addPhrase(phrase, location) {
    console.log("Adding...")
    // encode strings using tensorflow model
    use.load().then(model => {
      
      model.embed(phrase).then(embeddings => {
        let encodedPhrase = embeddings.array().then(encodedPhrase => {
          let encodedPhrases = fromLocalStorage(location);
          encodedPhrases = encodedPhrases.concat(encodedPhrase);
          toLocalStorage(encodedPhrases, location);
          console.log("Done")
          // update the similarity matrix given the new phrase
          addDots(location, edLoc, encodedPhrases.length - 1)
          return encodedPhrases;
        });
      });
    });
  }

  // update the vector for a single phrase
  async function replacePhrase(phrase, location, index) {
    console.log("Replacing...")
    // encode strings using tensorflow model
    use.load().then(model => {
      
      model.embed(phrase).then(embeddings => {
        let encodedPhrase = embeddings.array().then(encodedPhrase => {
          let encodedPhrases = fromLocalStorage(location);
          encodedPhrases = encodedPhrases[index] = encodedPhrase;
          toLocalStorage(encodedPhrases, location);
          console.log("Done")
          // update the similarity matrix given the changed phrase
          updateDots(location, edLoc, index);
          return encodedPhrases;
        });
      });
    });
  }

export {navigate_back,findSim, removeTags, getPhrases, getTitles, toLocalStorage, fromLocalStorage, redoPhrases, addPhrase, initDots, enter_directory, updateDots};