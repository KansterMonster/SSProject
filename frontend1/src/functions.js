
  require('@tensorflow/tfjs');
  const use = require('@tensorflow-models/universal-sentence-encoder');
  const { dot } = require('mathjs')
  const epLoc = 'ep';
  const edLoc = 'ed';

  // pull file content (currently same as titles) from local storage
  function getPhrases() {
    let phrases = JSON.parse(localStorage.getItem("phrases"));
    console.log("retrieved", phrases);
    return phrases
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
  function removeTag(title) {
    if (!title.includes(".")) return title;
  
    let tokens = title.split('.');
    tokens.pop();

    return tokens.join('.');
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
    console.log("%cFinding Similar...", "color: green");
    var dots = fromLocalStorage(edLoc);
    // janky deepcopy
    var tempRow = JSON.parse(JSON.stringify(dots[index]));
    console.log("temprow")
    console.log(tempRow);
    var row = [];


    // reorganize data
    for(let i = 0; i < tempRow.length; i++){
      // don't include self in list of similar files
      if(i == index) continue;
        console.log(i, index)

        row.push([tempRow[i], i]);

    }

    console.log(row);
    // sort based on similarity, not index
    row.sort((a, b) => {
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

export {findSim, removeTag, getPhrases, getTitles, toLocalStorage, fromLocalStorage, redoPhrases, addPhrase, initDots};