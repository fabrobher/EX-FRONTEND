import { destroy, get, patch, post, put } from './helpers/ApiRequestsHelper'
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

function togglePinned (id) {
  return patch(`restaurants/${id}/togglePinned `)
}

export { create, getAll, getDetail, getRestaurantCategories, remove, togglePinned, update }
