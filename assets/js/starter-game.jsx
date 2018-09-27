import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import styles from '../css/app.css';

export default function game_init(root) {
  ReactDOM.render(<Starter />, root);
}

class Starter extends React.Component {

  constructor(props) {
    super(props);
    let cards = this.setCards();
    this.state = { cards: cards, clicks: 0};
  }

  // to set the arrangement of cards randomly
  setCards() {
    let letters = ["A", "B", "C", "D", "E", "F", "G", "H", "A", "B", "C", "D", "E", "F", "G", "H"];
    let cards = [{key: 0, flipped: false, matched: false}, {key: 1, flipped: false, matched: false}, 
                {key: 2, flipped: false, matched: false}, {key: 3, flipped: false, matched: false},
                {key: 4, flipped: false, matched: false}, {key: 5, flipped: false, matched: false}, 
                {key: 6, flipped: false, matched: false}, {key: 7, flipped: false, matched: false},
                {key: 8, flipped: false, matched: false}, {key: 9, flipped: false, matched: false}, 
                {key: 10, flipped: false, matched: false}, {key: 11, flipped: false, matched: false},
                {key: 12, flipped: false, matched: false}, {key: 13, flipped: false, matched: false}, 
                {key: 14, flipped: false, matched: false}, {key: 15, flipped: false, matched: false}];

    let cardsWithLetters = [];
    cards.map(card => {
      let index = Math.floor((Math.random() * letters.length));
      card.letter = letters[index];
      letters.splice(index, 1);
      cardsWithLetters.push(card);
    })

    return cardsWithLetters;
  }

  // to reset the cards and clicks to restart the game
  restart() {
    let newCards = this.setCards();
    
    let state1 = _.assign({}, this.state, { cards: newCards, clicks: 0 });
    this.setState(state1);
  }

  // to flip cards back over after a second delay if they are not part of a match
  flipBack() {
    setTimeout(() => {
      let newCards= this.state.cards;
      let unflippedCards = [];
      newCards.map(card => {
        unflippedCards.push({key: card.key, letter: card.letter, flipped: false, matched: card.matched});
      });
      
      let state1 = _.assign({}, this.state, { cards: unflippedCards });
      this.setState(state1);
    }, 1000);
  }

  // to count the number of cards that are currently flipped up
  countFlips(cards) {
    return cards.filter(card => card.flipped).length;
  }

  // to check if the 2 currently flippde cards are a match
  flippedAreMatch(cards) {
    let flippedCards = cards.filter(card => card.flipped);
    return flippedCards[0].letter == flippedCards[1].letter;
  }

  // to update the state of the matcheed cards to be matched
  makeMatches() {
    let newCards = this.state.cards;
    let flippedCards = this.state.cards.filter(card => card.flipped);
    let match1 = flippedCards[0];
    let match2 = flippedCards[1];

    match1.matched = true;
    match1.flipped = false;
    match2.matched = true;
    match2.flipped = false;

    newCards[match1.key] = match1;
    newCards[match2.key] = match2;
      
    let state1 = _.assign({}, this.state, { cards: newCards });
    this.setState(state1);
  }


  // to flip cards, check for matches, and add to clicks when a card is clicked
  clickCard(cardIndex){
    let newCards = this.state.cards;
    let cardToFlip = newCards[cardIndex];

    if (this.countFlips(newCards) < 2) {
      cardToFlip.flipped = true;
      newCards[cardIndex] = cardToFlip;
      let newClicks = this.state.clicks + 1;
  
      let state1 = _.assign({}, this.state, { cards: newCards, clicks: newClicks });
      this.setState(state1);
    }  
    
    if (this.countFlips(newCards) == 2 && this.flippedAreMatch(newCards)) {
      this.makeMatches();
    } else if (this.countFlips(newCards) == 2) {
      this.flipBack();
    }
  }

  render() {
    let row1 = [];
    let row2 = [];
    let row3 = [];
    let row4 = [];

    this.state.cards.map(c => {
      if(c.key >= 0 && c.key < 4) {
        row1.push(c);
      } else if (c.key >= 4 && c.key < 8) {
        row2.push(c);
      } else if (c.key >= 8 && c.key < 12) {
        row3.push(c);
      } else {
        row4.push(c);
      }
    });

    let row1Cards = row1.map(c => <div className="column" key={c.key}><p><Card root={this} key={c.key} card={c}/></p></div>);
    let row2Cards = row2.map(c => <div className="column" key={c.key}><p><Card root={this} key={c.key} card={c}/></p></div>);
    let row3Cards = row3.map(c => <div className="column" key={c.key}><p><Card root={this} key={c.key} card={c}/></p></div>);
    let row4Cards = row4.map(c => <div className="column" key={c.key}><p><Card root={this} key={c.key} card={c}/></p></div>);

    return (
      <div>

        <div className="row">
          <div className="column"></div>
          <div className="column">
            <div>
              <p>Number of Clicks: {this.state.clicks}</p>
            </div>
          </div>

          <div className="column">
            <div className = "restart-button" onClick={this.restart.bind(this)}>Restart</div>
          </div>
        </div>

        <div className="row">
        {row1Cards}
        </div>

        <div className="row">
          {row2Cards}
        </div>

        <div className="row">
          {row3Cards}
        </div>

        <div className="row">
          {row4Cards}
        </div>
    </div>
    );
  }
}

// renders a card based on whether it is flipped, matched, or neither
function Card(params) {
  let card = params.card;

  if (card.matched) {
    return <div className="matched-card">
            <p>{card.letter}</p>
          </div>

  } else if (card.flipped) {
    return <div className="flipped-card">
      <p>{card.letter}</p>
      </div>

  } else {
    return <button onClick={() => params.root.clickCard(card.key)}>
          </button>
  }
}