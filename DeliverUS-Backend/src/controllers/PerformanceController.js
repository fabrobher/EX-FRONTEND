// This is a new file for solution!
import { Performance } from '../models/models.js'

const create = async function (req, res) {
  let newPerformance = Performance.build(req.body)
  try {
    newPerformance = await newPerformance.save()
    res.json(newPerformance)
  } catch (err) {
    res.status(500).send(err)
  }
}

const PerformanceController = {
  create
}
export default PerformanceController
