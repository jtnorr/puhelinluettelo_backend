const mongoose = require('mongoose')

/*
if (process.argv.length<3) {
    console.log('Give the following arguments: [password] ([name] [number])')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]
*/

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
console.log('connecting to', url)
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number,
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)

/*
if (process.argv.length > 4) {
    const person = new Person({
        name: `${name}`,
        number: `${number}`,
        id: Math.random() * (99999999999999999 - 1) + 1
    })


    person.save().then(result => {
        console.log(`Added ${name} with number ${number} to the phonebook!`)
        mongoose.connection.close()
    })

}

if (process.argv.length < 4) {
    console.log("phonebook:")
    Person.find({}).then(persons => {
        persons.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}*/
