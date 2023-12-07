require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const Person = require("./models/person");

app.use(express.json());
app.use(express.static("dist"));

morgan.token("body", function (req) {
	return JSON.stringify(req.body);
});

app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const persons = [];

app.get("/", (request, response) => {
	response.send("<h1>Persons</h1>");
});

app.get("/api/persons", (request, response) => {
	Person.find({}).then((persons) => {
		response.json(persons);
	});
});

app.get("/api/persons/:id", (request, response) => {
	Person.findById(request.params.id).then((person) => {
		response.json(person);
		console.log(person);
	});

	// if (person) {
	// 	response.json(person);
	// } else {
	// 	response.status(404).send("This entry does not exist.");
	// }
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

// app.delete("/api/persons/:id", (request, response) => {
// 	const id = Number(request.params.id);
// 	persons = persons.filter((person) => person.id !== id);
// 	response.status(204).end();
// });

app.post("/api/persons", (request, response) => {
	const body = request.body;

	if (persons.find((person) => person.name === body.name)) {
		response.status(400).json({ error: "only one entry per name" });
	} else if (!body.name) {
		response.status(400).json({ error: "name missing" });
	} else if (!body.number) {
		response.status(400).json({ error: "number missing" });
	} else {
		const person = new Person({
			name: body.name,
			number: body.number,
		});

		person.save().then((savedPerson) => {
			response.json(savedPerson);
		});
	}
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on ${PORT}`);
});
