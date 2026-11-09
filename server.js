const express = require('express')
const app = express()
const port = process.env.PORT || 3000

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

app.listen(port, () => {
	console.log(`Serwer działa na porcie ${port}`)
})

// Zadanie 4.1c
// Wyjaśnij, czym różni się app.get() od app.listen().

// app.get() to metoda która określa co powinno się stać, gdy użytkownik wejdzie na wskazany endpoint.

// app.listen() to metoda, która włącza serwer i nasłuchuje żądań na wskazanym porcie.
