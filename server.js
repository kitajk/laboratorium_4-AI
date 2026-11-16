const express = require('express')
const { body, param, validationResult } = require('express-validator')
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
	{ id: 1, name: 'Jan Kowalski', email: 'jan@example.com' },
	{ id: 2, name: 'Anna Nowak', email: 'anna@example.com' },
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

	res.json(user)
})

app.get('/api/users', (req, res) => {
	res.json(users)
})

const userValidation = [
	body('name').trim().notEmpty().withMessage('Pole name jest wymagane'),
	body('email').isEmail().withMessage('Pole email musi zawierać poprawny adres email'),
]

const sendValidationErrors = (req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	}

	next()
}

app.post('/api/users', userValidation, sendValidationErrors, (req, res) => {
	const id = Math.max(...users.map(user => user.id), 0) + 1
	const user = { id, name: req.body.name.trim(), email: req.body.email }
	users.push(user)

	res.status(201).json(user)
})

app.put(
	'/api/users/:id',
	[
		param('id').isInt().withMessage('Parametr id musi być liczbą całkowitą'),
		...userValidation,
	],
	sendValidationErrors,
	(req, res) => {
		const id = Number(req.params.id)
		const user = users.find(user => user.id === id)
		if (!user) {
			return res.status(404).json({ message: 'Nie znaleziono użytkownika' })
		}

		user.name = req.body.name.trim()
		user.email = req.body.email
		res.status(200).json(user)
	},
)

app.delete('/api/users/:id', (req, res) => {
	const id = Number(req.params.id)

	if (isNaN(id)) {
		return res.status(400).json({ message: 'Nieprawidłowe id' })
	}

	const userIndex = users.findIndex(user => user.id === id)
	if (userIndex === -1) {
		return res.status(404).json({ message: 'Nie znaleziono użytkownika' })
	}

	users.splice(userIndex, 1)
	res.status(204).send()
})

app.listen(port, () => {
	console.log(`Serwer działa na porcie ${port}`)
})
