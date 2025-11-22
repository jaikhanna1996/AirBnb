

const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res) => {
  res.render('login', { activeTab: 'login', isLoggedIn: false });
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.render('login', {
        errors: [{ msg: 'Invalid email or password' }],
        activeTab: 'login',
        isLoggedIn: false
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render('login', {
        errors: [{ msg: 'Invalid email or password' }],
        activeTab: 'login',
        isLoggedIn: false
      });
    }

    req.session.isLoggedIn = true;
    req.session.user = user._id; // Store user ID in session
    res.redirect('/');
  } catch (error) {
    console.error('Error during login:', error);
    return res.render('login', {
      errors: [{ msg: 'An error occurred. Please try again.' }],
      activeTab: 'login',
      isLoggedIn: false
    });
  }
};

exports.getSignup = (req, res) => {
  res.render('signup', { activeTab: 'signup', isLoggedIn: false });
};

const validateSignup = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
  body('usertype').isIn(['guest', 'host']).withMessage('Invalid user type'),
  body('terms').equals('on').withMessage('You must accept the terms')
];

exports.validateSignup = validateSignup;

exports.postSignup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('signup', { errors: errors.array(), activeTab: 'signup', isLoggedIn: false });
  }

  const { firstName, lastName, email, password, usertype, terms } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('signup', { errors: [{ msg: 'This email is already registered' }], activeTab: 'signup', isLoggedIn: false });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userType: usertype
    });

    await user.save();

    res.redirect('/login');
  } catch (error) {
    console.error('Error saving user:', error);
    return res.render('signup', { errors: [{ msg: 'Error creating account. Please try again.' }], activeTab: 'signup', isLoggedIn: false });
  }
};

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.redirect('/');
    }
    res.redirect('/login');
  });
};



module.exports = {
  getLogin: exports.getLogin,
  postLogin: exports.postLogin,
  getSignup: exports.getSignup,
  validateSignup: exports.validateSignup,
  postSignup: exports.postSignup,
  postLogout: exports.postLogout
};
