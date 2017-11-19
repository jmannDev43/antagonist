import React, { Component } from 'react';

function pad(number) {
  if (number === 60) {
    return '00';
  }
  return number < 10 ? `0${number}` : number.toString();
}

let intervalId;

class Countdown extends Component {
  constructor() {
    super()
    this.state = {
      minutes: 2,
      seconds: 60
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
    this.setState({ seconds: 60, minutes: 2 });
  }
  runCountDown() {
    intervalId = setInterval(() => {
      let minutes = this.state.minutes;
      let seconds = this.state.seconds;
      if (seconds === 60 && minutes > 0) {
        minutes -= 1;
        seconds -= 1;
      } else if (seconds === 0) {
        seconds = 59;
        minutes = minutes && minutes - 1;
      } else {
        seconds -= 1;
      }
      this.setState({ seconds, minutes })
      if (seconds === 0 && minutes === 0) {
        this.stopCountDown();
        this.props.updateGameState({ key: 'winner', data: 'antagonist', isSender: true });
      }
    }, 1000);
  }
  render() {
    return (
      <div className="countDownWrapper">
        <h1 className="countDown">
          0{this.state.minutes}:{pad(this.state.seconds)}
        </h1>
      </div>
    )
  }
}

export default Countdown;
