import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import trophy from '../images/trophy.svg';
import sadKid from '../images/kid-sad-face-new-york-1r6di21.jpg'
import RaisedButton from 'material-ui/RaisedButton';

const GameResultDialog = (props) => {
  const userWon = props.playerView === props.gameState.winner;
  const dialogImg = userWon ? trophy : sadKid;
  const imageClass = userWon ? '' : 'lost';
  const dialogTitle = userWon ? 'You Won!!!!' : 'You Lost...';
  const dialogDesc = userWon ?
    <span className="dialogDesc">You have thoroughly <i>embarrassed</i> your opponent. Play again and expand your reign!</span>
    : <span className="dialogDesc">Your good name has been sullied.  The only option now is <b>revenge</b>...</span>;
  const actions = [
    <RaisedButton
      label="Play Again"
      primary={false}
      onClick={() => props.updateGameState({ key: 'winner', data: '', isSender: true })}
    />
  ];
  return <Dialog
    title={dialogTitle}
    actions={actions}
    modal={false}
    open={!!props.gameState.winner}
    onRequestClose={() => props.updateGameState({ key: 'winner', data: '', isSender: true })}
    contentStyle={{ width: '100%', maxWidth: 'none', position: 'absolute', top: 0 }}
  >
    <img className={`gameResult ${imageClass}`} src={dialogImg} alt="gameResult" />
    {dialogDesc}
  </Dialog>
}

export default GameResultDialog;
