const User = require('./../model/userModel')
const catchAsync = require('./../utils/catchAsync')

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find()
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      } 
    })
})


exports.createUser = (req,res) => {
  res.status(500).json({
  status: 'error',
  message: 'Route not found'
})
}

exports.getUser = (req,res) => {
  res.status(500).json({
  status: 'error',
  message: 'Route not found'
})
}

exports.updateUser = (req,res) => {
  res.status(500).json({
  status: 'error',
  message: 'Route not found'
})
}

exports.deleteUser = (req,res) => {
  res.status(500).json({
  status: 'error',
  message: 'Route not found'
})
}