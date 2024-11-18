fetch("components/navbar.html")
	.then((response) => response.text())
	.then((data) => {
		document.getElementById("navbar-container").innerHTML = data;
	});

const fetchQuotes = async () => {
	const token = "aIeYYuA5/L5bGO45XY8q6w==QunyhvLAU682Kwbv";
	if (!token) {
		alert("API token is not defined");
		return;
	}

	try {
		const response = await fetch(
			"https://api.api-ninjas.com/v1/quotes?category=computers",
			{
				method: "GET",
				headers: {
					"X-Api-Key": token,
				},
			}
		);

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const quotes = await response.json();
		displayQuotes(quotes);
	} catch (error) {
		console.error("Error fetching quotes:", error);
	}
};

const displayQuotes = (quotes) => {
	const quotesContainer = document.getElementById("quotes-container");

	quotesContainer.innerHTML = "";

	quotes.forEach((quote) => {
		const quoteFigure = document.createElement("figure");
		quoteFigure.classList.add("quote-card");

		const blockquote = document.createElement("blockquote");
		blockquote.innerHTML = `"${quote.quote}"`;

		const figcaption = document.createElement("figcaption");
		figcaption.innerHTML = `— ${quote.author}`;

		quoteFigure.appendChild(blockquote);
		quoteFigure.appendChild(figcaption);

		quotesContainer.appendChild(quoteFigure);
	});
};

fetchQuotes();
