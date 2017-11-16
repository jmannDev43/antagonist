import React, {Component} from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {blueGrey900, white, deepOrange500, deepOrange900} from 'material-ui/styles/colors';
import io from 'socket.io-client'
import ClickerView from './components/ClickerView'
import AntagonistView from './components/AntagonistView'
import PlayAs from "./components/PlayAs";
import Countdown from './components/Countdown';
import autoBind from 'react-autobind'

const socket = io('http://localhost:8080')

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
  buttonPosition: {
    x: 0,
    y: 0,
  },
  deployCatVideo: false,
  deploySnakes: false,
  deployFence: false,
  deployCopies: false,
  deployFog: false,
  deployCamo: false,
  deployDoor: false,
  deployClippy: false,
  deployShrink: false,
  deployBlueScreen: false,
  deployAds: false,
  deployIeError: false,
}

let player;

class App extends Component {
  constructor() {
    super();
    autoBind(this);
    this.state = {
      ...player2Options,
      playingAs: '',
      players: [
        {id: 'clicker', connected: false, label: 'Person who tries to click the button (good luck)'},
        {id: 'antagonist', connected: false, label: 'Person who antagonizes with web magic (Muahahaha!)'}
      ],
      winner: null,
    };
    socket.on('new gameState', payload => this.updateGameState(payload));
    socket.on('new player selected', playerId => this.updatePlayer(playerId, false));
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.deployCatVideo !== this.state.deployCatVideo) {
      if (this.state.deployCatVideo) {
        player = new window.YT.Player('catVideo', {
          height: window.innerHeight,
          width: window.innerWidth,
          videoId: '-a75sRCC7Bg',
          events: {
            'onReady': event => event.target.playVideo()
          }
        });
      } else {
        player.destroy();
      }
    }
  }

  updateGameState({key, data, isSender}) {
    this.setState({[key]: data});
    if (isSender) {
      socket.emit('update game option event', {key, data});
    }
  }

  updatePlayer(playerId, isSender) {
    const players = this.state.players;
    const player = players.find(player => player.id === playerId);
    player.connected = true;
    const playingAs = isSender ? playerId : '';
    this.setState({players, playingAs});
    if (isSender) {
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
            {numberConnectedPlayers === 2 ?
              <div>
                <PlayerView
                  updateGameState={this.updateGameState}
                  gameState={this.state}
                />
                <Countdown updateGameState={this.updateGameState} winner={this.state.winner}/>
              </div> :
              <PlayAs
                players={this.state.players}
                playingAs={this.state.playingAs}
                updatePlayer={this.updatePlayer}
              />
            }
            <div id="catVideo"></div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
