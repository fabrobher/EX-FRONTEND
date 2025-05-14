// This is a new file for solution!
import { check } from 'express-validator'
import { Restaurant, Performance } from '../../models/models.js'

const checkRestaurantExists = async (value, { req }) => {
  try {
    const restaurant = await Restaurant.findByPk(req.body.restaurantId)
    if (restaurant === null) {
      return Promise.reject(new Error('The restaurantId does not exist.'))
    } else { return Promise.resolve() }
  } catch (err) {
    return Promise.reject(new Error(err))
  }
}

const checkPerformancesSameDate = async (value, { req }) => {
  try {
    let error = false
    const performances = await Performance.findAll({ where: { restaurantId: req.body.restaurantId} } )
    
    for (const performance of performances) {
      const newPerformanceDate = new Date(req.body.appointment)
      const performanceDateToCompare = performance.appointment
      if ( newPerformanceDate.getTime() == performanceDateToCompare.getTime() ) {
        error = true  
        break
      }  
    }
    
    if (error) {
      return Promise.reject(new Error('No pueden haber dos actuaciones en el mismo día.'))
    } else { 
      return Promise.resolve() 
    }
  } catch (err) {
    return Promise.reject(new Error(err))
  }
}

const create = [
  check('group').exists().isString().isLength({ min: 1, max: 255 }).trim(),
  check('appointment').exists().toDate(),
  check('restaurantId').exists().isInt({ min: 1 }).toInt(),
  check('restaurantId').custom(checkRestaurantExists),
  check('restaurantId').custom(checkPerformancesSameDate)
]

export { create }
