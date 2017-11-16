import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import trophy from '../images/trophy.svg';
import sadKid from '../images/kid-sad-face-new-york-1r6di21.jpg'
import FlatButton from 'material-ui/FlatButton';

const GameResultDialog = (props) => {
  const userWon = props.playerView === props.gameState.winner;
  const dialogImg = userWon ? trophy : sadKid;
  const dialogTitle = userWon ? 'You Won!!!!' : 'You Lost...';
  const dialogDesc = userWon ?
    <span>You have thoroughly <i>embarrassed</i> your opponent. Play again and expand your reign!</span>
    : <span>Your good name has been sullied.  The only option now is <b>revenge</b>...</span>;
  const actions = [
    <FlatButton
      label="Close"
      primary={true}
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
    <img className="gameResult" src={dialogImg} alt="gameResult" />
    {dialogDesc}
  </Dialog>
}

export default GameResultDialog;
