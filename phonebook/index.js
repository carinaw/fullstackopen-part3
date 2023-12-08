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

const errorHandler = (error, request, response, next) => {
	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	}

	next(error);
};

app.use(errorHandler);

const persons = [];

app.get("/", (request, response) => {
	response.send("<h1>Persons</h1>");
});

app.get("/api/persons", (request, response, persons) => {
	Person.find({}).then((persons) => {
		response.json(persons);
	});
});

app.get("/api/persons/:id", (request, response, next) => {
	Person.findById(request.params.id)
		.then((person) => {
			if (person) {
				response.json(person);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => next(error));
});

app.get("/info", (request, response) => {
	Person.countDocuments({})
		.then((count) => {
			response.send(
				`phonebook has info for ${count} people.<br />${new Date()}`
			);
		})
		.catch((err) => {
			console.log(err);
		});
});

app.delete("/api/persons/:id", (request, response, next) => {
	Person.findByIdAndDelete(request.params.id)
		.then((result) => {
			response.status(204).end();
		})
		.catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
	const body = request.body;

	const person = {
		name: body.name,
		number: body.number,
	};

	Person.findByIdAndUpdate(request.params.id, person, { new: true })
		.then((updatedPerson) => {
			response.json(updatedPerson);
		})
		.catch((error) => next(error));
});

app.post("/api/persons", (request, response) => {
	const body = request.body;

	// if (persons.find((person) => person.name === body.name)) {
	// 	response.status(400).json({ error: "only one entry per name" });
	// } else if (!body.name) {
	// 	response.status(400).json({ error: "name missing" });
	// } else if (!body.number) {
	// 	response.status(400).json({ error: "number missing" });
	// } else {
	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person.save().then((savedPerson) => {
		response.json(savedPerson);
	});
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on ${PORT}`);
});
