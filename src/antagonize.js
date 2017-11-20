let player;

const antagonize = {
  deployCatVideo: (start, updateGameState) => {
    if (start) {
      player = new window.YT.Player('catVideo', {
        height: window.innerHeight,
        width: window.innerWidth,
        videoId: '-a75sRCC7Bg',
        events: {
          'onReady': event => setTimeout(() => event.target.playVideo(), 2000)
        }
      });
    } else {
      player && player.destroy();
    }
  },
  deployAds: (start, updateGameState) => {
    updateGameState({key: 'deployAds', data: start, isSender: true });
  },
  deployBlueScreen: (start, updateGameState) => {
    updateGameState({key: 'deployBlueScreen', data: start, isSender: true });
  },
  deployCopies: (start, updateGameState) => {
    updateGameState({key: 'deployCopies', data: start, isSender: true });
    if (start) {
      updateGameState({key: 'buttonPosition', data: { x: 270, y: 0 }, isSender: true });
    }
  },
  deployIeError: (start, updateGameState) => {
    updateGameState({key: 'deployIeError', data: start, isSender: true });
  },
  deployShrink: (start) => {
    const mainButton = document.querySelectorAll('.mainButton')[0];
    if (start) {
      return mainButton.classList.add('shrink');
    }
    return mainButton.classList.remove('shrink');
  },
};

export default antagonize;
