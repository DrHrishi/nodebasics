const { validationResult, body } = require('express-validator');
exports.signupValidator = [
    [
        body('name').exists(),
        body('email').exists()
            .matches(/.+\@.+\..+/)
            .withMessage('email must contain @')
            .isLength({ min: 4, max: 200 }),
        body('password').exists()
            .isLength({ min: 4, max: 200 })
            .withMessage('Password must contain at least 6 char max 200 char')
            .matches(/\d/)
            .withMessage('must contain number')
    ], (req, res, next) => {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            const firsrError = errors.array().map((error) => error)[0]
            return res.status(400).json({ error: firsrError })
        }
        next()
    }
]