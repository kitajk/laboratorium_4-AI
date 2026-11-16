const router = require('express').Router()
const { body, param, validationResult } = require('express-validator')
const usersController = require('../controllers/users.controller')

const validateUser = [
	body('name').trim().notEmpty().withMessage('Pole name jest wymagane'),
	body('email').isEmail().withMessage('Pole email musi zawierać poprawny adres email'),
]

const validateRequest = (req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	}

	next()
}

router.get('/', usersController.getAll)
router.get('/:id', param('id').isInt(), validateRequest, usersController.getById)
router.post('/', validateUser, validateRequest, usersController.create)
router.put(
	'/:id',
	[param('id').isInt().withMessage('Parametr id musi być liczbą całkowitą'), ...validateUser],
	validateRequest,
	usersController.update,
)
router.delete('/:id', param('id').isInt(), validateRequest, usersController.remove)

module.exports = router
