import React, { Component } from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { blueGrey900, blueGrey500, deepOrange900 } from 'material-ui/styles/colors';
// import AppBar from 'material-ui/AppBar';
// import Drawer from 'material-ui/Drawer';
// import MenuItem from 'material-ui/MenuItem';
import io from 'socket.io-client'
import ClickerView from './components/ClickerView'
import AntagonistView from './components/AntagonistView'
import PlayAs from "./components/PlayAs";
import autoBind from 'react-autobind'
const socket = io('http://localhost:8080')

const muiTheme = getMuiTheme({
  fontFamily: 'Roboto Slab, sans-serif',
  palette: {
    textColor: deepOrange900,
    primary1Color: blueGrey500,
    primary2Color: deepOrange900,
    accent1Color: blueGrey900,
  },
});

export const player2Options = {
  buttonPosition: {
    x: 0,
    y: 0,
  },
  deployCats: false,
  deployFence: false,
  deployCopies: false,
  deployFog: false,
  deployVideo: false,
  deployCamouflage: false,
  deployDoor: false,
  deployClippy: false,
  deployShrink: false,
}

class App extends Component {
  constructor() {
    super();
    autoBind(this);
    this.state = {
      ...player2Options,
      playingAs: '',
      players: [
        { id: 'clicker', connected: false, label: 'Person who tries to click the button (good luck)' },
        { id: 'antagonist', connected: false, label: 'Person who antagonizes with web magic (Muahahaha!)' }
      ],
      timeRemaining: null,
      winner: null
    };
    // this.updatePlayer = this.updatePlayer.bind(this);
    socket.on('new buttonPosition', buttonPosition => this.updateButtonPosition(buttonPosition));
    socket.on('new player selected', playerId => this.updatePlayer(playerId, false));
  }
  updateButtonPosition(buttonPosition) {
    this.setState({ buttonPosition });
  }
  updateGameState(key, data) {
    this.setState({ [key]: data });
    socket.emit(`${key} event`, data);
  }
  updatePlayer(playerId, isSelf) {
    const players = this.state.players;
    const player = players.find(player => player.id === playerId);
    player.connected = true;
    const playingAs = isSelf ? playerId : '';
    this.setState({ players, playingAs });
    if (isSelf) {
      socket.emit('playAs event', playerId)
    }
  }
  render() {
    const PlayerView = this.state.playingAs === 'antagonist' ? AntagonistView : ClickerView;
    const numberConnectedPlayers = this.state.players.filter(player => !!player.connected).length;
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="App">
          <div className="container">
            { numberConnectedPlayers === 2 ?
              <PlayerView updateGameState={this.updateGameState} buttonPosition={this.state.buttonPosition}/> :
              <PlayAs players={this.state.players} playingAs={this.state.playingAs} updatePlayer={this.updatePlayer} />
            }
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
