import React, { Component } from 'react';
import DevilIcon from '../images/devil.svg';
import ClickIcon from '../images/click.svg';

function getPlayerLabel(player, playingAs) {
  if (playingAs) {
    if (player.id === playingAs) {
      return `You're playing as ${playingAs.toUpperCase()}`;
    } else {
      return 'Waiting on other player...';
    }
  } else {
    return 'Other player connected';
  }
}

class PlayAs extends Component {
  render() {
    const userHasSelected = this.props.players.find(player => player.id === this.props.playingAs && !!player.connected);
    return (
      <div className="playAs">
        <h2 className="playAsTitle">Play As:</h2>
        <div className="players row">
          {this.props.players.map((player, i) => {
            const icon = player.id === 'antagonist' ? DevilIcon : ClickIcon;
            const isSelectableClass = !player.connected && !userHasSelected ? 'selectable' : '';
            const playerLabel = getPlayerLabel(player, this.props.playingAs);
            let wrapperClass = '';
            if (!isSelectableClass) {
              wrapperClass = playerLabel === 'Waiting on other player...' ? 'selectionComplete waiting' : 'selectionComplete connected';
            }
            return <div key={player.id} className={`player col col-lg-6 col-md-6 col-sm-12 ${isSelectableClass}`}>
              <div className={`playerImgWrapper ${wrapperClass}`} onClick={() => { this.props.updatePlayer({ playerId: player.id, isSender: true, connected: true }) }}>
                <h3 className="playerTitle">{player.id.toUpperCase()}</h3>
                <img className="playerImg" src={icon} alt={player.id}/>
                { !isSelectableClass ?
                  <span className="connectedLabel">{playerLabel}</span>
                  : null
                }
              </div>
              <h4 className="playerDesc">{player.label}</h4>
            </div>
          })}
        </div>
      </div>
    )
  }
}

export default PlayAs;
