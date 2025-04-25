window.addEventListener('DOMContentLoaded', () => {
  const spinButton      = document.getElementById('spinButton');
  const toggleText      = document.getElementById('toggle-text');
  const sadOverlay      = document.getElementById('sadOverlay');
  const toukkinOverlay  = document.getElementById('toukkinOverlay');
  const confCanvas      = document.getElementById('confetti-canvas');
  const circles         = document.querySelectorAll('.circle');
  let litCount = 0;

  let confetti = () => {};
  if (window.confetti && window.confetti.create){
    confetti = window.confetti.create(confCanvas, { resize:true, useWorker:true });
  }

  spinButton.addEventListener('click', startSpin);
  const delay = ms => new Promise(res => setTimeout(res, ms));

  async function startSpin(){
    spinButton.disabled = true;
    let flag = false;
    for (let i=0;i<30;i++){
      toggleText.textContent = flag ? '申さず' : '申します';
      flag = !flag;
      await delay(100);
    }

    const outcome = Math.random() < (1/3) ? '申します' : '申さず';
    toggleText.textContent = outcome;

    if(outcome === '申します'){
      // 花火演出: 1.5秒で5発打ち上げ
      const bursts = 5;
      const interval = 1500 / bursts;
      for (let i = 0; i < bursts; i++) {
        confetti({
          particleCount: 40 + Math.floor(Math.random() * 20),
          startVelocity: 60,
          spread: 60,
          ticks: 100,
          origin: { x: Math.random() * 0.6 + 0.2, y: 1 }
        });
        await delay(interval);
      }
      // サークル点灯
      if(litCount < circles.length){
        circles[litCount].classList.add('active'); litCount++;
      }
      // 全点灯で銅金演出
      if(litCount >= circles.length){
        toukkinOverlay.style.opacity = '1';
        toukkinOverlay.style.animation = 'blink .5s ease-in-out infinite';
        await delay(3000);
        toukkinOverlay.style.animation = '';
        toukkinOverlay.style.opacity = '0';
        circles.forEach(c=>c.classList.remove('active')); litCount = 0;
      }
    } else {
      sadOverlay.style.animation = 'sadShow 1.5s ease forwards';
      await delay(1500);
      sadOverlay.style.animation = '';
    }

    spinButton.disabled = false;
  }
});
