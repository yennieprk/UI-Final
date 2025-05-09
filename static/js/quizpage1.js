document.addEventListener('DOMContentLoaded', function() {
    // --- Quiz Data --- 
    const instruments = [
        {
            name: 'Haegeum',
            image: '/static/image/haegeum.png',
            sound: 'haegeum.mp3'
        },
        {
            name: 'Gayageum',
            image: 'https://designlifemica.weebly.com/uploads/6/4/7/5/64757185/1694964892_orig.gif',
            sound: 'gayageum.mp3'
        },
        {
            name: 'Janggu',
            image: '/static/image/janggu.png',
            sound: 'janggu.mp3'
        },
        {
            name: 'Piri',
            image: '/static/image/piri.png', 
            sound: 'piri.mp3'
        },
        {
            name: 'Daegeum',
            image: '/static/image/daegeum.png',
            sound: 'daegeum.mp3'
        },
        {
            name: 'Geomungo',
            image: '/static/image/geomungo.png',
            sound: 'geomungo.mp3'
        },
        {
            name: 'Jing',
            image: '/static/image/jing.png',
            sound: 'jing.mp3'
        },
        {
            name: 'Kkwaenggwari',
            image: '/static/image/kkwaenggwari.png',
            sound: 'kkwaenggwari.mp3'
        }
    ];

    const TOTAL_QUESTIONS = 5;
    let currentQuestionIndex = 0;
    let questions = [];
    let currentAudio = null;
    let selectedAnswer = null;

    // --- DOM Elements --- 
    const questionNumberEl = document.getElementById('question-number');
    const instrumentImageEl = document.getElementById('instrument-image');
    const optionButtons = document.querySelectorAll('.option-button');
    const soundButton = document.querySelector('.sound-button');
    const nextButton = document.getElementById('next-button');

    function shuffle(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    function getRandomInstruments(count, exclude = []) {
        const excludeNames = exclude.map(item => item.name);
        const available = instruments.filter(i => !excludeNames.includes(i.name));
        return shuffle([...available]).slice(0, count);
    }

    function createUniqueQuestions(numQuestions) {
        const shuffledInstruments = shuffle([...instruments]);
        const selectedCorrectInstruments = shuffledInstruments.slice(0, numQuestions);
        return selectedCorrectInstruments.map(correctInstrument => {
            const wrongOptions = getRandomInstruments(2, [correctInstrument]);
            return {
                instrument: correctInstrument,
                options: shuffle([...wrongOptions, correctInstrument])
            };
        });
    }

    function updateQuestion() {
        if (currentQuestionIndex >= questions.length) {
            window.location.href = '/quiz2';
            return;
        }
        const question = questions[currentQuestionIndex];
        questionNumberEl.textContent = `${currentQuestionIndex + 1}.`;
        instrumentImageEl.src = question.instrument.image;
        instrumentImageEl.alt = question.instrument.name; 
        nextButton.disabled = true;
        selectedAnswer = null;
        optionButtons.forEach((button, index) => {
            button.classList.remove('correct', 'incorrect', 'selected');
            button.disabled = false;
            if (question.options[index]) {
                button.textContent = question.options[index].name;
                button.style.display = '';
            } else {
                button.style.display = 'none';
            }
        });
        stopSound();
    }

    function playSound() {
        const question = questions[currentQuestionIndex];
        const soundFile = question?.instrument?.sound;
        if (!soundFile) return;
        const soundSrc = `/static/sounds/${soundFile}`;
        if (currentAudio && currentAudio.src.endsWith(soundSrc)) {
            if (currentAudio.paused) {
                currentAudio.play().then(() => {
                    soundButton.classList.add('playing');
                }).catch(() => stopSound());
            } else {
                currentAudio.pause();
                soundButton.classList.remove('playing');
            }
        } else {
            stopSound();
            currentAudio = new Audio(soundSrc);
            currentAudio.addEventListener('ended', () => soundButton.classList.remove('playing'));
            currentAudio.addEventListener('pause', () => { if (currentAudio && !currentAudio.ended) soundButton.classList.remove('playing'); });
            currentAudio.addEventListener('play', () => soundButton.classList.add('playing'));
            currentAudio.play().then(() => soundButton.classList.add('playing')).catch(() => stopSound());
        }
    }

    function stopSound() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }
        soundButton.classList.remove('playing');
    }

    function handleOptionClick(button) {
        if (button.disabled) return;
        selectedAnswer = button.textContent;
        optionButtons.forEach(b => b.classList.remove('selected'));
        button.classList.add('selected');
        checkAnswer();
    }

    function checkAnswer() {
        if (!selectedAnswer) return;
        const question = questions[currentQuestionIndex];
        const isCorrect = selectedAnswer === question.instrument.name;
        optionButtons.forEach(button => {
            button.disabled = true;
            if (button.textContent === question.instrument.name) {
                button.classList.add('correct');
            } else if (button.textContent === selectedAnswer && !isCorrect) {
                button.classList.add('incorrect');
            }
        });
        nextButton.disabled = false;
    }

    function handleNext() {
        stopSound();
        currentQuestionIndex++;
        updateQuestion();
    }

    optionButtons.forEach(button => {
        button.addEventListener('click', () => handleOptionClick(button));
    });
    soundButton.addEventListener('click', playSound);
    nextButton.addEventListener('click', handleNext);

    // Start the quiz
    questions = createUniqueQuestions(TOTAL_QUESTIONS);
    updateQuestion();
});
