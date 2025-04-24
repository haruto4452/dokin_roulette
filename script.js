window.addEventListener('DOMContentLoaded', () => {
  const spinButton      = document.getElementById('spinButton');
  const toggleText      = document.getElementById('toggle-text');
  const sadOverlay      = document.getElementById('sadOverlay');
  const chanceOverlay   = document.getElementById('chanceOverlay');
  const rushEntryOverlay= document.getElementById('rushEntryOverlay');
  const toukkinOverlay  = document.getElementById('toukkinOverlay');
  const rushIndicator   = document.getElementById('rushIndicator');
  const confCanvas      = document.getElementById('confetti-canvas');
  const circles         = document.querySelectorAll('.circle');
  let litCount = 0;
  let chanceActive = false;
  let inRush = false;
  let rushSpinsLeft = 0;

  // confetti set up
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

    // 3秒間表示切替
    for (let i = 0; i < loops; i++) {
      toggleText.textContent = flag ? '申さず' : '申します';
      flag = !flag;
      await delay(interval);
    }

    // 判定確率
    const threshold = inRush ? 0.5 : (1/3);
    const outcome = Math.random() < threshold ? '申します' : '申さず';
    toggleText.textContent = outcome;

    if (!chanceActive && !inRush) {
      // ノーマル状態
      if (outcome === '申します') {
        // 通常コンフェティ
        for (let i = 0; i < 200; i++) {
          confetti({ particleCount: 5 + Math.floor(Math.random()*10), spread: 80, origin:{ y:.6 } });
        }
        // チャンス判定 1/3
        if (Math.random() < (1/3)) {
          chanceActive = true;
          chanceOverlay.style.animation = 'chanceShow 1.5s ease forwards';
          await delay(1500);
          chanceOverlay.style.animation = '';
        }
      } else {
        // 残念演出
        sadOverlay.style.animation = 'sadShow 1.5s ease forwards';
        await delay(1500);
        sadOverlay.style.animation = '';
      }
    } else if (chanceActive && !inRush) {
      // チャンス状態
      if (outcome === '申します') {
        // ラッシュ突入演出
        rushEntryOverlay.style.animation = 'rushShow 1.5s ease forwards';
        await delay(1500);
        rushEntryOverlay.style.animation = '';
        inRush = true; rushSpinsLeft = 7;
        rushIndicator.style.opacity = '1';
      } else {
        // チャンス消滅
        chanceActive = false;
      }
    } else if (inRush) {
      // ラッシュ状態
      if (outcome === '申します') {
        for (let i = 0; i < 200; i++) {
          confetti({ particleCount: 5 + Math.floor(Math.random()*10), spread: 80, origin:{ y:.6 } });
        }
      }
      rushSpinsLeft--;
      if (rushSpinsLeft <= 0) {
        inRush = false; chanceActive = false;
        rushIndicator.style.opacity = '0';
      }
    }

    spinButton.disabled = false;
  }
});
