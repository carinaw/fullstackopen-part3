const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(express.json());

morgan.token("body", function (req) {
	return JSON.stringify(req.body);
});

app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
	{
		id: 1,
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: 2,
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: 3,
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: 4,
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];

app.get("/", (request, response) => {
	response.send("<h1>Persons</h1>");
});

app.get("/api/persons", (request, response) => {
	response.json(persons);
});

app.get("/info", (request, response) => {
	const entries = persons.length;
	const receiveDate = new Date();
	console.log(receiveDate);
	console.log(entries);
	response.send(
		`<p>Phonebook has info for ${entries} people.<p>${receiveDate}</p>`
	);
});

app.get("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	const person = persons.find((person) => person.id === id);
	console.log(person);

	if (person) {
		response.json(person);
	} else {
		response.status(404).send("This entry does not exist.");
	}
});

app.delete("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	persons = persons.filter((person) => person.id !== id);
	response.status(204).end();
});

const randomID = () => {
	const generateID = Math.floor(Math.random() * (1000 - 0 + 1) + 0);
	return generateID;
};

app.post("/api/persons", (request, response) => {
	const body = request.body;

	if (persons.find((person) => person.name === body.name)) {
		response.status(400).json({ error: "only one entry per name" });
	} else if (!body.name) {
		response.status(400).json({ error: "name missing" });
	} else if (!body.number) {
		response.status(400).json({ error: "number missing" });
	} else {
		const person = {
			name: body.name,
			number: body.number,
			id: randomID(),
		};

		persons = persons.concat(person);
		response.json(person);
	}
});

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server running on ${PORT}`);
});
