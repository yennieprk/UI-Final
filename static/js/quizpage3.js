document.addEventListener('DOMContentLoaded', function() {
    // --- Quiz Data ---
    const instruments = [
        { name: 'Gayageum', image: 'https://designlifemica.weebly.com/uploads/6/4/7/5/64757185/1694964892_orig.gif' },
        { name: 'Jing', image: '/static/image/jing.png' },
        { name: 'Haegeum', image: '/static/image/haegeum.png' },
        { name: 'Geomungo', image: '/static/image/geomungo.png' },
        { name: 'Kkwaenggwari', image: '/static/image/kkwaenggwari.png' },
        { name: 'Janggu', image: '/static/image/janggu.png' },
        { name: 'Daegeum', image: '/static/image/daegeum.png' },
        { name: 'Piri', image: '/static/image/piri.png' }
    ];

    // Pick 3 random instruments
    const selected = shuffle([...instruments]).slice(0, 3);
    const names = shuffle(selected.map(i => i.name));

    const imagesRow = document.querySelector('.dragdrop-images-row');
    const cardsRow = document.querySelector('.dragdrop-cards-row');
    const nextButton = document.getElementById('next-button');

    // State: which card is in which box (index = image idx, value = name or null)
    let boxState = [null, null, null];
    // Track which cards are placed
    let cardPlaced = [false, false, false];

    function shuffle(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    function renderQuiz() {
        // Render images and drop boxes
        imagesRow.innerHTML = '';
        // Check correctness if all boxes are filled
        let correctness = null;
        if (boxState.every(val => val !== null)) {
            correctness = boxState.map((val, i) => val === selected[i].name);
        }
        selected.forEach((inst, i) => {
            const box = document.createElement('div');
            box.className = 'dragdrop-image-box';
            // White background wrapper
            const imgBg = document.createElement('div');
            imgBg.className = 'image-bg';
            const img = document.createElement('img');
            img.src = inst.image;
            img.alt = inst.name;
            imgBg.appendChild(img);
            box.appendChild(imgBg);
            // Drop box
            const drop = document.createElement('div');
            drop.className = 'dragdrop-dropbox';
            drop.dataset.boxIdx = i;
            if (correctness && correctness[i]) drop.classList.add('correct');
            if (correctness && !correctness[i]) drop.classList.add('wrong');
            drop.ondragover = e => { e.preventDefault(); drop.classList.add('dragover'); };
            drop.ondragleave = e => { drop.classList.remove('dragover'); };
            drop.ondrop = e => {
                e.preventDefault();
                drop.classList.remove('dragover');
                const cardIdx = +e.dataTransfer.getData('cardIdx');
                placeCardInBox(cardIdx, i);
            };
            // Show placed card if any
            if (boxState[i] !== null) {
                drop.textContent = boxState[i];
            } else {
                drop.textContent = '';
            }
            box.appendChild(drop);
            imagesRow.appendChild(box);
        });
        // Render cards
        cardsRow.innerHTML = '';
        names.forEach((name, i) => {
            const card = document.createElement('div');
            card.className = 'dragdrop-card';
            card.textContent = name;
            card.draggable = !cardPlaced[i];
            if (cardPlaced[i]) card.classList.add('placed');
            card.ondragstart = e => {
                e.dataTransfer.setData('cardIdx', i);
            };
            cardsRow.appendChild(card);
        });
        // Enable next button if all boxes are filled
        nextButton.disabled = !boxState.every(val => val !== null);
    }

    function placeCardInBox(cardIdx, boxIdx) {
        // Remove card from previous box if present
        for (let i = 0; i < boxState.length; i++) {
            if (boxState[i] === names[cardIdx]) {
                boxState[i] = null;
            }
        }
        // Remove any card currently in this box
        for (let i = 0; i < cardPlaced.length; i++) {
            if (boxState[boxIdx] === names[i]) {
                cardPlaced[i] = false;
            }
        }
        // Place card in box
        boxState[boxIdx] = names[cardIdx];
        cardPlaced[cardIdx] = true;
        renderQuiz();
    }

    nextButton.addEventListener('click', function() {
        // Store result in localStorage
        let results = JSON.parse(localStorage.getItem('quizResults') || '[null,null,null,null,null,null,null,null]');
        // All correct if all boxes match
        const allCorrect = boxState.every((val, i) => val === selected[i].name);
        results[6] = allCorrect;
        localStorage.setItem('quizResults', JSON.stringify(results));
        window.location.href = '/quiz4';
    });

    renderQuiz();
});
