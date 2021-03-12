const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const Tour = require('./../model/tourModel')
const fs = require('fs')

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev_data/data/tours_simples.json`))

// exports.checkID = (req, res, next) => {
//   if(req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID'
//     })
//   }
//   next()
// }

// exports.checkBody = (req, res, next) => {
//   if(!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price'
//     })
//   }
//   next()
// }

exports.getAllTours = catchAsync(async (req,res,next) => {
  const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()
    const tours = await features.query
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      } 
    })
})

exports.getTour = catchAsync(async (req, res, next) => {
// const id = req.params.id * 1
// const tour = tours.find(el => el.id === id)
  const tour = await Tour.findById(req.params.id)
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404))
  }
  res.status(201).json({
    status: 'success',
    data: {
      tour
    }
  })
})





exports.createTour = catchAsync(async (req, res, next) => {
// const newId = tours[tours.length - 1].id + 1
// const newTour = Object.assign({id: newId}, req.body)
// tours.push(newTour)
// fs.writeFile(`${__dirname}/../dev_data/data/tours_simples.json`, JSON.stringify(tours), err => {
  const newTour = await Tour.create(req.body)
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  })
})

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404))
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  })
})

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id)
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404))
  }
  res.status(204).json({
    data: null
    })
})

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {ratingAverage: {$gte: 4.5}}
    },
    {
      $group: {
        _id: '$difficulty',
        avgRating: {$avg: '$ratingAverage'},
        avgPrice: {$avg: '$price'},
        minPrice: {$min: '$price'},
        maxPrice: {$max: '$price'}
      }
    }
  ])
  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  })
})