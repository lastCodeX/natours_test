const mongoose = require('mongoose')
const slugify = require('slugify')


const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour name must have less or equal then 40 characters'],
    minlength: [10, 'A tour name must have more or equal then 10 characters']
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'Atour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size']
  },
  difficulty: {
    type: String,
    required: [true, 'Atour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium, difficult'
    }
  },
  rating: {
    type: Number,
    default: 4.5
  },
  ratingAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0']
  },
  ratingQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have cover image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  secretTour: {
    type: Boolean,
    default: false
  }
}, {
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
})

//Virtual properties
tourSchema.virtual('durationWeeks').get(function(){
  return this.duration / 7
})

// Document Middleware
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, {lower: true})
  next()
})

//Query Middleware
tourSchema.pre(/^find/, function(next) {
  this.find({secretTour: {$ne: true}})
  next()
})

//Aggregation middleware
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({$match: {secretTour: {$ne: true}}})
  next()
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour