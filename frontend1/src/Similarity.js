// imports
import React from 'react';
import {findSim, removeTags, initDots, getTitles, getPhrases, toLocalStorage, fromLocalStorage, redoPhrases, addPhrase} from './functions.js';
//import the DesktopManager component
import DesktopManager from './DesktopManager';

require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');
const { dot } = require('mathjs');
//encoded phrases
const titlesLoc = 'titles';
const epLoc = 'ep';

// encoded dot products
const edLoc = 'ed';

class Similarity extends React.Component {
  constructor(props) {
    super(props);
    this.titles = getTitles();
    this.phrases = getPhrases();
    this.state = {
      sortedNums: [1, 2],
      sortedPhrases: []
    };
    this.updateSim = this.updateSim.bind(this);
    this.redoPhrases = this.redoPhrases.bind(this);
    let badTitles = ["hello.png", "my.space", "face.pdf", ".asdkjfh"]
    console.log(removeTags(badTitles));
  }
  
  componentDidMount() {
    console.log('Hello from component');
    this.redoPhrases();
  }

  // this is called every time the user asks for similarity
  updateSim(index) {
    var tempSorted = findSim(index)
    var tempSorted2 = [];
    for(let i = 0; i < tempSorted.length; i++){
      tempSorted2.push(tempSorted[i][1]);
    }
    var tempSortedPhrases = [];
    for(let i = 0; i < tempSorted2.length; i++){
      console.log(tempSorted2[i]);
      tempSortedPhrases.push(this.phrases[tempSorted2[i]]);
    }
    this.setState({
      sortedNums: tempSorted2,
      sortedPhrases: tempSortedPhrases
    });
  }

  redoPhrases() {
    redoPhrases();
    this.setState({
      phrases: fromLocalStorage(edLoc)
    });
  }

  addPhrase(phrase) {
    addPhrase(phrase, epLoc);
    this.phrases.push(phrase);
  }

  render () {
    return (
      <div>
        <div id="similarityButtons">
          <p>Working!</p>
          <p>Sorted Indices: {this.state.sortedNums.join(", ")}</p>
          <p>Document Titles Sorted by Similarity: {this.state.sortedPhrases.join(", ")}</p>
          <button onClick={this.redoPhrases}>
            Redo Phrases
          </button>
          <button onClick={() => {this.addPhrase('Eat apples or bananas')}}>
            Add Phrase
          </button>
          <button onClick={() => {this.updateSim(0)}}>
            Find Top 3 Similar
          </button>
          <button onClick={() => {console.log(fromLocalStorage(edLoc))}}>
            Pull Dot Products
          </button>
        </div>
        <DesktopManager
          updateSim={this.updateSim}
        />
      </div>
    )
  }
}

export default Similarity