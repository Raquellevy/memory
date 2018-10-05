import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import styles from '../css/app.css';

export default function memory_init(root, channel) {
    ReactDOM.render(<Memory channel={channel} />, root);
}

class Memory extends React.Component {
  constructor(props) {
    super(props);

    this.channel = props.channel;
    this.state = { board: [], guesses: [], clicks: 10 };

    this.channel.join()
        .receive("ok", this.gotView.bind(this))
        .receive("error", resp => { console.log("Unable to join", resp) });
  }

  gotView(view) {
    this.setState(view.game);
  }

  sendFlip(flipIndex) {
    this.channel.push("guess", { index: flipIndex })
        .receive("ok", this.gotView.bind(this));
  }

  restart(){
    this.channel.push("restart", {})
    .receive("ok", this.gotView.bind(this));
  }


  render() {

    /*cards = _.map(this.state.guesses, (guess => {
    cards[guess[0]] = {key: cards[guess[0]].key, letter: guess[1], flip: true};
    }));*/
    
    console.log(this.state)
    console.log(this.state.board);
    let cards = this.state.board;
    console.log(cards);

    let row1 = cards.slice(0, 4);
    let row2 = cards.slice(4, 8);
    let row3 = cards.slice(8, 12);
    let row4 = cards.slice(12, 16);
    
    let row1Cards = _.map(row1, c => {return <div className="column" key={c.key}><Card root={this} key={c.key} card={c}/></div>});
    let row2Cards = _.map(row2, c => {return <div className="column" key={c.key}><Card root={this} key={c.key} card={c}/></div>});
    let row3Cards = _.map(row3, c => {return <div className="column" key={c.key}><Card root={this} key={c.key} card={c}/></div>});
    let row4Cards = _.map(row4, c => {return <div className="column" key={c.key}><Card root={this} key={c.key} card={c}/></div>});
    
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
    
    if (card.letter = "_") {
    return <button onClick={() => params.root.sendFlip(6)}>
    </button>
    } else if (card.flip == true) {
    return <div className="flipped-card">
    <p>{card.letter}</p>
    </div>
    
    } else {
    return <div className="matched-card">
    <p>{card.letter}</p>
    </div>
    }
    }