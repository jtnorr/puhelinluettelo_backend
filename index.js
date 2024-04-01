const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))


let persons = [
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
]

const generateId = () => {
    return Math.random() * (9999999999999999999 - 1) + 1
}
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

const countPeople = () => {
    return persons.length
}

const isInPersons = (nameToCheck) => {
    return persons.some(person => person.name === nameToCheck)
}


app.get('/info', (request, response) => {
    const timestamp = new Date(Date.now()).toString()
    response.send(`Phonebook has info for ${countPeople()} people
<br>
<br>
${timestamp}`)
})


app.post('/api/persons', (request, response) => {
    const body = request.body


    if (!body.name) {
        return response.status(400).json({
            error: "Cannot add a nameless person."
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: "Cannot add a numberless person."
        })
    } else if (isInPersons(body.name)) {
        return response.status(400).json( {
            error: "Cannot add the same person again."
        })
    }

        const person = {
            name: body.name,
            number: body.number,
            id: generateId()
        }


    persons = persons.concat(person)

    response.json(person)
})
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)


    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})



const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(morgan('tiny'))
})