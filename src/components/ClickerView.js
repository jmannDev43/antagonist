import React, { Component } from 'react';
import GameResultDialog from './GameResultDialog';
import autoBind from 'react-autobind';
import getEventPosition from '../getEventPosition';
import BugReport from 'material-ui/svg-icons/action/bug-report';
import FloatingActionButton from 'material-ui/FloatingActionButton';

class ClickerView extends Component {
  constructor() {
    super();
    autoBind(this);
    this.state = {
      disabled: false,
    }
  }
  sendClick(e) {
    const clickPosition = getEventPosition(e);
    this.props.updateGameState({ key: 'clickAttempt', data: clickPosition, isSender: true });
    setTimeout(() => {
      this.props.updateGameState({ key: 'clickAttempt', data: null, isSender: true });
    }, 750);
  }
  bugSystem() {
    this.setState({ disabled: true });
    this.props.updateGameState({ key: 'bugAntagonistScreen', data: true, isSender: true });
    setTimeout(() => {
      this.props.updateGameState({ key: 'bugAntagonistScreen', data: false, isSender: true });
    }, 2000);
    setTimeout(() => {
      this.setState({ disabled: false });
    }, 5000);

  }
  render() {
    const buttonStyle = {
      left: this.props.gameState.buttonPosition.x,
      top: this.props.gameState.buttonPosition.y,
    };
    return (
    <div className="clickerView" onClick={this.sendClick}>
      <a className="deployBug">
        <FloatingActionButton mini disabled={this.state.disabled} onClick={this.bugSystem}>
        <BugReport />
        </FloatingActionButton>
      </a>
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
