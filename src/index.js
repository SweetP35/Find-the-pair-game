const difficulty = document.querySelector('.game-difficulty');
const gameField = document.querySelector('.game__field');
const gameCardWrap = document.querySelector('.game__field-wrap');
const restartBtn = document.querySelector('.restart');
const backBtn = document.querySelector('.back');
let cardList = []
let difficultyLevel = null;
let timeValue = null;

const backToMenu = () => {
	gameField.classList.remove('__active');
	difficulty.classList.remove('__hidden');
	gameCardWrap.classList.remove('__hidden');
	gameCardWrap.innerHTML = '';
	cardList.length = [];
	setDefault();
	clearInterval(interval);
	timerElement.textContent = "";
	timerElement.style.display = 'block';
	victoryPoint = 0;
}

const restartGame = () => {
	gameCardWrap.innerHTML = '';
	gameCardWrap.classList.remove('__hidden');
	cardList = [];
	setDefault();
	createCardList(difficultyLevel);
	renderCards(cardList);
	setEventClickOnCard();
	clearInterval(interval);
	timerElement.textContent = "";
	timerElement.style.display = 'block';
	victoryPoint = 0;
	renderTimer(timeValue);
	setTimer(timeValue);
}

backBtn.addEventListener('click', () => {
	backToMenu()
})

restartBtn.addEventListener('click', () => {
	restartGame()
})
const renderCards = (array) => {
	for(let i = 0; i < array.length; i++){
		const card = `<div class="game__card" data-id="${array[i]}">
						<div class="game__card-inner">
							<div class="game__card-face game__card-front">
								<img src="./src/assets/img/question.svg" alt="card-front">
							</div>
							<div class="game__card-face game__card-back">
								<img src="./src/assets/svg_card/${array[i]}.svg" alt="card-back">
							</div>
						</div>
					</div>`
	gameCardWrap.insertAdjacentHTML('beforeend', card);
	}
}

const createCardList = (num) => {
	const array = []
	for(let i = 0; i < num; i++){
		array.push(i);
		array.push(i);
	}
	const randomArray = array.sort(() => Math.random() - 0.5)
	cardList.push(...randomArray);
	}

difficulty.addEventListener('click', (event) => {
	handleDifficultyClick(event);
})

const handleDifficultyClick = (event) => {
	const target = event.target;
	difficultyLevel = Number(target.dataset.difficulty);
	timeValue = Number(target.dataset.time);
	if (difficultyLevel) {
		difficulty.classList.add('__hidden');
		gameField.classList.add('__active');
		renderTimer(timeValue);
		setTimer(timeValue);
		createCardList(difficultyLevel);
		renderCards(cardList);
		setEventClickOnCard()
	}
}

let count = 1;
let oneCard = null;
let twoCard = null;
let victoryPoint = 0;
let resultGame = {
	result: '',
	img: '',
	time: null
};
const setEventClickOnCard = () => {
	const gameFront = document.querySelectorAll('.game__card');
	gameFront.forEach(card => {
		card.addEventListener('click', () => {
			if (count === 3) return;
			if (card === oneCard){
				card.classList.remove('__active');
				setDefault();
				return;
			}
			if (count === 1){
				card.classList.add('__active');
				oneCard = card;
				count++;
				return;
			} else if (count === 2 && card !== oneCard){
				card.classList.add('__active');
				twoCard = card;
				count++;
			}
			if(oneCard && twoCard){
				if (oneCard.dataset.id === twoCard.dataset.id){
					victoryPoint += 1
					setTimeout(() => {
						oneCard.classList.add('__matched');
						twoCard.classList.add('__matched');
						oneCard.style.pointerEvents = 'none';
						twoCard.style.pointerEvents = 'none';
						oneCard.addEventListener('animationend', () => {
							endGameVictory();
						}, { once: true });
						setDefault();
					}, 500);
				} else {
					setTimeout(() => {
						oneCard.classList.remove('__active');
						twoCard.classList.remove('__active');
						setDefault();
					}, 800)
				}
			}
		})
	})
}

const endGameVictory = () => {
	if(victoryPoint === difficultyLevel && timeValue > 0){
		clearInterval(interval);
		timerElement.style.display = 'none';
		gameCardWrap.innerHTML = '';
		resultGame.result = 'Победа-победа, время обеда!!!';
		resultGame.img = './src/assets/img/victory.svg';
		resultGame.time = formatTime(timeValue-time);
		renderResultGame();
	};
}

const renderResultGame = (result) => {
	gameCardWrap.classList.add('__hidden');
	const gameResult = `<div class="game__result">
					<div class="game__result-wrap">
						<img src="${resultGame.img}" alt="congratulation">
						<h2 class="game__result-title">${resultGame.result}</h2>
					</div>
					<p class="game__result-time">Ваше время:<span> ${resultGame.time}</span></p>
				</div>`
	gameCardWrap.insertAdjacentHTML('beforeend', gameResult);
	const gameResultElement = document.querySelector('.game__result');
	if(result === "defeat"){
		gameResultElement.classList.add('__defeat')
	}
}

const setDefault = () => {
	oneCard = null;
	twoCard = null;
	count = 1;
}

const renderTimer = (seconds) => {
	timerElement.textContent = formatTime(seconds);
}

const endGameDefeat = () => {
	clearInterval(interval);
	timerElement.style.display = 'none';
	gameCardWrap.innerHTML = '';
	resultGame.result = 'Увы и ах, вы проиграли...Loooooser!!!';
	resultGame.img = './src/assets/img/defeat.svg';
	renderResultGame("defeat");
}

const timerElement = document.querySelector('.game__time');
let time = null;
let interval = null;
const setTimer = (seconds) => {
	time = seconds;
	interval = setInterval(() => {
		time--;
		timerElement.textContent = formatTime(time);
		if(time <= 0 && victoryPoint !== difficultyLevel){
			endGameDefeat();
		}
	}, 1000)
}

function formatTime(sec) {
	const minutes = Math.floor(sec / 60);
	const seconds = sec % 60;
	return `${minutes < 10 ? "0": ""}${minutes}:${seconds < 10 ? "0": ""}${seconds}`;
}
