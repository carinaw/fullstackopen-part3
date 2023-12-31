const mongoose = require("mongoose");

const password = process.argv[2];

const url = `mongodb+srv://carina-fso:${password}@cluster0.wcp4lgi.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
	name: process.argv[3],
	number: process.argv[4],
});

Person.deleteMany({ name: undefined }).then((result) => {
	console.log(result);
});

if (process.argv.length < 4) {
	Person.find({}).then((result) => {
		console.log("phonebook:");
		result.forEach((person) => {
			console.log(`${person.name} ${person.number}`);
		});
		mongoose.connection.close();
	});
}

if (process.argv.length > 3) {
	person.save().then((person) => {
		console.log(`added ${person.name} number ${person.number} to phonebook`);
		mongoose.connection.close();
	});
}
