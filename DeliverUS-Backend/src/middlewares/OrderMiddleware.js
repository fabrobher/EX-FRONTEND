import { Order, Restaurant } from '../models/models.js'

// TODO: Implement the following function to check if the order belongs to current loggedIn customer (order.userId equals or not to req.user.id)
const checkOrderCustomer = async (req, res, next) => {
  return next()
}

// TODO: Implement the following function to check if the restaurant of the order exists
const checkRestaurantExists = async (req, res, next) => {
  return next()
}

const checkOrderOwnership = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.orderId, {
      include: {
        model: Restaurant,
        as: 'restaurant'
      }
    })
    if (req.user.id === order.restaurant.userId) {
      return next()
    } else {
      return res.status(403).send('Not enough privileges. This entity does not belong to you')
    }
  } catch (err) {
    return res.status(500).send(err)
  }
}

const checkOrderVisible = (req, res, next) => {
  if (req.user.userType === 'owner') {
    checkOrderOwnership(req, res, next)
  } else if (req.user.userType === 'customer') {
    checkOrderCustomer(req, res, next)
  }
}

// TODO: Middlewares de control de tiempo límite y estado válido para deshacerse
const checkDate = (fecha) => {
  const diff = Math.abs(new Date() - fecha) // diferencia en milisegundos
  return ((diff / 60000) <= 5)
}

const checkOrderCanBeForwarded = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.orderId)
    const status = order.status
    if (status !== 'delivered') {
      return next()
    } else {
      return res.status(409).send('The order is already delivered')
    }
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const checkOrderCanBeBackwarded = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.orderId)
    switch (order.status) {
      case 'in process':
        if (!checkDate(order.startedAt)) { return res.status(409).send('The order cannot be backwarded after 5 minutes') }
        break
      case 'sent':
        if (!checkDate(order.sentAt)) { return res.status(409).send('The order cannot be backwarded after 5 minutes') }
        break
      case 'delivered':
        if (!checkDate(order.deliveredAt)) { return res.status(409).send('The order cannot be backwarded after 5 minutes') }
        break
      default:
        return res.status(409).send('The order is already pending')
    }
    return next()
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

export { checkOrderOwnership, checkOrderCustomer, checkOrderVisible, checkRestaurantExists, checkOrderCanBeForwarded, checkOrderCanBeBackwarded }
