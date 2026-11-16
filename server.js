const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))

const logger = (req, res, next) => {
	console.log(`${new Date().toISOString()} ${req.method} ${req.url}`)
	next()
}

app.use(logger)

const router = express.Router()

router.use((req, res, next) => {
	console.log(`Middleware routera: ${req.method} ${req.url}`)
	next()
})

router.get('/', (req, res) => {
	res.send('To jest trasa obsługiwana przez router.')
})

router.post('/form', (req, res) => {
	res.send(`Odebrano formularz. Imię: ${req.body.name}, email: ${req.body.email}`)
})

app.use('/router', router)

const users = [
	{ id: 10, name: 'Anna' },
	{ id: 25, name: 'Jan' },
]

app.get('/', (req, res) => {
	res.send('Witaj w aplikacji Express!')
})

app.get('/contact', (req, res) => {
	res.send('Kontakt.')
})

app.post('/form', (req, res) => {
	res.send(`Wysłano formularz. Imię: ${req.body.name}, wiadomość: ${req.body.message}`)
})

app.get('/api/info', (req, res) => {
	res.json({
		application: 'Express LAB4',
		version: '1.0',
	})
})

// Zadanie 4.1c
// Wyjaśnij, czym różni się app.get() od app.listen().

// app.get() to metoda która określa co powinno się stać, gdy użytkownik wejdzie na wskazany endpoint.

// app.listen() to metoda, która włącza serwer i nasłuchuje żądań na wskazanym porcie.

app.get('/api/users/:id', (req, res) => {
	const id = Number(req.params.id)
	const user = users.find(user => user.id === id)

	if (!user) {
		return res.status(404).json({ message: 'Nie znaleziono użytkownika' })
	}

	res.json({
		message: 'Pobrano użytkownika',
		id: id,
	})
})

app.use(express.json())

app.post('/api/users', (req, res) => {
	if (!req.body.name) {
		return res.status(400).send('Brak nazwy użytkownika')
	}

	const id = Math.max(...users.map(user => user.id), 0) + 1
	const user = { id, name: req.body.name }
	users.push(user)

	res.status(201).json(user)
})

app.use(express.json())

app.put('/api/users/:id', (req, res) => {
	const id = Number(req.params.id)

	if (!req.body.name) {
		return res.status(400).send('Brak nazwy użytkownika')
	}

	const user = users.find(user => user.id === id)
	if (!user) {
		return res.status(404).send('Nie znaleziono użytkownika')
	}

	user.name = req.body.name
	res.status(200).json(user)
})

app.delete('/api/users/:id', (req, res) => {
	const id = Number(req.params.id)

	if (isNaN(id)) {
		return res.status(400).send('Nieprawidłowe id')
	}

	const userIndex = users.findIndex(user => user.id === id)
	if (userIndex === -1) {
		return res.status(404).send('Nie znaleziono użytkownika')
	}

	users.splice(userIndex, 1)
	res.status(204).send()
})

app.listen(port, () => {
	console.log(`Serwer działa na porcie ${port}`)
})
