window.addEventListener('DOMContentLoaded', () => {
  const spinButton = document.getElementById('spinButton');
  const toggleText = document.getElementById('toggle-text');
  const sadOverlay = document.getElementById('sadOverlay');
  const rushOverlay = document.getElementById('rushOverlay');
  const confCanvas = document.getElementById('confetti-canvas');

  // confetti 安全生成
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
    const loops = duration / interval;

    // ３秒間交互点滅
    for (let i = 0; i < loops; i++) {
      toggleText.textContent = flag ? '申さず' : '申します';
      flag = !flag;
      await delay(interval);
    }

    // 初回判定：1/3で当たり
    const initialOutcome = Math.random() < (1/3) ? '申します' : '申さず';
    toggleText.textContent = initialOutcome;

    if (initialOutcome === '申します') {
      // ラッシュ突入判定：1/3
      if (Math.random() < (1/3)) {
        // ★ RUSH 演出 ★
        rushOverlay.style.animation = 'rushShow 2s ease forwards';

        // 超大量コンフェティ
        for (let i = 0; i < 500; i++) {
          confetti({
            particleCount: 10 + Math.floor(Math.random() * 20),
            spread: 100,
            origin: { y: 0.5 }
          });
        }

        // ５回連続「申します」を確定
        for (let j = 0; j < 5; j++) {
          await delay(400);
          toggleText.textContent = '申します';
          confetti({
            particleCount: 5 + Math.floor(Math.random() * 5),
            spread: 50,
            origin: { y: 0.6 }
          });
        }

      } else {
        // 通常当たり演出
        for (let i = 0; i < 250; i++) {
          confetti({
            particleCount: 6 + Math.floor(Math.random() * 8),
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }

    } else {
      // 残念演出
      sadOverlay.style.animation = 'sadShow 1.5s ease forwards';
      await delay(1500);
      sadOverlay.style.animation = '';
    }

    // RUSH オーバーレイ reset
    rushOverlay.style.animation = '';
    spinButton.disabled = false;
  }
});
