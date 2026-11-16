const express = require('express')
const logger = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const usersRouter = require('./routes/users.routes')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))
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

app.use('/api/users', usersRouter)

app.use((req, res) => {
	res.status(404).json({ error: 'Nie znaleziono endpointu' })
})

app.use(errorHandler)

if (require.main === module) {
	app.listen(port, () => {
		console.log(`Serwer działa na porcie ${port}`)
	})
}

module.exports = app
