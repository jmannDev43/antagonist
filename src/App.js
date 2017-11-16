import React, {Component} from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {blueGrey900, deepOrange500, deepOrange900} from 'material-ui/styles/colors';
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
        {id: 'clicker', connected: false, label: 'Person who tries to click the button (good luck)'},
        {id: 'antagonist', connected: false, label: 'Person who antagonizes with web magic (Muahahaha!)'}
      ],
      winner: null,
      clickAttempt: null,
    };
    socket.on('new gameState', payload => this.updateGameState(payload));
    socket.on('new player selected', playerId => this.updatePlayer(playerId, false));
    socket.on('reset game', () => this.resetGame());
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
  resetGame(isSender) {
    const players = this.state.players;
    players.forEach(player => player.connected = false);
    this.setState({ players, winner: '', playingAs: '' });
    if (isSender) {
      socket.emit('reset game event');
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
                    if (row === 0 && column === 0 ) {
                      return null;
                    }
                    return <div
                      key={`${row}_${column}`}
                      className="mainButtonCopy atTop"
                      style={{ transform: `translate(${90 * column}px, ${40 * row}px)` }}
                      onClick={e => e.target.remove()}
                    >Click Me!!!</div>
                  });
                })
              : null
            }
            <div id="catVideo"></div>
            {this.state.deployAds ?
              <div className="ads fullSize atTop">
                <img className="ad" src={ad1} alt="ad1" onClick={(e) => e.target.style.display = 'none'}/>
                <img className="ad" src={ad2} alt="ad2" onClick={(e) => e.target.style.display = 'none'} />
                <img className="ad" src={ad3} alt="ad3" onClick={(e) => e.target.style.display = 'none'} />
                <img className="ad" src={ad4} alt="ad4" onClick={(e) => e.target.style.display = 'none'} />
                <img className="ad" src={ad5} alt="ad5" onClick={(e) => e.target.style.display = 'none'} />
                <img className="ad" src={ad6} alt="ad6" onClick={(e) => e.target.style.display = 'none'} />
              </div>
              : null
            }
            { this.state.deployBlueScreen ?
              <div className="BSOD fullSize atTop">
                <img src={BSOD} alt="BSOD" />
              </div>
              : null
            }
            { this.state.deployIeError ?
              rows.map(row => {
                return <img
                  key={row}
                  alt="ieError"
                  className="ieError atTop"
                  src={ieError}
                  onClick={e => e.target.remove()}
                  style={{ transform: `translate(${15 * row}px, ${15 * row}px)`, maxWidth: window.innerWidth }}
                />
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
