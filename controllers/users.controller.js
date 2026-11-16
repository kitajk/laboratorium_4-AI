const usersService = require('../services/users.service')

function httpError(status, message) {
	const error = new Error(message)
	error.status = status
	return error
}

async function getAll(req, res) {
	res.json(await usersService.getUsers())
}

async function getById(req, res) {
	const user = await usersService.getUserById(Number(req.params.id))
	if (!user) {
		throw httpError(404, 'Nie znaleziono użytkownika')
	}

	res.json(user)
}

async function create(req, res) {
	res.status(201).json(await usersService.createUser(req.body))
}

async function update(req, res) {
	const user = await usersService.updateUser(Number(req.params.id), req.body)
	if (!user) {
		throw httpError(404, 'Nie znaleziono użytkownika')
	}

	res.json(user)
}

async function remove(req, res) {
	const deleted = await usersService.deleteUser(Number(req.params.id))
	if (!deleted) {
		throw httpError(404, 'Nie znaleziono użytkownika')
	}

	res.status(204).send()
}

module.exports = { getAll, getById, create, update, remove }
