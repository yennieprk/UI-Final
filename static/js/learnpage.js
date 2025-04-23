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
            imageUrl: 'https://lh3.googleusercontent.com/proxy/s8eoAEHxwqlj5peqRHCzm33iLgYYkSGGwz-3M7LWoINsjVO-Y6LG4YFX6VFUvFdLZJR1WDpefU5mNjGHJpQZ3d78dsB7AlzXHjLy5AwyxPmu9YmRqAfVeg'
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

    let visitedInstruments = new Set();

    // Initialize progress bar
    updateProgress();

    // Handle instrument click events
    document.querySelectorAll('.instrument-item').forEach(item => {
        item.addEventListener('click', function() {
            const instrumentId = this.dataset.instrument;
            const data = instrumentsData[instrumentId];

            if (data) {
                showInstrumentDetail(data);
                if (!visitedInstruments.has(instrumentId)) {
                    visitedInstruments.add(instrumentId);
                    updateProgress();
                }
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

    // Sound playback button handler
    let currentAudio = null;
    let isPlaying = false;

    document.querySelector('.play-sound').addEventListener('click', function() {
        const detail = document.querySelector('.instrument-detail');
        const instrumentId = detail.querySelector('.detail-image').alt.toLowerCase();
        const data = instrumentsData[instrumentId];
        const button = this;

        if (data && data.soundFile) {
            if (!currentAudio) {
                currentAudio = new Audio(`static/sounds/${data.soundFile}`);
                currentAudio.addEventListener('ended', () => {
                    isPlaying = false;
                    button.style.backgroundImage = 'url("https://static.vecteezy.com/system/resources/previews/003/611/805/non_2x/sound-speaker-icon-on-white-background-free-vector.jpg")';
                });
            }

            if (isPlaying) {
                currentAudio.pause();
                isPlaying = false;
                button.style.backgroundImage = 'url("https://static.vecteezy.com/system/resources/previews/003/611/805/non_2x/sound-speaker-icon-on-white-background-free-vector.jpg")';
            } else {
                currentAudio.play();
                isPlaying = true;
                button.style.backgroundImage = 'url("https://cdn-icons-png.flaticon.com/512/27/27223.png")';
            }
        }
    });

    // Close button handler
    document.querySelector('.close-detail').addEventListener('click', function() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
            isPlaying = false;
            document.querySelector('.play-sound').style.backgroundImage = 'url("https://static.vecteezy.com/system/resources/previews/003/611/805/non_2x/sound-speaker-icon-on-white-background-free-vector.jpg")';
        }
        document.querySelector('.instrument-detail').style.display = 'none';
    });

    // Update progress bar
    function updateProgress() {
        const totalInstruments = Object.keys(instrumentsData).length;
        const progress = (visitedInstruments.size / totalInstruments) * 100;

        const progressFill = document.querySelector('.custom-progress-fill');
        const progressText = document.querySelector('.progress-percentage');
        const quizPopup = document.querySelector('.quiz-popup');

        if (progressFill && progressText) {
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}%`;

            // Show popup when reaching 100%
            if (progress === 100 && quizPopup) {
                setTimeout(() => {
                    quizPopup.classList.add('show');
                }, 500); // Small delay for better UX
            }
        }
    }
});
