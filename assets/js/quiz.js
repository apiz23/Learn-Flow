document.addEventListener("DOMContentLoaded", function () {
	fetch("../components/navbar.html")
		.then((response) => response.text())
		.then((data) => {
			document.getElementById("navbar-container").innerHTML = data;
		});

	const chapters = localStorage.getItem("chapter");
	let currentChapterIndex =
		parseInt(localStorage.getItem("currentChapterIndex")) || 0;
	const subject = localStorage.getItem("subject");

	let completedTopics =
		JSON.parse(localStorage.getItem(`${subject}-progress`)) || 0;
	const totalTopics = chapters.length;

	function updateChapterTitle() {
		const chapter = chapters[currentChapterIndex];
		const quizContainer = document.querySelector(".quiz-container h1");

		if (chapter) {
			quizContainer.textContent = `Topic: ${chapters}`;
		} else {
			quizContainer.textContent = "Topic: Unknown";
		}
	}

	updateChapterTitle();

	if (subject) {
		loadQuestions(subject, chapters);
	} else {
		alert("No subject found in localStorage.");
	}

	let currentQuestionIndex = 0;
	let userAnswers = [];
	let questions = [];

	function loadQuestions(subject, chapter) {
		axios
			.get(`https://jg160007-api.vercel.app/learn-flow/${subject}/${chapter}`)
			.then((response) => {
				if (response.data && response.data.message === "Success") {
					questions = response.data.data;
					renderQuestion(questions[currentQuestionIndex]);
				} else {
					alert("No questions found!");
				}
			})
			.catch((error) => {
				console.error("Error fetching questions:", error);
			});
	}

	function renderQuestion(questionObj) {
		const quizForm = document.getElementById("quizForm");
		quizForm.innerHTML = "";

		if (!questionObj) {
			alert("All questions completed!");
			return;
		}

		const questionDiv = document.createElement("div");
		questionDiv.classList.add("quiz-question");
		questionDiv.textContent = `${currentQuestionIndex + 1}. ${
			questionObj.question
		}`;

		const optionsWrapper = document.createElement("div");
		optionsWrapper.classList.add("quiz-options");

		questionObj.options.forEach((option, optionIndex) => {
			const optionLabel = document.createElement("label");

			const input = document.createElement("input");
			input.type = "radio";
			input.name = `question${currentQuestionIndex + 1}`;
			input.value = option;

			const span = document.createElement("span");
			span.textContent = option;

			optionLabel.appendChild(input);
			optionLabel.appendChild(span);
			optionsWrapper.appendChild(optionLabel);
		});

		questionDiv.appendChild(optionsWrapper);
		quizForm.appendChild(questionDiv);

		const submitBtn = document.querySelector(".btnSubmit");
		submitBtn.textContent = currentQuestionIndex === 0 ? "Next" : "Next";

		submitBtn.onclick = function () {
			const selectedOption = document.querySelector(
				`input[name="question${currentQuestionIndex + 1}"]:checked`
			);
			if (selectedOption) {
				userAnswers[currentQuestionIndex] = selectedOption.value;
			} else {
				alert("Please select an answer.");
				return;
			}

			currentQuestionIndex++;

			if (currentQuestionIndex < questions.length) {
				renderQuestion(questions[currentQuestionIndex]);
			} else {
				calculateScore();
			}
		};
	}

	function calculateScore() {
		let score = 0;

		userAnswers.forEach((answer, index) => {
			if (answer === questions[index].answer) {
				score++;
			}
		});

		alert(`You answered ${score} out of ${userAnswers.length} correctly!`);
		if (currentChapterIndex < chapters.length) {
			completedTopics++;
			localStorage.setItem(`${subject}-progress`, JSON.stringify(completedTopics));
			let completedChapterNames =
				JSON.parse(localStorage.getItem(`${subject}-progress-topics`)) || [];
			let currentChapter = localStorage.getItem("chapter");
			if (!completedChapterNames.includes(currentChapter)) {
				completedChapterNames.push(currentChapter);
			}

			localStorage.setItem(
				`${subject}-progress-topics`,
				JSON.stringify(completedChapterNames)
			);
		}
		setTimeout(() => {
			window.location.href = "/pages/courseDetail.html";
		}, 1000);
	}
});
