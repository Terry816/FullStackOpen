const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

function generateID() {
    return Math.floor(Math.random() * 10000)
}

const password = encodeURIComponent(process.argv[2])

const url = `mongodb+srv://terrybk:${password}@cluster0.a74ktjm.mongodb.net/Phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
    id: String,
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 3) {
    console.log("phonebook:");
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
    return;
}

const person = new Person({
    id: generateID(),
    name: process.argv[3],
    number: process.argv[4],
})

person.save().then(result => {
    console.log('person saved!')
    mongoose.connection.close()
})