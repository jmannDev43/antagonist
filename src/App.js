import React, {Component} from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {blueGrey900, deepOrange500, deepOrange900} from 'material-ui/styles/colors';
import Delay from 'react-delay';
import io from 'socket.io-client';
import ClickerView from './components/ClickerView';
import AntagonistView from './components/AntagonistView';
import PlayAs from "./components/PlayAs";
import Countdown from './components/Countdown';
import autoBind from 'react-autobind';
import antagonize from './antagonize';

import ad1 from './images/ad1.jpg';
import ad2 from './images/ad2.gif';
import ad3 from './images/ad3.jpg';
import ad4 from './images/ad4.jpg';
import ad5 from './images/ad5.gif';
import ad6 from './images/ad6.jpeg';
import BSOD from './images/bsod.gif';
import ieError from './images/ie-error.gif';

const socket = io('http://localhost:8080');

const muiTheme = getMuiTheme({
  fontFamily: 'Roboto Slab, sans-serif',
  palette: {
    textColor: deepOrange900,
    primary1Color: deepOrange500,
    primary2Color: deepOrange500,
    accent1Color: blueGrey900,
  },
});

export const player2Options = {
  deployCatVideo: false,
  deployCopies: false,
  deployShrink: false,
  deployBlueScreen: false,
  deployAds: false,
  deployIeError: false,
  // deploySnakes: false,
  // deployFence: false,
  // deployFog: false,
  // deployCamo: false,
  // deployDoor: false,
  // deployClippy: false,
}

class App extends Component {
  constructor() {
    super();
    autoBind(this);
    this.state = {
      ...player2Options,
      buttonPosition: {
        x: 0,
        y: 0,
      },
      playingAs: '',
      players: [
        {id: 'clicker', connected: false, label: 'Click the button (sounds easy, right?)'},
        {id: 'antagonist', connected: false, label: 'Be a pain in the ass to the other player...'}
      ],
      winner: null,
      clickAttempt: null,
      bugAntagonistScreen: null,
      rows: [],
      columns: [],
    };
    socket.on('new connection', players => this.setState({ players }));
    socket.on('new disconnection', () => this.resetGame({ resetPlayers: true, isSender: false }));
    socket.on('new gameState', payload => this.updateGameState(payload));
    socket.on('new player selected', playerId => this.updatePlayer(playerId, false));
    socket.on('reset game', resetPlayers => this.resetGame({ resetPlayers, isSender: false }));
    socket.on('hide element', elementId => {
      const target = document.getElementById(elementId);
      target.style.display = 'none';
    });
  }
  componentDidUpdate(prevProps, prevState) {
    const deployOptions = Object.keys(player2Options);
    deployOptions.forEach(option => {
      if (prevState[option] !== this.state[option]) {
        const start = this.state[option];
        antagonize[option](start, this.updateGameState);
      }
    });
  }
  updateGameState({key, data, isSender}) {
    this.setState({[key]: data});
    if (isSender) {
      socket.emit('update game option event', {key, data});
    }
  }
  resetGame({ resetPlayers, isSender }) {
    const newState = {
      ...player2Options,
      buttonPosition: {
        x: 0,
        y: 0
      },
      winner: '',
      players: this.state.players,
      playingAs: this.state.playingAs
    };
    if (resetPlayers) {
      newState.players.forEach(player => player.connected = false);
      newState.playingAs = '';
    }
    this.setState(newState);
    if (isSender) {
      socket.emit('reset game event', resetPlayers);
    }
  }
  updatePlayer(playerId, isSender) {
    const players = this.state.players;
    const player = players.find(player => player.id === playerId);
    player.connected = true;
    this.setState({ players });
    if (isSender) {
      this.setState({ playingAs: playerId });
      socket.emit('playAs event', playerId);
    }
  }
  hideElement(e) {
    e.target.style.display = 'none';
    socket.emit('hide element event', e.target.id);
  }
  render() {
    const PlayerView = this.state.playingAs === 'antagonist' ? AntagonistView : ClickerView;
    const numberConnectedPlayers = this.state.players.filter(player => !!player.connected).length;
    const rows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const columns = window.innerWidth < 700 ? [0, 1, 2, 3] : [0, 1, 2, 3, 4, 5, 6];
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="App">
          <div className="container">
            {numberConnectedPlayers === 2 ?
              <div>
                <PlayerView
                  updateGameState={this.updateGameState}
                  gameState={this.state}
                  resetGame={this.resetGame}
                />
                <Countdown updateGameState={this.updateGameState} winner={this.state.winner}/>
              </div> :
              <PlayAs
                players={this.state.players}
                playingAs={this.state.playingAs}
                updatePlayer={this.updatePlayer}
              />
            }
            {this.state.deployCopies ?
                rows.map(row => {
                  return columns.map(column => {
                    if (row === 0 && column === 3 ) {
                      return null;
                    }
                    return <Delay wait={100 * row} key={`${row}_${column}`}>
                      <div
                        className="mainButtonCopy atTop"
                        id={`mainButtonCopy_${row}_${column}`}
                        style={{transform: `translate(${90 * column}px, ${40 * row}px)`}}
                        onClick={this.hideElement}
                      >Click Me!!!
                      </div>
                    </Delay>
                  });
                })
              : null
            }
            <div id="catVideo"></div>
            {this.state.deployCatVideo ?
              <div id="catVideoClose" onClick={ () => { this.updateGameState({ key: 'deployCatVideo', data: false, isSender: true }) } }>X</div> : null
            }
            {this.state.deployAds ?
              <div className="ads fullSize atTop">
                <img className="ad" id="ad1" src={ad1} alt="ad1" onClick={this.hideElement}/>
                <img className="ad" id="ad2" src={ad2} alt="ad2" onClick={this.hideElement} />
                <img className="ad" id="ad3" src={ad3} alt="ad3" onClick={this.hideElement} />
                <img className="ad" id="ad4" src={ad4} alt="ad4" onClick={this.hideElement} />
                <img className="ad" id="ad5" src={ad5} alt="ad5" onClick={this.hideElement} />
                <img className="ad" id="ad6" src={ad6} alt="ad6" onClick={this.hideElement} />
              </div>
              : null
            }
            { this.state.deployBlueScreen ?
              <div className="BSOD fullSize atTop" id="BSOD_Wrapper" onClick={this.hideElement}>
                <img id="BSOD" src={BSOD} alt="BSOD" />
              </div>
              : null
            }
            { this.state.deployIeError ?
              rows.map(row => {
                const xAmount = row > 5 ? 10 - row : row;
                return <Delay wait={100 * row} key={row}>
                  <img
                    alt="ieError"
                    id={`ieError_${row}`}
                    className="ieError atTop"
                    src={ieError}
                    onClick={this.hideElement}
                    style={{transform: `translate(${30 * xAmount}px, ${30 * row}px)`, maxWidth: window.innerWidth}}
                  />
                </Delay>
              })
              : null
            }
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
