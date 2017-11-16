import React, { Component } from 'react'; // eslint-disable-line
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
    <div className="dialogDesc">You have thoroughly <i>embarrassed</i> your opponent. Play again and expand your reign!</div>
    : <div className="dialogDesc">Your good name has been sullied.  The only option now is <b>revenge</b>...</div>;
  const actions = [
    <RaisedButton
      label="Play Again"
      primary={false}
      onClick={() => props.updateGameState({ key: 'winner', data: '', isSender: true })}
      style={{ marginRight: '1em' }}
    />,
    <RaisedButton
      label="Choose Player"
      primary={false}
      onClick={() => props.resetGame(true)}
      style={{ marginRight: '1em' }}
    />
  ];
  return <Dialog
    title={dialogTitle}
    actions={actions}
    modal={true}
    open={!!props.gameState.winner}
    onRequestClose={() => props.updateGameState({ key: 'winner', data: '', isSender: true })}
    contentStyle={{ width: '100%', maxWidth: 'none', position: 'absolute', top: 0 }}
  >
    <div className="gameResultWrapper">
      <img className={`gameResult ${imageClass}`} src={dialogImg} alt="gameResult" />
    </div>
    {dialogDesc}
  </Dialog>
}

export default GameResultDialog;
