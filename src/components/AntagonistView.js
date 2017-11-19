import React, { Component } from 'react';
import autoBind from 'react-autobind';
import GameResultDialog from './GameResultDialog';
import getEventPosition from '../getEventPosition';

class AntagonistView extends Component {
  constructor() {
    super();
    autoBind(this);
  }
  moveButton(e) {
    const buttonPosition = getEventPosition(e);
    this.props.updateGameState({key: 'buttonPosition', data: buttonPosition, isSender: true});
  }
  toggleAntagonism(e) {
    const antagonism = e.target.dataset.antagonism;
    const isActive = this.props.gameState[antagonism];
    if (isActive) {
      e.target.classList.remove('active');
    } else {
      e.target.classList.add('active');
    }
    this.props.updateGameState({key: antagonism, data: !isActive, isSender: true})
  }
  render() {
    const buttonStyle = {
      left: this.props.gameState.buttonPosition.x,
      top: this.props.gameState.buttonPosition.y,
      background: '#f94949'
    };
    const deployButtons = Object.keys(this.props.gameState).filter(key => key.includes('deploy'));
    const clickIndicatorStyle = this.props.gameState.clickAttempt
      ? { display: 'block', top: this.props.gameState.clickAttempt.y, left: this.props.gameState.clickAttempt.x }
      : { display: 'none' };
    return (
    <div className="antagonistView">
      <div
        className="movable mainButton"
        draggable={true}
        onDrag={this.moveButton}
        onDragEnd={this.moveButton}
        onTouchMove={this.moveButton}
        style={buttonStyle}
      >Move ME!</div>
      <div className="clickIndicator" style={clickIndicatorStyle}>
        <svg height="40px" width="40px">
          <circle className="pulse" cx="50%" cy="50%" r="5px"></circle>
          <circle className="pulse" cx="50%" cy="50%" r="10px"></circle>
        </svg>
      </div>
      {this.props.gameState.bugAntagonistScreen ?
        <div className="threeSecBug">
          <h2>System Bugged!</h2>
        </div>
        : null
      }
      { !this.props.gameState.winner ?
        <div className="toolbar">
          { deployButtons.map(button => {
            const label = button.replace('deploy', '');
            return <div
              key={button}
              data-antagonism={button}
              onClick={this.toggleAntagonism}
              className="antagonistButton"
            >
              {label}
              </div>
          }) }
        </div>
        : null
      }
      <GameResultDialog {...this.props} playerView="antagonist" />
    </div>
    )
  }
}

export default AntagonistView;
