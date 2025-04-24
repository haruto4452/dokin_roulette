/script.js
const spinButton = document.getElementById('spinButton');
const wheel = document.getElementById('wheel');
const resultDiv = document.getElementById('result');
const confettiCanvas = document.getElementById('confetti-canvas');
const confetti = window.confetti.create(confettiCanvas, { resize: true, useWorker: true });

function spinRoulette(options, probabilities) {
  const rnd = Math.random();
  let acc = 0;
  for (let i = 0; i < options.length; i++) {
    acc += probabilities[i];
    if (rnd < acc) return options[i];
  }
  return options[options.length - 1];
}

spinButton.addEventListener('click', () => {
  // 初期状態リセット
  resultDiv.style.opacity = 0;
  wheel.style.transform = 'rotate(0deg)';
  spinButton.disabled = true;

  // 回転アニメーション（3秒）
  const fullSpins = 8;
  const randomAngle = Math.random() * 360;
  const totalAngle = fullSpins * 360 + randomAngle;
  wheel.style.transition = 'transform 3s cubic-bezier(.17,.67,.83,.67)';
  wheel.style.transform = `rotate(${totalAngle}deg)`;

  setTimeout(() => {
    // 結果判定
    const outcome = spinRoulette(['申します', '申さず'], [0.1, 0.9]);
    resultDiv.textContent = `銅金と${outcome}`;
    resultDiv.style.opacity = 1;

    if (outcome === '申します') {
      // 大規模コンフェティ演出
      for (let i = 0; i < 300; i++) {
        confetti({ particleCount: 5 + Math.floor(Math.random() * 10), spread: 80, origin: { y: 0.6 } });
      }

      // RUSH判定
      if (spinRoulette([true, false], [1/30, 29/30])) {
        setTimeout(() => {
          // フラッシュ演出
          document.body.style.backgroundColor = '#fff';
          setTimeout(() => { document.body.style.backgroundColor = '#000'; }, 150);

          // RUSH中の再判定
          const rushOutcome = spinRoulette(['申します', '申さず'], [0.5, 0.5]);
          resultDiv.textContent = `銅金と${rushOutcome}`;
          if (rushOutcome === '申します') {
            for (let j = 0; j < 500; j++) {
              confetti({ particleCount: 10 + Math.floor(Math.random() * 20), spread: 120, origin: { y: 0.5 } });
            }
          }
          spinButton.disabled = false;
        }, 1000);
      } else {
        spinButton.disabled = false;
      }
    } else {
      spinButton.disabled = false;
    }
  }, 3000);
});
