let player;

const antagonize = {
  deployCatVideo: (start) => {
    if (start) {
      player = new window.YT.Player('catVideo', {
        height: window.innerHeight,
        width: window.innerWidth,
        videoId: '-a75sRCC7Bg',
        events: {
          'onReady': event => event.target.playVideo()
        }
      });
    } else {
      player.destroy();
    }
  },
  deployAds: (start, updateGameState) => {
    updateGameState('deployAds', start, true);
  },
  deployBlueScreen: (start, updateGameState) => {
    updateGameState('deployAds', start, true);
  },
  deployCopies: (start, updateGameState) => {
    updateGameState('deployCopies', start, true);
  },
  deployIeError: (start, updateGameState) => {
    updateGameState('deployIeError', start, true);
  },
  deployShrink: (start) => {
    const mainButton = document.querySelectorAll('.mainButton')[0];
    if (start) {
      return mainButton.style.transform = 'scale(0.2)';
    }
    mainButton.style.transform = 'scale(1)';
  },
};

export default antagonize;
