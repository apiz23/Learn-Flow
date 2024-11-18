const categorySelect = document.getElementById("category");
const form = document.getElementById("flashcardForm");
const flashcardsContainer = document.getElementById("flashcards");

fetch("../components/navbar.html")
	.then((response) => response.text())
	.then((data) => {
		document.getElementById("navbar-container").innerHTML = data;
	});

async function fetchCategories() {
	const res = await fetch("https://opentdb.com/api_category.php");
	const data = await res.json();
	data.trivia_categories.forEach((category) => {
		const option = document.createElement("option");
		option.value = category.id;
		option.textContent = category.name;
		categorySelect.appendChild(option);
	});
}

async function fetchQuestions(amount, category) {
	const res = await fetch(
		`https://opentdb.com/api.php?amount=${amount}&category=${category}`
	);
	const data = await res.json();
	displayFlashcards(data.results);
}

function displayFlashcards(questions) {
	flashcardsContainer.innerHTML = "";
	questions.forEach((q, i) => {
		const card = document.createElement("div");
		card.className = "card";

		const answerOptions =
			q.incorrect_answers.length > 0
				? q.incorrect_answers
						.map(
							(answer, index) =>
								`<div class="flashcard-option">${index + 1}. ${decodeHTML(
									answer
								)}</div>`
						)
						.join(" ")
				: `<div class="flashcard-option">No answer given</div>`;

		card.innerHTML = `
            <div class="front">
                <p>${decodeHTML(q.question)}</p>
                <div class="flashcard-options">
                    ${answerOptions}
                </div>
            </div>
            <div class="back">
                <p>Answer: ${decodeHTML(q.correct_answer)}</p>
            </div>
        `;

		card.addEventListener("click", () => {
			card.classList.toggle("flip");
		});

		flashcardsContainer.appendChild(card);
	});
}

function decodeHTML(html) {
	const textarea = document.createElement("textarea");
	textarea.innerHTML = html;
	return textarea.value;
}

form.addEventListener("submit", (e) => {
	e.preventDefault();
	const amount = document.getElementById("amount").value;
	const category = categorySelect.value;
	fetchQuestions(amount, category);
});

fetchCategories();
