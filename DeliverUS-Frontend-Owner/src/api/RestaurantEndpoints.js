import { destroy, get, post, put } from './helpers/ApiRequestsHelper'
function getAll () {
  return get('users/myrestaurants')
}

function getDetail (id) {
  return get(`restaurants/${id}`)
}

function getRestaurantCategories () {
  return get('restaurantCategories')
}

function create (data) {
  return post('restaurants', data)
}

function update (id, data) {
  return put(`restaurants/${id}`, data)
}

function remove (id) {
  return destroy(`restaurants/${id}`)
}

function getOrdersFromRestaurant (id) {
  return destroy(`restaurants/${id}/orders`)
}

export { create, getAll, getDetail, getOrdersFromRestaurant, getRestaurantCategories, remove, update }
