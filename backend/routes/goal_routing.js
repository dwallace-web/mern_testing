const express = require('express');
const router = express.Router();
const { getGoals, setGoal, editGoal, deleteGoal } = require('../controllers/goal_controller');


const { authenticate } = require('../middleware/authentication_handling')


router.route('/').get(authenticate, getGoals).post(authenticate, setGoal);
router.route('/:id').delete(authenticate, deleteGoal).put(authenticate, editGoal);

module.exports = router