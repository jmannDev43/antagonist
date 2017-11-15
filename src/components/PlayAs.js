import React, { Component } from 'react';
import DevilIcon from '../images/devil.svg'
import ClickIcon from '../images/click.svg'

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
        <div className="players row">
          {this.props.players.map((player, i) => {
            const icon = player.id === 'antagonist' ? DevilIcon : ClickIcon;
            const isSelectableClass = !player.connected && !userHasSelected ? 'selectable' : '';
            return <div key={player.id} className="player col col-lg-6 col-md-6 col-sm-12">
              <h3 className="playerLabel">{player.label}</h3>
              <div className={`playerImgWrapper ${isSelectableClass}`} onClick={() => { this.props.updatePlayer(player.id, true) }}>
                <img className={`playerImg ${isSelectableClass}`} src={icon} alt={player.id}/>
                { !isSelectableClass ?
                  <span className="connectedLabel">{getPlayerLabel(player, this.props.playingAs)}</span>
                  : null
                }
              </div>
            </div>
          })}
        </div>
      </div>
    )
  }
}

export default PlayAs;
