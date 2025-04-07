const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../validations/userValidation');
const { validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post('/register', registerValidation, handleValidation, register);
router.post('/login', loginValidation, handleValidation, login);

module.exports = router;
