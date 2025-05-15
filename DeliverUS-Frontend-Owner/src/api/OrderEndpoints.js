import { patch } from './helpers/ApiRequestsHelper'

function fordward (id) {
  return patch(`orders/${id}/forward`)
}

function backward (id) {
  return patch(`orders/${id}/backward`)
}

export { backward, fordward }
