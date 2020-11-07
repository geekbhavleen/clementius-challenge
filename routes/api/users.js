const express = require('express');
const router = express.Router();
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route    POST /create
// @desc     Create user
// @access   Public
router.post(
  '/',
  [
    check('firstName', 'First Name is required').not().isEmpty(),
    check('lastName', 'Last Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('dob', 'DOB is required').not().isEmpty(),
    check('shortBio', 'Short Bio is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, dob, shortBio } = req.body;

    try {
      let checkUser = await User.findOne({ email });

      if (checkUser) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User with same Email Address Already Exists' }] });
      }

      const user = new User(req.body);
      await user.save((err, user) => {
        if (err) {
          return res.status(400).json({
            err: 'NOT able to save user in DB'
          });
        }

        res.json({
          firstName: user.firstName,
          email: user.email,
          id: user._id
        });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
