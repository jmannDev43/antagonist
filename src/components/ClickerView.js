import React, { Component } from 'react';
import GameResultDialog from './GameResultDialog';
import autoBind from 'react-autobind';
import getEventPosition from '../getEventPosition';

class ClickerView extends Component {
  constructor() {
    super();
    autoBind(this);
  }
  sendClick(e) {
    const clickPosition = getEventPosition(e);
    this.props.updateGameState({ key: 'clickAttempt', data: clickPosition, isSender: true });
    setTimeout(() => {
      this.props.updateGameState({ key: 'clickAttempt', data: null, isSender: true });
    }, 750);
  }
  render() {
    const buttonStyle = {
      left: this.props.gameState.buttonPosition.x,
      top: this.props.gameState.buttonPosition.y,
    };
    return (
    <div className="clickerView" onClick={this.sendClick}>
      <div
        className="mainButton"
        style={buttonStyle}
        onClick={() => {this.props.updateGameState({ key: 'winner', data: 'clicker', isSender: true }); }}
      >Click me!!!</div>
      <GameResultDialog {...this.props} playerView="clicker"/>
    </div>
    )
  }
}

export default ClickerView;
