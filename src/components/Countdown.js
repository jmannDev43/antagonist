import React, { Component } from 'react';

function pad(number) {
  return number < 10 ? `0${number}` : number.toString();
}

let intervalId;

class Countdown extends Component {
  constructor() {
    super()
    this.state = {
      secondsRemaining: 30
    }
  }
  componentDidMount() {
    this.runCountDown();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.winner !== this.props.winner) {
      if (this.props.winner) {
        this.stopCountDown();
      } else {
        this.runCountDown();
      }
    }
  }
  stopCountDown() {
    clearInterval(intervalId);
    this.props.updateGameState({ key: 'winner', data: 'antagonist', isSender: true });
    this.setState({ secondsRemaining: 30 });
  }
  runCountDown() {
    intervalId = setInterval(() => {
      const secondsRemaining = this.state.secondsRemaining - 1;
      this.setState({ secondsRemaining })
      if (secondsRemaining === 0) {
        this.stopCountDown();
      }
    }, 1000);
  }
  render() {
    return (
      <div className="countDownWrapper">
        <h1 className="countDown">
          00:{pad(this.state.secondsRemaining)}
        </h1>
      </div>
    )
  }
}

export default Countdown;
