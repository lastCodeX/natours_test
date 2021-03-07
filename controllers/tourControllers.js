const APIFeatures = require('./../utils/apiFeatures')
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

exports.getAllTours = async (req,res,next) => {

  try {
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
  } catch (error) {
    res.status(500).json({
      status: 'failed',
      message: error
    })
  }
  next()
}

exports.getTour = async (req, res) => {
// const id = req.params.id * 1
// const tour = tours.find(el => el.id === id)
try {
  const tour = await Tour.findById(req.params.id)
  res.status(201).json({
    status: 'success',
    data: {
      tour
    }
  })
} catch (error) {
  res.status(400).json({
    status: 'failed',
    message: error
  })
}



}

exports.createTour = async (req, res) => {
// const newId = tours[tours.length - 1].id + 1
// const newTour = Object.assign({id: newId}, req.body)
// tours.push(newTour)
// fs.writeFile(`${__dirname}/../dev_data/data/tours_simples.json`, JSON.stringify(tours), err => {
  try {
    const newTour = await Tour.create(req.body)
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    })
  }
}

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    })
  }

}

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      data: null
      })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    })
  }
}

exports.getTourStats = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    })
  }
}