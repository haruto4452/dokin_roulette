window.addEventListener('DOMContentLoaded', () => {
  const spinButton    = document.getElementById('spinButton');
  const toggleText    = document.getElementById('toggle-text');
  const sadOverlay    = document.getElementById('sadOverlay');
  const confCanvas    = document.getElementById('confetti-canvas');

  // confetti ライブラリが使えなければ no-op
  let confetti = () => {};
  if (window.confetti && window.confetti.create) {
    confetti = window.confetti.create(confCanvas, { resize: true, useWorker: true });
  }

  spinButton.addEventListener('click', startSpin);

  const delay = ms => new Promise(res => setTimeout(res, ms));

  async function startSpin() {
    spinButton.disabled = true;
    let flag = false;
    const interval = 100;
    const duration = 3000;
    const loops    = duration / interval;

    // 3秒間、交互に点滅
    for (let i = 0; i < loops; i++) {
      toggleText.textContent = flag ? '申さず' : '申します';
      flag = !flag;
      await delay(interval);
    }

    // 確定判定：1/3で「申します」
    const outcome = Math.random() < (1 / 3) ? '申します' : '申さず';
    toggleText.textContent = outcome;

    if (outcome === '申します') {
      // ★ 元の “申します” 演出：200回コンフェティだけ
      for (let i = 0; i < 200; i++) {
        confetti({
          particleCount: 5 + Math.floor(Math.random() * 10),
          spread: 80,
          origin: { y: 0.6 }
        });
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
