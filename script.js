// DOM読み込み後に初期化
window.addEventListener('DOMContentLoaded', () => {
  const spinButton = document.getElementById('spinButton');
  const toggleText = document.getElementById('toggle-text');
  const confettiCanvas = document.getElementById('confetti-canvas');
  const confetti = window.confetti.create(confettiCanvas, { resize: true, useWorker: true });

  spinButton.addEventListener('click', startSpin);

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function startSpin() {
    spinButton.disabled = true;
    let current = false;
    // 3秒間100msごとに交互表示
    const interval = 100;
    const duration = 3000;
    const loops = duration / interval;
    for (let i = 0; i < loops; i++) {
      toggleText.textContent = current ? '申さず' : '申します';
      current = !current;
      await delay(interval);
    }
    // 最終結果
    const outcome = Math.random() < 0.1 ? '申します' : '申さず';
    toggleText.textContent = outcome;
    // 当たり演出
    if (outcome === '申します') {
      for (let i = 0; i < 200; i++) {
        confetti({ particleCount: 5 + Math.floor(Math.random()*10), spread: 70, origin: { y: 0.6 } });
      }
    }
    spinButton.disabled = false;
  }
});
