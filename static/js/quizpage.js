document.addEventListener('DOMContentLoaded', function() {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link-custom').forEach(link => link.classList.remove('active'));
    // Add active class to Quiz link
    document.querySelector('a[href="/quiz"]').classList.add('active');

    // Quiz data
    const instruments = [
        {
            name: 'Haegeum',
            image: 'https://lh3.googleusercontent.com/proxy/s8eoAEHxwqlj5peqRHCzm33iLgYYkSGGwz-3M7LWoINsjVO-Y6LG4YFX6VFUvFdLZJR1WDpefU5mNjGHJpQZ3d78dsB7AlzXHjLy5AwyxPmu9YmRqAfVeg',
            sound: 'haegeum.mp3'
        },
        {
            name: 'Gayageum',
            image: 'https://designlifemica.weebly.com/uploads/6/4/7/5/64757185/1694964892_orig.gif',
            sound: 'gayageum.mp3'
        },
        {
            name: 'Janggu',
            image: 'https://t3.ftcdn.net/jpg/11/08/49/66/360_F_1108496624_6J2WQ2bv0p0hrYXkhFQwDMcWwB12kmuA.jpg',
            sound: 'janggu.mp3'
        },
        {
            name: 'Piri',
            image: 'https://i.pinimg.com/474x/92/dd/81/92dd81d9ec30e416e3945d8fe4d0f3b4.jpg',
            sound: 'piri.mp3'
        },
        {
            name: 'Daegeum',
            image: 'https://organology.net/storage/2024/07/Daegeum-6.jpeg',
            sound: 'daegeum.mp3'
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;
    let questions = [];
    let currentAudio = null;
    let selectedAnswer = null;
    let draggedImage = null;

    // Initialize quiz
    function initializeQuiz() {
        // Create questions array with different types
        questions = [
            createNameQuestion(),     // Type 1: Image + Name Selection
            createSoundQuestion(),    // Type 2: Image + Sound Selection
            createListenQuestion(),   // Type 3: Sound + Name Selection
            createMatchingQuestion()  // Type 4: Multiple Image Matching
        ];

        currentQuestionIndex = 0;
        score = 0;
        updateQuestion();
        updateProgress();
        
        document.getElementById('quiz-complete').classList.add('hidden');
        document.querySelector('.quiz-container').classList.remove('hidden');
    }

    // Create different question types
    function createNameQuestion() {
        const correctInstrument = getRandomInstrument();
        const wrongOptions = getRandomInstruments(2, [correctInstrument]);
        
        return {
            type: 1,
            instrument: correctInstrument,
            options: shuffle([...wrongOptions, correctInstrument])
        };
    }

    function createSoundQuestion() {
        const correctInstrument = getRandomInstrument();
        const wrongOptions = getRandomInstruments(2, [correctInstrument]);
        
        return {
            type: 2,
            instrument: correctInstrument,
            options: shuffle([...wrongOptions, correctInstrument])
        };
    }

    function createListenQuestion() {
        const correctInstrument = getRandomInstrument();
        const wrongOptions = getRandomInstruments(2, [correctInstrument]);
        
        return {
            type: 3,
            instrument: correctInstrument,
            options: shuffle([...wrongOptions, correctInstrument])
        };
    }

    function createMatchingQuestion() {
        const selectedInstruments = getRandomInstruments(3);
        return {
            type: 4,
            instruments: selectedInstruments,
            options: shuffle([...selectedInstruments])
        };
    }

    // Helper functions
    function getRandomInstrument() {
        return instruments[Math.floor(Math.random() * instruments.length)];
    }

    function getRandomInstruments(count, exclude = []) {
        const available = instruments.filter(i => !exclude.includes(i));
        return shuffle(available).slice(0, count);
    }

    function shuffle(array) {
        return [...array].sort(() => Math.random() - 0.5);
    }

    // Update the current question
    function updateQuestion() {
        const question = questions[currentQuestionIndex];
        
        // Hide all question types
        document.querySelectorAll('.question-type').forEach(el => el.classList.add('hidden'));
        
        // Show current question type
        document.querySelector(`.type-${question.type}`).classList.remove('hidden');
        
        // Reset check button and selected answer
        document.getElementById('check-button').disabled = false;
        document.getElementById('next-button').disabled = true;
        selectedAnswer = null;

        switch(question.type) {
            case 1:
                updateNameQuestion(question);
                break;
            case 2:
                updateSoundQuestion(question);
                break;
            case 3:
                updateListenQuestion(question);
                break;
            case 4:
                updateMatchingQuestion(question);
                break;
        }
    }

    function updateNameQuestion(question) {
        document.querySelector('.type-1 img').src = question.instrument.image;
        document.querySelectorAll('.type-1 .option-button').forEach((button, index) => {
            button.textContent = question.options[index].name;
            button.className = 'option-button';
            button.disabled = false;
        });
    }

    function updateSoundQuestion(question) {
        document.querySelector('.type-2 img').src = question.instrument.image;
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.checked = false;
            radio.disabled = false;
        });
        document.querySelectorAll('.sound-option-button').forEach(button => {
            button.className = 'sound-option-button';
            button.disabled = false;
        });
    }

    function updateListenQuestion(question) {
        document.querySelectorAll('.type-3 .option-button').forEach((button, index) => {
            button.textContent = question.options[index].name;
            button.className = 'option-button';
            button.disabled = false;
        });
    }

    function updateMatchingQuestion(question) {
        const images = document.querySelectorAll('.draggable-image img');
        const slots = document.querySelectorAll('.name-slot');
        
        question.instruments.forEach((instrument, index) => {
            images[index].src = instrument.image;
            slots[index].querySelector('.instrument-name').textContent = instrument.name;
            slots[index].dataset.instrument = instrument.name;
        });

        // Reset drop zones
        document.querySelectorAll('.image-drop-zone').forEach(zone => {
            zone.innerHTML = '';
            zone.className = 'image-drop-zone';
        });
    }

    // Handle sound playback
    function playSound(instrument) {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
        currentAudio = new Audio(`/static/sounds/${instrument.sound}`);
        currentAudio.play();
    }

    // Handle answer checking
    function checkAnswer() {
        const question = questions[currentQuestionIndex];
        let isCorrect = false;

        switch(question.type) {
            case 1:
                isCorrect = checkNameAnswer(question);
                break;
            case 2:
                isCorrect = checkSoundAnswer(question);
                break;
            case 3:
                isCorrect = checkListenAnswer(question);
                break;
            case 4:
                isCorrect = checkMatchingAnswer(question);
                break;
        }

        if (isCorrect) score++;
        document.getElementById('check-button').disabled = true;
        document.getElementById('next-button').disabled = false;
    }

    function checkNameAnswer(question) {
        if (!selectedAnswer) return false;
        const isCorrect = selectedAnswer === question.instrument.name;
        
        document.querySelectorAll('.type-1 .option-button').forEach(button => {
            if (button.textContent === question.instrument.name) {
                button.classList.add('correct');
            } else if (button.textContent === selectedAnswer && !isCorrect) {
                button.classList.add('incorrect');
            }
        });

        return isCorrect;
    }

    function checkSoundAnswer(question) {
        const selectedRadio = document.querySelector('input[type="radio"]:checked');
        if (!selectedRadio) return false;

        const selectedIndex = Array.from(document.querySelectorAll('input[type="radio"]'))
            .indexOf(selectedRadio);
        const isCorrect = question.options[selectedIndex] === question.instrument;

        document.querySelectorAll('.sound-option-button').forEach((button, index) => {
            if (question.options[index] === question.instrument) {
                button.classList.add('correct');
            } else if (index === selectedIndex && !isCorrect) {
                button.classList.add('incorrect');
            }
        });

        return isCorrect;
    }

    function checkListenAnswer(question) {
        if (!selectedAnswer) return false;
        const isCorrect = selectedAnswer === question.instrument.name;
        
        document.querySelectorAll('.type-3 .option-button').forEach(button => {
            if (button.textContent === question.instrument.name) {
                button.classList.add('correct');
            } else if (button.textContent === selectedAnswer && !isCorrect) {
                button.classList.add('incorrect');
            }
        });

        return isCorrect;
    }

    function checkMatchingAnswer(question) {
        let correctCount = 0;
        document.querySelectorAll('.name-slot').forEach((slot, index) => {
            const dropZone = slot.querySelector('.image-drop-zone');
            const droppedImage = dropZone.querySelector('img');
            
            if (droppedImage) {
                const expectedInstrument = slot.dataset.instrument;
                const droppedInstrument = question.instruments.find(i => i.image === droppedImage.src);
                
                if (droppedInstrument.name === expectedInstrument) {
                    dropZone.classList.add('correct');
                    correctCount++;
                } else {
                    dropZone.classList.add('incorrect');
                }
            }
        });

        return correctCount === 3;
    }

    // Handle next question
    function handleNext() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        currentQuestionIndex++;
        
        if (currentQuestionIndex >= questions.length) {
            showResults();
        } else {
            updateQuestion();
            updateProgress();
        }
    }

    // Update progress
    function updateProgress() {
        const current = currentQuestionIndex + 1;
        const total = questions.length;
        
        document.getElementById('current-question').textContent = current;
        document.getElementById('total-questions').textContent = total;
        
        const progressFill = document.querySelector('.progress-fill');
        progressFill.style.width = `${(current / total) * 100}%`;
    }

    // Show results
    function showResults() {
        document.querySelector('.quiz-container').classList.add('hidden');
        const quizComplete = document.getElementById('quiz-complete');
        quizComplete.classList.remove('hidden');
        
        document.getElementById('final-score').textContent = score;
        document.getElementById('total-score').textContent = questions.length;
    }

    // Event Listeners
    document.querySelectorAll('.option-button').forEach(button => {
        button.addEventListener('click', () => {
            if (button.disabled) return;
            selectedAnswer = button.textContent;
            document.querySelectorAll('.option-button').forEach(b => b.classList.remove('selected'));
            button.classList.add('selected');
        });
    });

    document.querySelectorAll('.sound-option-button').forEach((button, index) => {
        button.addEventListener('click', () => {
            if (button.disabled) return;
            const question = questions[currentQuestionIndex];
            playSound(question.options[index]);
            button.classList.add('playing');
        });
    });

    document.querySelector('.main-sound-button').addEventListener('click', () => {
        const question = questions[currentQuestionIndex];
        playSound(question.instrument);
    });

    // Drag and Drop handlers
    document.querySelectorAll('.draggable-image').forEach(image => {
        image.addEventListener('dragstart', e => {
            draggedImage = image;
            image.classList.add('dragging');
        });

        image.addEventListener('dragend', () => {
            draggedImage.classList.remove('dragging');
            draggedImage = null;
        });
    });

    document.querySelectorAll('.image-drop-zone').forEach(zone => {
        zone.addEventListener('dragover', e => {
            e.preventDefault();
            zone.classList.add('hover');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('hover');
        });

        zone.addEventListener('drop', e => {
            e.preventDefault();
            zone.classList.remove('hover');
            
            if (draggedImage) {
                // Remove image from previous drop zone if it exists
                document.querySelectorAll('.image-drop-zone').forEach(z => {
                    if (z.contains(draggedImage)) {
                        z.removeChild(draggedImage);
                    }
                });
                
                // Add image to new drop zone
                zone.appendChild(draggedImage);
            }
        });
    });

    document.getElementById('check-button').addEventListener('click', checkAnswer);
    document.getElementById('next-button').addEventListener('click', handleNext);
    document.getElementById('retry-button').addEventListener('click', initializeQuiz);

    // Start the quiz
    initializeQuiz();
});
