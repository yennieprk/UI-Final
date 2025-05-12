document.addEventListener('DOMContentLoaded', function() {
    // --- Quiz Data ---
    const instruments = [
        { name: 'Gayageum', description: "A 12-stringed zither-like instrument and one of Korea's most representative traditional instruments. It is known for its delicate and elegant sound.", sound: 'gayageum.mp3' },
        { name: 'Jing', description: "A large gong used in traditional Korean music. It produces a deep, resonant sound and is often used to mark important moments in performances.", sound: 'jing.mp3' },
        { name: 'Haegeum', description: "A two-stringed vertical fiddle played with a bow. It produces a sound similar to a human voice and is used in various genres of Korean music.", sound: 'haegeum.mp3' },
        { name: 'Geomungo', description: "A six-stringed zither played with a bamboo stick. Known for its deep, resonant sound, it was traditionally played by scholars.", sound: 'geomungo.mp3' },
        { name: 'Kkwaenggwari', description: "A small, hand-held gong that produces a high-pitched, metallic sound. It is often used to lead a percussion ensemble.", sound: 'kkwaenggwari.mp3' },
        { name: 'Janggu', description: "An hourglass-shaped drum used in traditional Korean music. It produces two distinct sounds and is played with both hands.", sound: 'janggu.mp3' },
        { name: 'Daegeum', description: "A large bamboo transverse flute with a buzzing membrane. It is known for its wide range and expressive sound.", sound: 'daegeum.mp3' },
        { name: 'Piri', description: "A cylindrical double-reed bamboo oboe. It has a nasal, mellow sound and is used in both court and folk music.", sound: 'piri.mp3' }
    ];

    // Randomly select the correct instrument
    const correctInstrument = instruments[Math.floor(Math.random() * instruments.length)];
    // Pick 2 other random instruments for options
    const otherOptions = instruments.filter(i => i.name !== correctInstrument.name);
    const shuffledOther = shuffle([...otherOptions]).slice(0, 2);
    const options = shuffle([correctInstrument, ...shuffledOther]);

    // --- DOM Elements ---
    const descriptionEl = document.getElementById('instrument-description');
    const soundButtons = document.querySelectorAll('.sound-option-btn');
    const soundDots = document.querySelectorAll('.sound-dot');
    const nextButton = document.getElementById('next-button');

    let selectedIdx = null;
    let currentAudio = null;

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
        selectedIdx = null;
        soundButtons.forEach((button, index) => {
            button.className = 'sound-option-btn';
            button.disabled = false;
            button.onclick = () => playSound(options[index].sound, button);
        });
        soundDots.forEach((dot, index) => {
            dot.className = 'sound-dot';
            dot.onclick = () => handleDotClick(index);
        });
    }

    function handleDotClick(index) {
        if (selectedIdx !== null) return;
        selectedIdx = index;
        // Show feedback
        soundDots.forEach((dot, i) => {
            dot.onclick = null;
            if (i === index) {
                dot.classList.add(options[i].name === correctInstrument.name ? 'correct' : 'incorrect');
            }
            if (options[i].name === correctInstrument.name && i !== index) {
                dot.classList.add('correct');
            }
        });
        soundButtons.forEach(btn => btn.disabled = true);
        // Store result in localStorage
        let results = JSON.parse(localStorage.getItem('quizResults') || '[null,null,null,null,null,null,null,null]');
        results[7] = options[index].name === correctInstrument.name;
        localStorage.setItem('quizResults', JSON.stringify(results));
        nextButton.disabled = false;
    }

    function playSound(soundFile, btn) {
        if (currentAudio && currentAudio.src.endsWith(`/static/sounds/${soundFile}`)) {
            if (currentAudio.paused) {
                currentAudio.play();
                btn.classList.add('playing');
            } else {
                currentAudio.pause();
                btn.classList.remove('playing');
            }
        } else {
            if (currentAudio) {
                currentAudio.pause();
                document.querySelectorAll('.sound-option-btn').forEach(b => b.classList.remove('playing'));
            }
            currentAudio = new Audio(`/static/sounds/${soundFile}`);
            btn.classList.add('playing');
            currentAudio.addEventListener('ended', () => btn.classList.remove('playing'));
            currentAudio.addEventListener('pause', () => btn.classList.remove('playing'));
            currentAudio.play();
        }
    }

    nextButton.addEventListener('click', function() {
        window.location.href = '/quizresult';
    });

    // Set up button sounds and dot order
    options.forEach((opt, i) => {
        soundButtons[i].setAttribute('data-name', opt.name);
        soundDots[i].setAttribute('data-name', opt.name);
    });
    updateQuestion();
});
