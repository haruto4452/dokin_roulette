window.addEventListener('DOMContentLoaded', () => {
  const spinButton   = document.getElementById('spinButton');
  const toggleText   = document.getElementById('toggle-text');
  const sadOverlay   = document.getElementById('sadOverlay');
  const confCanvas   = document.getElementById('confetti-canvas');

  /* ----- confetti 安全生成 ---------------------------------- */
  let confetti = () => {};
  if (window.confetti && window.confetti.create){
    confetti = window.confetti.create(confCanvas, { resize:true, useWorker:true });
  }

  spinButton.addEventListener('click', startSpin);

  /* util */
  const delay = ms => new Promise(res => setTimeout(res, ms));

  /* メイン処理 ------------------------------------------------ */
  async function startSpin(){
    spinButton.disabled = true;
    let flag = false;
    const interval = 100;   // 0.1 秒ごと切替
    const duration = 3000;  // 3 秒
    const loops    = duration / interval;

    /* 3 秒間交互点滅 */
    for (let i=0;i<loops;i++){
      toggleText.textContent = flag ? '申さず' : '申します';
      flag = !flag;
      await delay(interval);
    }

    /* 確定判定：1/3 で当たり */
    const outcome = Math.random() < (1/3) ? '申します' : '申さず';
    toggleText.textContent = outcome;

    if(outcome === '申します'){
      // ★ 当たり演出: コンフェティ大量発射
      for(let i=0;i<250;i++){
        confetti({ particleCount: 6 + Math.floor(Math.random()*8), spread: 70, origin:{ y: .6 } });
      }
    }else{
      // ★ 残念演出: 暗転＋「残念！」フェード
      sadOverlay.style.animation = 'sadShow 1.5s ease forwards';
      await delay(1500);
      sadOverlay.style.animation = '';   // reset
    }

    spinButton.disabled = false;
  }
});
