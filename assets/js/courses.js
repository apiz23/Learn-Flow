document.addEventListener("DOMContentLoaded", function () {
	// localStorage.clear();

	fetch("../components/navbar.html")
		.then((response) => response.text())
		.then((data) => {
			document.getElementById("navbar-container").innerHTML = data;
		});

	document.getElementById("math-card").addEventListener("click", function () {
		localStorage.setItem("subject", "algebra");
	});

	document.getElementById("python-card").addEventListener("click", function () {
		localStorage.setItem("subject", "python");
	});
});
