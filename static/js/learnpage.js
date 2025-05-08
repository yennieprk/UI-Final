document.addEventListener('DOMContentLoaded', function() {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link-custom').forEach(link => link.classList.remove('active'));
    // Add active class to Learn link
    document.querySelector('a[href="/learn"]').classList.add('active');

    const instrumentsData = {
        haegeum: {
            name: 'Haegeum (해금)',
            description: 'A traditional Korean string instrument played with a bow. It features two strings and a bamboo bow, allowing players to create a wide range of unique tonal expressions.',
            soundFile: 'haegeum.mp3',
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6JAI_UCePBZIhitfBKWjPNf3uxAWoqAFvuA&s'
        },
        gayageum: {
            name: 'Gayageum (가야금)',
            description: 'A 12-stringed zither-like instrument and one of Korea\'s most representative traditional instruments. It is known for its delicate and elegant sound.',
            soundFile: 'gayageum.mp3',
            imageUrl: 'https://designlifemica.weebly.com/uploads/6/4/7/5/64757185/1694964892_orig.gif'
        },
        janggu: {
            name: 'Janggu (장구)',
            description: 'A traditional Korean drum with an hourglass shape. It has two heads made of animal skin and is played with a stick and hand combination.',
            soundFile: 'janggu.mp3',
            imageUrl: 'https://t3.ftcdn.net/jpg/11/08/49/66/360_F_1108496624_6J2WQ2bv0p0hrYXkhFQwDMcWwB12kmuA.jpg'
        },
        piri: {
            name: 'Piri (피리)',
            description: 'A double-reed bamboo oboe used in traditional Korean music. It has a warm, rich tone and is often used in court and folk music.',
            soundFile: 'piri.mp3',
            imageUrl: 'https://i.pinimg.com/474x/92/dd/81/92dd81d9ec30e416e3945d8fe4d0f3b4.jpg'
        },
        daegeum: {
            name: 'Daegeum (대금)',
            description: 'A large bamboo transverse flute used in traditional Korean music. It has a distinctive buzzing sound produced by a membrane covering one of its holes.',
            soundFile: 'daegeum.mp3',
            imageUrl: 'https://organology.net/storage/2024/07/Daegeum-6.jpeg'
        },
        geomungo: {
            name: 'Geomungo (거문고)',
            description: 'A six-stringed zither played with a bamboo stick. Known for its deep, resonant sound, it was traditionally played by scholars.',
            soundFile: 'geomungo.mp3',
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDEIJNzk4jomaiaPoANwSoQVhvLhpezOgLsg&s'
        },
        jing: {
            name: 'Jing (징)',
            description: 'A large gong used in traditional Korean music. It produces a deep, resonant sound and is often used to mark important moments in performances.',
            soundFile: 'jing.mp3',
            imageUrl: 'https://i.pinimg.com/474x/09/c3/05/09c305a19673c1344eb337a2813d043d.jpg'
        },
        kkwaenggwari: {
            name: 'Kkwaenggwari (꽹과리)',
            description: 'A small gong that produces bright, piercing tones. It often leads the rhythmic patterns in traditional Korean percussion music.',
            soundFile: 'kkwaenggwari.mp3',
            imageUrl: 'https://i.pinimg.com/1200x/76/ff/2f/76ff2fdb271fa6a8fff972070a36d569.jpg'
        }
    };

    // Initialize learned instruments array
    let learnedInstruments = [];

    // Update instrument learning status
    function updateInstrumentStatus(instrumentId) {
        if (!learnedInstruments.includes(instrumentId)) {
            learnedInstruments.push(instrumentId);
        }
        updateInstrumentDisplay();
        updateProgress();
    }

    // Update visual display of instruments
    function updateInstrumentDisplay() {
        document.querySelectorAll('.instrument-item').forEach(item => {
            const instrumentId = item.dataset.instrument;
            if (learnedInstruments.includes(instrumentId)) {
                item.classList.add('learned');
                item.classList.remove('not-learned');
            } else {
                item.classList.add('not-learned');
                item.classList.remove('learned');
            }
        });
    }

    // Initialize progress bar and display
    updateProgress();
    updateInstrumentDisplay();

    // Handle instrument click events
    document.querySelectorAll('.instrument-item').forEach(item => {
        item.addEventListener('click', function() {
            const instrumentId = this.dataset.instrument;
            const data = instrumentsData[instrumentId];

            if (data) {
                showInstrumentDetail(data);
                updateInstrumentStatus(instrumentId);
            }
        });
    });

    // Display instrument details
    function showInstrumentDetail(data) {
        const detail = document.querySelector('.instrument-detail');
        const image = detail.querySelector('.detail-image');
        const name = detail.querySelector('.instrument-name');
        const description = detail.querySelector('.instrument-description');

        image.src = data.imageUrl;
        image.alt = data.name;
        name.textContent = data.name;
        description.textContent = data.description;

        detail.style.display = 'flex';
    }

    // Close detail when clicking outside
    document.querySelector('.instrument-detail').addEventListener('click', function(e) {
        // Check if the click was on the background (not on the content)
        if (e.target === this) {
            stopSound();
            this.style.display = 'none';
        }
    });

    // Prevent closing when clicking on the content
    document.querySelector('.detail-content').addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Sound playback button handler
    let currentAudio = null;

    document.querySelector('.play-sound').addEventListener('click', function() {
        const detail = document.querySelector('.instrument-detail');
        const instrumentName = detail.querySelector('.detail-image').alt;
        const instrumentId = Object.keys(instrumentsData).find(key => 
            instrumentsData[key].name.toLowerCase().includes(instrumentName.toLowerCase())
        );
        const data = instrumentsData[instrumentId];
        const button = this;

        if (data && data.soundFile) {
            const soundSrc = `/static/sounds/${data.soundFile}`;
            console.log('Playing sound:', soundSrc); // 디버깅용 로그

            // Check if audio exists and is for the current sound
            if (currentAudio && currentAudio.src.endsWith(soundSrc)) {
                if (currentAudio.paused) {
                    currentAudio.play()
                        .then(() => {
                            console.log('Sound started playing');
                            button.classList.add('playing');
                        })
                        .catch(e => {
                            console.error("Error playing sound:", e);
                            stopSound();
                        });
                } else {
                    currentAudio.pause();
                    button.classList.remove('playing');
                }
            } else {
                // Stop any previous sound and create new audio
                stopSound();
                currentAudio = new Audio(soundSrc);
                
                // Add listener for when the sound naturally ends
                currentAudio.addEventListener('ended', () => {
                    console.log('Sound ended');
                    button.classList.remove('playing');
                });
                
                // Add listener for pause events
                currentAudio.addEventListener('pause', () => {
                    if (currentAudio && !currentAudio.ended) {
                        console.log('Sound paused');
                        button.classList.remove('playing');
                    }
                });
                
                // Add listener for play events
                currentAudio.addEventListener('play', () => {
                    console.log('Sound playing');
                    button.classList.add('playing');
                });

                // Add error handling
                currentAudio.addEventListener('error', (e) => {
                    console.error('Audio error:', e);
                    stopSound();
                });

                currentAudio.play()
                    .then(() => {
                        console.log('Sound started playing');
                        button.classList.add('playing');
                    })
                    .catch(e => {
                        console.error("Error playing sound:", e);
                        stopSound();
                    });
            }
        } else {
            console.error('No sound file found for instrument:', instrumentId);
        }
    });

    function stopSound() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.removeEventListener('ended', () => {});
            currentAudio.removeEventListener('pause', () => {});
            currentAudio.removeEventListener('play', () => {});
            currentAudio = null;
        }
        document.querySelector('.play-sound').classList.remove('playing');
    }

    // Close button handler
    document.querySelector('.close-detail').addEventListener('click', function() {
        stopSound();
        document.querySelector('.instrument-detail').style.display = 'none';
    });

    // Update progress bar
    function updateProgress() {
        const totalInstruments = Object.keys(instrumentsData).length;
        const progress = (learnedInstruments.length / totalInstruments) * 100;

        const progressFill = document.querySelector('.custom-progress-fill');
        const progressText = document.querySelector('.progress-text');
        const progressPercentage = document.querySelector('.progress-percentage');
        const quizPopup = document.querySelector('.quiz-popup');

        if (progressFill && progressText && progressPercentage) {
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${learnedInstruments.length}/${totalInstruments}`;
            progressPercentage.textContent = `${Math.round(progress)}%`;

            // Show popup when reaching 100%
            if (progress === 100 && quizPopup) {
                setTimeout(() => {
                    quizPopup.classList.add('show');
                }, 500);
            }
        }
    }
});
