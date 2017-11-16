import React, { Component } from 'react';
import autoBind from 'react-autobind';
import GameResultDialog from './GameResultDialog'

let isMobile;

class AntagonistView extends Component {
  constructor() {
    super();
    autoBind(this);
    isMobile = window.innerWidth < 500;
  }
  moveButton(e) {
    const buttonPosition = {
      x: isMobile ? e.nativeEvent.touches[0].clientX : e.nativeEvent.x,
      y: isMobile ? e.nativeEvent.touches[0].clientY : e.nativeEvent.y,
    };
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
    };
    const deployButtons = Object.keys(this.props.gameState).filter(key => key.includes('deploy'));
    return (
    <div className="antagonistView">
      <div
        className="movable mainButton"
        draggable={true}
        onDragEnd={this.moveButton}
        onTouchMove={this.moveButton}
        style={buttonStyle}
      >Move Button!</div>
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
