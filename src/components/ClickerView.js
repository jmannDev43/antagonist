import React, { Component } from 'react';
import GameResultDialog from './GameResultDialog'

class ClickerView extends Component {
  render() {
    const buttonStyle = {
      left: this.props.gameState.buttonPosition.x,
      top: this.props.gameState.buttonPosition.y,
    };
    return (
    <div className="clickerView">
      <div
        className="mainButton"
        style={buttonStyle}
        onClick={() => this.props.updateGameState({ key: 'winner', data: 'clicker', isSender: true })}
      >Click me!!!</div>
      <GameResultDialog {...this.props} playerView="clicker"/>
    </div>
    )
  }
}

export default ClickerView;
