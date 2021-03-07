const express = require('express')
const tourControllers = require('./../controllers/tourControllers')
const router = express.Router()

// router.param('id', tourControllers.checkID)
router.route('/tour-stats').get(tourControllers.getTourStats)

router.route('/').get(tourControllers.getAllTours).post(tourControllers.createTour)
router.route('/:id').get(tourControllers.getTour).patch(tourControllers.updateTour).delete(tourControllers.deleteTour)


module.exports = router