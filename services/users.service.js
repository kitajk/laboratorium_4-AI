const fs = require('node:fs/promises')
const path = require('node:path')

const file = path.join(__dirname, '..', 'data', 'users.json')

async function getUsers() {
	const data = await fs.readFile(file, 'utf8')
	return JSON.parse(data)
}

async function saveUsers(users) {
	await fs.writeFile(file, `${JSON.stringify(users, null, 2)}\n`, 'utf8')
}

async function getUserById(id) {
	const users = await getUsers()
	return users.find(user => user.id === id)
}

async function createUser(userData) {
	const users = await getUsers()
	const id = Math.max(...users.map(user => user.id), 0) + 1
	const user = { id, name: userData.name.trim(), email: userData.email }
	users.push(user)
	await saveUsers(users)
	return user
}

async function updateUser(id, userData) {
	const users = await getUsers()
	const user = users.find(user => user.id === id)
	if (!user) {
		return null
	}

	user.name = userData.name.trim()
	user.email = userData.email
	await saveUsers(users)
	return user
}

async function deleteUser(id) {
	const users = await getUsers()
	const userIndex = users.findIndex(user => user.id === id)
	if (userIndex === -1) {
		return false
	}

	users.splice(userIndex, 1)
	await saveUsers(users)
	return true
}

module.exports = {
	getUsers,
	getUserById,
	createUser,
	updateUser,
	deleteUser,
}
