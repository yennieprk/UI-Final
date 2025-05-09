document.addEventListener('DOMContentLoaded', function() {
    let results = JSON.parse(localStorage.getItem('quizResults') || '[null,null,null,null,null,null,null,null]');
    let correct = results.filter(x => x === true).length;
    const resultText = document.createElement('p');
    resultText.style.fontSize = '1.3rem';
    resultText.style.marginTop = '1.5rem';
    resultText.textContent = `You got ${correct} out of 8 correct!`;
    const completeBox = document.querySelector('.quiz-complete');
    if (completeBox) completeBox.insertBefore(resultText, completeBox.querySelector('.result-button-row'));
});
