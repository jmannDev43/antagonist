import React, { Component } from 'react';

class ClickerView extends Component {
  render() {
    const buttonStyle = {
      left: this.props.buttonPosition.x,
      top: this.props.buttonPosition.y,
    };
    return (
    <div className="clickerView">
      <div
        className="mainButton"
        style={buttonStyle}
        onClick={() => this.props.updateGameState('winner', 'clicker')}
      >Click me!!!</div>
    </div>
    )
  }
}

export default ClickerView;
