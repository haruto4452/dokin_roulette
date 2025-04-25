/* ========= script.js  =========
   - 花火演出を中央揃えに修正
   - window.confetti のデフォルトキャンバスをそのまま使用
   - 「申します」確率 1/3、外れで残念演出
   - 5 つの丸が順点灯 → 完点灯で「銅金です!!!」3 秒点滅
================================ */

window.addEventListener('DOMContentLoaded', () => {
  /* --- DOM 要素 --- */
  const spinButton     = document.getElementById('spinButton');
  const toggleText     = document.getElementById('toggle-text');
  const sadOverlay     = document.getElementById('sadOverlay');
  const toukkinOverlay = document.getElementById('toukkinOverlay');
  const circles        = document.querySelectorAll('.circle');

  /* --- confetti （デフォルトキャンバス）--- */
  const confetti = window.confetti;      // 追加 canvas は不要
  const delay    = ms => new Promise(res => setTimeout(res, ms));

  let litCount = 0;                      // 丸の点灯数

  spinButton.addEventListener('click', startSpin);

  /* ===== メイン処理 ===== */
  async function startSpin () {
    spinButton.disabled = true;

    /* 3 秒間、0.1 秒毎にテキスト交互点滅 */
    let flag = false;
    for (let i = 0; i < 30; i++) {
      toggleText.textContent = flag ? '申さず' : '申します';
      flag = !flag;
      await delay(100);
    }

    /* 抽選（1/3 が当たり） */
    const outcome = Math.random() < (1 / 3) ? '申します' : '申さず';
    toggleText.textContent = outcome;

    if (outcome === '申します') {
      /* ===== 当たり：1.5 秒で花火 5 発 ===== */
      const bursts   = 5;
      const interval = 1500 / bursts;      // → 300ms 間隔
      for (let i = 0; i < bursts; i++) {
        confetti({
          particleCount : 40 + Math.floor(Math.random() * 20),
          startVelocity : 60,
          spread        : 60,
          ticks         : 100,
          origin        : {                    // 画面下部から発射
            x: Math.random() * 0.6 + 0.2,      // 横 20%〜80%
            y: 1                               // 縦 100%（下端）
          }
        });
        await delay(interval);
      }

      /* 丸を点灯 → 全点灯なら「銅金」です演出 */
      if (litCount < circles.length) {
        circles[litCount].classList.add('active');
        litCount++;
      }
      if (litCount >= circles.length) {
        toukkinOverlay.style.opacity   = '1';
        toukkinOverlay.style.animation = 'blink .5s ease-in-out infinite';
        await delay(3000);
        toukkinOverlay.style.animation = '';
        toukkinOverlay.style.opacity   = '0';
        circles.forEach(c => c.classList.remove('active'));
        litCount = 0;
      }

    } else {
      /* ===== 外れ：残念演出 ===== */
      sadOverlay.style.animation = 'sadShow 1.5s ease forwards';
      await delay(1500);
      sadOverlay.style.animation = '';
    }

    spinButton.disabled = false;
  }
});
