window.addEventListener('DOMContentLoaded', () => {
  /* === 要素取得 === */
  const spinButton      = document.getElementById('spinButton');
  const toggleText      = document.getElementById('toggle-text');
  const sadOverlay      = document.getElementById('sadOverlay');
  const toukkinOverlay  = document.getElementById('toukkinOverlay');
  const confCanvas      = document.getElementById('confetti-canvas');
  const circles         = document.querySelectorAll('.circle');
  let litCount = 0;

  /* === confetti 安全生成 === */
  let confetti = () => {};
  if (window.confetti && window.confetti.create){
    confetti = window.confetti.create(confCanvas, { resize:true, useWorker:true });
  }

  spinButton.addEventListener('click', startSpin);
  const delay = ms => new Promise(res => setTimeout(res, ms));

  /* === メイン処理 =========================================== */
  async function startSpin(){
    spinButton.disabled = true;

    /* 3 秒間 0.1 秒毎にテキスト交互点滅 */
    let flag = false;
    for (let i=0;i<30;i++){
      toggleText.textContent = flag ? '申さず' : '申します';
      flag = !flag;
      await delay(100);
    }

    /* 1/3 で当たり */
    const outcome = Math.random() < (1/3) ? '申します' : '申さず';
    toggleText.textContent = outcome;

    if(outcome === '申します'){
      /* ---- 当たり演出 ---- */
      for(let i=0;i<250;i++){
        confetti({ particleCount:6+Math.floor(Math.random()*8), spread:70, origin:{ x:0.5, y:0.6 } });
      }
      if(litCount < circles.length){
        circles[litCount].classList.add('active');
        litCount++;
      }
      /* 5 つすべて点灯したら銅金演出 */
      if(litCount >= circles.length){
        toukkinOverlay.style.opacity = '1';
        toukkinOverlay.style.animation = 'blink .5s ease-in-out infinite';
        await delay(3000);
        toukkinOverlay.style.animation = '';
        toukkinOverlay.style.opacity = '0';
        circles.forEach(c=>c.classList.remove('active'));
        litCount = 0;
      }
    }else{
      /* ---- 残念演出 ---- */
      sadOverlay.style.animation = 'sadShow 1.5s ease forwards';
      await delay(1500);
      sadOverlay.style.animation = '';
    }

    spinButton.disabled = false;
  }
});
