import React, { Component } from 'react';
import autoBind from 'react-autobind'

class AntagonistView extends Component {
  constructor() {
    super();
    autoBind(this);
  }
  moveButton(e) {
    const isMobile = window.innerWidth < 500;
    const buttonPosition = {
      x: isMobile ? e.nativeEvent.touches[0].clientX : e.nativeEvent.x,
      y: isMobile ? e.nativeEvent.touches[0].clientY : e.nativeEvent.y,
    };
    this.props.updateGameState('buttonPosition', buttonPosition);
  }
  render() {
    const buttonStyle = {
      left: this.props.buttonPosition.x,
      top: this.props.buttonPosition.y,
    };
    return (
    <div className="antagonistView">
      <div
        className="movable mainButton"
        draggable={true}
        onDragEnd={this.moveButton}
        onTouchMove={this.moveButton}
        style={buttonStyle}
      >Move Button</div>
    </div>
    )
  }
}

export default AntagonistView;
