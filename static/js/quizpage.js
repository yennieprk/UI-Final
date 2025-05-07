document.addEventListener('DOMContentLoaded', function() {
    // Add active class to Quiz link in navbar
    document.querySelectorAll('.nav-link-custom').forEach(link => link.classList.remove('active'));
    const quizLink = document.querySelector('a[href="/quiz"]');
    if (quizLink) {
        quizLink.classList.add('active');
    }

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
        // Add more instruments if you want more variety for options
    ];

    const TOTAL_QUESTIONS = 5;
    let currentQuestionIndex = 0;
    let score = 0;
    let questions = [];
    let currentAudio = null;
    let selectedAnswer = null;

    // --- DOM Elements --- 
    const questionNumberEl = document.getElementById('question-number');
    const questionTextEl = document.querySelector('.question-text'); // Assuming only one h2
    const instrumentImageEl = document.getElementById('instrument-image');
    const optionButtons = document.querySelectorAll('.option-button');
    const soundButton = document.querySelector('.sound-button');
    const nextButton = document.getElementById('next-button');
    const quizContainer = document.querySelector('.quiz-container');
    const quizCompleteSection = document.getElementById('quiz-complete');
    const finalScoreEl = document.getElementById('final-score');
    const totalScoreEl = document.getElementById('total-score');
    const retryButton = document.getElementById('retry-button');

    // --- Helper Functions --- 
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

    // --- Core Quiz Logic --- 
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
            showResults();
            return;
        }
        const question = questions[currentQuestionIndex];
        
        // Update UI elements
        questionNumberEl.textContent = `${currentQuestionIndex + 1}.`;
        // questionTextEl.textContent remains "What is this instrument?" (can be changed if needed)
        instrumentImageEl.src = question.instrument.image;
        instrumentImageEl.alt = question.instrument.name; 
        
        // Reset options
        nextButton.disabled = true;
        selectedAnswer = null;
        optionButtons.forEach((button, index) => {
            button.classList.remove('correct', 'incorrect', 'selected');
            button.disabled = false;
            if (question.options[index]) {
                 button.textContent = question.options[index].name;
                 button.style.display = ''; 
            } else {
                 button.style.display = 'none'; // Should not happen with 3 options
            }
        });
        
        stopSound();
    }

    function playSound() {
        const question = questions[currentQuestionIndex];
        const soundFile = question?.instrument?.sound;
        
        if (!soundFile) {
            console.warn("Sound file not found for current instrument.");
            return;
        }

        const soundSrc = `/static/sounds/${soundFile}`;

        // Check if audio exists and is for the current sound
        if (currentAudio && currentAudio.src.endsWith(soundSrc)) {
            if (currentAudio.paused) {
                currentAudio.play()
                    .then(() => {
                        soundButton.classList.add('playing');
                    })
                    .catch(e => {
                        console.error("Error playing sound:", e);
                        stopSound();
                    });
            } else {
                currentAudio.pause();
                soundButton.classList.remove('playing');
            }
        } else {
            // Stop any previous sound and create new audio
            stopSound();
            currentAudio = new Audio(soundSrc);
            
            // Add listener for when the sound naturally ends
            currentAudio.addEventListener('ended', () => {
                soundButton.classList.remove('playing');
            });
            
            // Add listener for pause events
            currentAudio.addEventListener('pause', () => {
                if (currentAudio && !currentAudio.ended) {
                    soundButton.classList.remove('playing');
                }
            });
            
            // Add listener for play events
            currentAudio.addEventListener('play', () => {
                soundButton.classList.add('playing');
            });

            currentAudio.play()
                .then(() => {
                    soundButton.classList.add('playing');
                })
                .catch(e => {
                    console.error("Error playing sound:", e);
                    stopSound();
                });
        }
    }

    function stopSound() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.removeEventListener('ended', () => {});
            currentAudio.removeEventListener('pause', () => {});
            currentAudio.removeEventListener('play', () => {});
            currentAudio = null;
        }
        soundButton.classList.remove('playing');
    }

    function handleOptionClick(button) {
        if (button.disabled) return;
        selectedAnswer = button.textContent;
        
        // Visual selection indicator (optional)
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

        if (isCorrect) score++;
        nextButton.disabled = false;
    }

    function handleNext() {
        stopSound(); 
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            updateQuestion();
        } else {
            showResults();
        }
    }

    function showResults() {
        stopSound();
        quizContainer.classList.add('hidden');
        quizCompleteSection.classList.remove('hidden');
        finalScoreEl.textContent = score;
        totalScoreEl.textContent = questions.length;
    }

    function initializeQuiz() {
        questions = createUniqueQuestions(TOTAL_QUESTIONS);
        if (questions.length < TOTAL_QUESTIONS) {
             console.error(`Could not generate ${TOTAL_QUESTIONS} unique questions. Only ${questions.length} available.`);
             // Handle this case - maybe show fewer questions or an error
        }
        currentQuestionIndex = 0;
        score = 0;
        updateQuestion();
        quizCompleteSection.classList.add('hidden');
        quizContainer.classList.remove('hidden');
    }

    // --- Event Listeners --- 
    optionButtons.forEach(button => {
        button.addEventListener('click', () => handleOptionClick(button));
    });

    soundButton.addEventListener('click', playSound);
    nextButton.addEventListener('click', handleNext);
    retryButton.addEventListener('click', initializeQuiz);

    // --- Start the quiz --- 
    if(instruments.length < 3) {
         console.error("Not enough instruments defined to create 3 options.");
         // Display an error message to the user on the page
    } else {
        initializeQuiz();
    }
});
