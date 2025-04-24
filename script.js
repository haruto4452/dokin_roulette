const spinButton = document.getElementById('spinButton');
const toggleText = document.getElementById('toggle-text');
const confettiCanvas = document.getElementById('confetti-canvas');
const confetti = window.confetti.create(confettiCanvas, { resize: true, useWorker: true });

function spinText(duration = 3000, interval = 100) {
  return new Promise(resolve => {
    let show = false;
    toggleText.style.opacity = 1;
    const timer = setInterval(() => {
      toggleText.textContent = show ? '申します' : '申さず';
      show = !show;
    }, interval);

    setTimeout(() => {
      clearInterval(timer);
      // 確率判定
      const outcome = Math.random() < 0.1 ? '申します' : '申さず';
      toggleText.textContent = outcome;
      resolve(outcome);
    }, duration);
  });
}

spinButton.addEventListener('click', async () => {
  spinButton.disabled = true;
  // テキストスピン
  const outcome = await spinText();

  if (outcome === '申します') {
    // コンフェティ演出
    for (let i = 0; i < 200; i++) {
      confetti({ particleCount: 5 + Math.floor(Math.random()*10), spread: 70, origin: { y: 0.6 } });
    }
  }

  spinButton.disabled = false;
});
