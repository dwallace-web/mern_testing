const asyncHandler = require('express-async-handler');

const Goal = require('../models/goalModel')
const User = require('../models/userModel')

const getGoals = asyncHandler(async (req, res) => {
    const goals =  await Goal.find({user: req.user.id})
    res.status(200).json(goals)
}) 

const setGoal = asyncHandler(async (req, res) =>  {
    console.log(req.body)
    //throw an error when "text" field does not exist

    if (!req.body.text) {        
        throw new Error('Please add a text field')
    }

    const goal = await Goal.create({
        text: req.body.text,
        user: req.user.id
    })
     
    res.status(200).json({goal})

})

const editGoal = asyncHandler(async (req, res) => {    

    const goal = await Goal.findById(req.params.id)

    if(!goal) {
        res.status(400)
        throw new Error('Goal not found')
    }

    const user = await User.findById(req.user.id)

    if(!user){
        res.status(401)
        throw new Error('User not found!')
    }
    if(goal.user.toString() !== user.id) {
        res.status(401)
        throw new Error('Bad Credentials. Sign back in!')
    }

    const editedGoal = await (Goal.findByIdAndUpdate(req.params.id, req.body, {new:true}))

    res.status(200).json(editedGoal)
})

const deleteGoal = asyncHandler(async (req, res) => {

    const goal = await Goal.findById(req.params.id)

    if(!goal) {
        res.status(400)
        throw new Error('Goal not found')
    }

    const user = await User.findById(req.user.id)

    if(!user){
        res.status(401)
        throw new Error('User not found!')
    }
    if(goal.user.toString() !== user.id) {
        res.status(401)
        throw new Error('Bad Credentials. Sign back in!')
    }

    const deletedGoal = await (Goal.findByIdAndDelete(req.params.id))


    res.status(200).json({"Deleted Goal": deletedGoal})
})

module.exports = { getGoals,setGoal,editGoal,deleteGoal}