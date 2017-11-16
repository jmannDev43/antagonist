function getEventPosition(e) {
  const isMobile = navigator.userAgent.includes('Mobile');
  const eventPosition = {
    x: isMobile ? e.nativeEvent.touches[0].clientX : e.nativeEvent.x,
    y: isMobile ? e.nativeEvent.touches[0].clientY : e.nativeEvent.y,
  };
  return eventPosition;
}

export default getEventPosition;
