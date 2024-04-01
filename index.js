require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('tiny'))

/*let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
]*/


const generateId = () => {
    return Math.random() * (9999999999999999999 - 1) + 1
}

const countPeople = async () => {
    return await Person.countDocuments({});
}

const isInPersons = async (nameToCheck) => {
    const person = Person.findOne({ name: nameToCheck })
    return await person ? true : false
}

app.get('/info', async (request, response) => {
    const timestamp = new Date(Date.now()).toString()
    response.send(`Phonebook has info for ${await countPeople()} people
<br>
<br>
${timestamp}`)
})


app.post('/api/persons', async (request, response) => {
    const body = request.body


    if (!body.name) {
        return response.status(400).json({
            error: "Cannot add a nameless person."
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: "Cannot add a numberless person."
        })
    } else if (await isInPersons(body.name)) { // en ajatellut lukea ohjeistusta loppuun, niin ahkeralla googletuksella ja pienellä ChatGPT:n käytöllä tein async, await -pareja... hups.
        return response.status(400).json({
            error: "Cannot add the same person again."
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
        // id: generateId(),
    })

    await person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})


app.get('/api/persons', (request, response) => {
    Person.find({})
        .then(people => {
        response.json(people)
    })
})


app.get('/api/persons/:id', (request, response, next) => {
/*    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)


    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }*/

    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
/*    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()*/

    Person.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.log(error.message)


    if (error.name === 'CastError') {
        return response.status(400).send({ error: "malformatted id" })
    }

    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(morgan('tiny'))
})
