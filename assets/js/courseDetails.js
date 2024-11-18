document.addEventListener("DOMContentLoaded", function () {
	fetch("../components/navbar.html")
		.then((response) => response.text())
		.then((data) => {
			document.getElementById("navbar-container").innerHTML = data;
		});

	const subject = localStorage.getItem("subject");
	if (subject) {
		axios
			.get(`https://jg160007-api.vercel.app/learn-flow/${subject.toLowerCase()}/`)
			.then((response) => {
				const course = response.data.data;
				console.log(course);
				const courseContainer = document.getElementById("course-details-container");

				if (Array.isArray(course.topics) && course.topics.length > 0) {
					const totalTopics = course.topics.length;
					const completedTopics =
						parseInt(localStorage.getItem(`${subject}-progress`)) || 0;
					const progressPercentage = Math.min(
						(completedTopics / totalTopics) * 100,
						100
					).toFixed(2);

					courseContainer.innerHTML = `
						<div class="search-container">
							<input type="text" id="topic-search" placeholder="Search Topics..." />
						</div>
                        <h1>${course.title}</h1>
                        <p>${course.description}</p>
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: ${progressPercentage}%;"></div>
                        </div>
                        <p>Progress: ${completedTopics} / ${totalTopics} (${progressPercentage}%)</p>
                        ${course.topics
							.map((topic) => {
								const completedTopics =
									JSON.parse(
										localStorage.getItem(`${subject}-progress-topics`)
									) || [];

								const isCompleted = completedTopics.includes(
									topic.name.trim().toLowerCase()
								);

								return `
                                    <div class="accordion-container">
                                      <details class="accordion">
                                        <summary class="accordion-header">
                                          ${topic.name}
                                        </summary>
                                        <div class="accordion-body">
                                          <p>${topic.description}</p>
                                          <button class="start-quiz-btn button-55" data-topic="${
																																											topic.name
																																										}" ${isCompleted ? "disabled" : ""}>
                                            Start Quiz
                                          </button>
                                        </div>
                                      </details>
                                    </div>
                                  `;
																									})
																									.join("")}
                          <p>${course.additionalDescription || ""}</p>
                    `;

					const searchInput = document.getElementById("topic-search");
					searchInput.addEventListener("input", function () {
						const query = this.value.toLowerCase();
						const topicContainers = document.querySelectorAll(".accordion-container");

						topicContainers.forEach((container) => {
							const topicName = container
								.querySelector(".accordion-header")
								.textContent.toLowerCase();
							if (topicName.includes(query)) {
								container.style.display = "block";
							} else {
								container.style.display = "none";
							}
						});
					});

					const headers = document.querySelectorAll(".accordion-header");
					headers.forEach((header) => {
						header.addEventListener("click", function () {
							const body = this.nextElementSibling;
							body.style.display = body.style.display === "block" ? "none" : "block";
						});
					});

					const startQuizButtons = document.querySelectorAll(".start-quiz-btn");
					startQuizButtons.forEach((button) => {
						button.addEventListener("click", function () {
							const topicName = this.getAttribute("data-topic");
							localStorage.setItem("chapter", topicName.toLowerCase());
							window.location.href = "/pages/quiz.html";
						});
					});
				} else {
					courseContainer.innerHTML = `<p>No topics available for this course.</p>`;
				}
			})
			.catch((error) => {
				console.error("Error fetching course data:", error);
			});
	}
});
