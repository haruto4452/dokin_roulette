window.addEventListener('DOMContentLoaded', () => {
  const spinButton   = document.getElementById('spinButton');
  const toggleText   = document.getElementById('toggle-text');
  const sadOverlay   = document.getElementById('sadOverlay');
  const toukkinOverlay = document.getElementById('toukkinOverlay');
  const confCanvas   = document.getElementById('confetti-canvas');
  const circles      = document.querySelectorAll('.circle');
  let litCount = 0;

  let confetti = () => {};
  if (window.confetti && window.confetti.create) {
    confetti = window.confetti.create(confCanvas, { resize:true, useWorker:true });
  }

  spinButton.addEventListener('click', startSpin);
  const delay = ms => new Promise(res => setTimeout(res, ms));

  async function startSpin() {
    spinButton.disabled = true;
    let flag = false;
    const interval = 100;
    const duration = 3000;
    const loops    = duration / interval;

    // 3秒間交互表示
    for (let i = 0; i < loops; i++) {
      toggleText.textContent = flag ? '申さず' : '申します';
      flag = !flag;
      await delay(interval);
    }

    // 最終判定: 1/3で当たり
    const outcome = Math.random() < (1/3) ? '申します' : '申さず';
    toggleText.textContent = outcome;

    if (outcome === '申します') {
      // コンフェティ
      for (let i = 0; i < 250; i++) {
        confetti({ particleCount: 6 + Math.floor(Math.random()*8), spread: 70, origin:{ y: .6 } });
      }
      // サークル点灯
      if (litCount < circles.length) {
        circles[litCount].classList.add('active');
        litCount++;
      }
      // 全点灯達成
      if (litCount >= circles.length) {
        // 銅金演出
        toukkinOverlay.style.opacity = '1';
        toukkinOverlay.style.animation = 'blink 0.5s ease-in-out infinite';
        await delay(3000);
        toukkinOverlay.style.animation = '';
        toukkinOverlay.style.opacity = '0';
        // リセット
        circles.forEach(c => c.classList.remove('active'));
        litCount = 0;
      }
    } else {
      // 残念演出
      sadOverlay.style.animation = 'sadShow 1.5s ease forwards';
      await delay(1500);
      sadOverlay.style.animation = '';
    }

    spinButton.disabled = false;
  }
});
