const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

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
	const user = users.find((user) => user.id === id)

	if (!user) {
		return res.status(404).json({ message: 'Nie znaleziono użytkownika' })
	}

	res.json({
		message: 'Pobrano użytkownika',
		id: id,
	})
})

app.post('/api/users', (req, res) => {
	if (!req.body.name) {
		return res.status(400).send('Brak nazwy użytkownika')
	}

	const id = Math.max(...users.map((user) => user.id), 0) + 1
	const user = { id, name: req.body.name }
	users.push(user)

	res.status(201).json(user)
})

app.put('/api/users/:id', (req, res) => {
	const id = Number(req.params.id)

	if (!req.body.name) {
		return res.status(400).send('Brak nazwy użytkownika')
	}

	const user = users.find((user) => user.id === id)
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

	const userIndex = users.findIndex((user) => user.id === id)
	if (userIndex === -1) {
		return res.status(404).send('Nie znaleziono użytkownika')
	}

	users.splice(userIndex, 1)
	res.status(204).send()
})

app.listen(port, () => {
	console.log(`Serwer działa na porcie ${port}`)
})
