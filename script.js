const spinButton = document.getElementById('spinButton');
const resultDiv = document.getElementById('result');
const animationDiv = document.getElementById('animation');

function spinRoulette(options, probabilities) {
  const rnd = Math.random();
  let acc = 0;
  for (let i = 0; i < options.length; i++) {
    acc += probabilities[i];
    if (rnd < acc) return options[i];
  }
  return options[options.length - 1];
}

function playAnimation(type) {
  animationDiv.className = 'roulette-animation';
  if (type === 'hit') {
    animationDiv.textContent = '🎉 当たり！';
    animationDiv.classList.add('hit');
  } else if (type === 'rush') {
    animationDiv.textContent = '💥 RUSH突入！';
    animationDiv.classList.add('rush');
  }
  // アニメーション後にクリア
  setTimeout(() => {
    animationDiv.textContent = '';
    animationDiv.className = 'roulette-animation';
  }, 1800);
}

spinButton.addEventListener('click', () => {
  // 初回ルーレット
  const outcome = spinRoulette(['申します', '申さず'], [0.1, 0.9]);
  resultDiv.textContent = `銅金と${outcome}`;
  if (outcome === '申します') {
    playAnimation('hit');
    // RUSH判定
    if (spinRoulette([true, false], [1/30, 29/30])) {
      playAnimation('rush');
      // RUSHモード後の結果
      setTimeout(() => {
        const rushOutcome = spinRoulette(['申します', '申さず'], [0.5, 0.5]);
        resultDiv.textContent = `銅金と${rushOutcome}`;
        if (rushOutcome === '申します') playAnimation('hit');
      }, 800);
    }
  }
});
