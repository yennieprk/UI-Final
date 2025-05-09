document.addEventListener('DOMContentLoaded', function() {
    // --- Quiz Data --- 
    const instruments = [
        {
            name: 'Gayageum',
            description: "A 12-stringed zither-like instrument and one of Korea's most representative traditional instruments. It is known for its delicate and elegant sound."
        },
        {
            name: 'Janggu',
            description: "An hourglass-shaped drum used in traditional Korean music. It produces two distinct sounds and is played with both hands."
        },
        {
            name: 'Jing',
            description: "A large gong used in traditional Korean music. It produces a deep, resonant sound and is often used to mark important moments in performances."
        },
        {
            name: 'Haegeum',
            description: "A two-stringed vertical fiddle played with a bow. It produces a sound similar to a human voice and is used in various genres of Korean music."
        },
        {
            name: 'Piri',
            description: "A cylindrical double-reed bamboo oboe. It has a nasal, mellow sound and is used in both court and folk music."
        },
        {
            name: 'Daegeum',
            description: "A large bamboo transverse flute with a buzzing membrane. It is known for its wide range and expressive sound."
        },
        {
            name: 'Geomungo',
            description: "A six-stringed zither played with a bamboo stick. Known for its deep, resonant sound, it was traditionally played by scholars."
        },
        {
            name: 'Kkwaenggwari',
            description: "A small, hand-held gong that produces a high-pitched, metallic sound. It is often used to lead a percussion ensemble."
        }
    ];

    // Randomly select the correct instrument
    const correctInstrument = instruments[Math.floor(Math.random() * instruments.length)];
    // Pick 2 other random instruments for options
    const otherOptions = instruments.filter(i => i.name !== correctInstrument.name);
    const shuffledOther = shuffle([...otherOptions]).slice(0, 2);
    const options = shuffle([correctInstrument, ...shuffledOther]);

    // --- DOM Elements --- 
    const descriptionEl = document.getElementById('instrument-description');
    const optionButtons = document.querySelectorAll('.option-button');
    const nextButton = document.getElementById('next-button');

    let selectedAnswer = null;

    function shuffle(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    function updateQuestion() {
        descriptionEl.textContent = correctInstrument.description;
        nextButton.disabled = true;
        selectedAnswer = null;
        optionButtons.forEach((button, index) => {
            button.classList.remove('correct', 'incorrect', 'selected');
            button.disabled = false;
            if (options[index]) {
                button.textContent = options[index].name;
                button.style.display = '';
            } else {
                button.style.display = 'none';
            }
        });
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
        const isCorrect = selectedAnswer === correctInstrument.name;
        optionButtons.forEach(button => {
            button.disabled = true;
            if (button.textContent === correctInstrument.name) {
                button.classList.add('correct');
            } else if (button.textContent === selectedAnswer && !isCorrect) {
                button.classList.add('incorrect');
            }
        });
        // Store result in localStorage
        let results = JSON.parse(localStorage.getItem('quizResults') || '[null,null,null,null,null,null,null,null]');
        results[5] = isCorrect;
        localStorage.setItem('quizResults', JSON.stringify(results));
        nextButton.disabled = false;
    }

    function handleNext() {
        window.location.href = '/quiz3';
    }

    optionButtons.forEach(button => {
        button.addEventListener('click', () => handleOptionClick(button));
    });
    nextButton.addEventListener('click', handleNext);

    updateQuestion();
});
