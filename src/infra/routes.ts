import { makeCreateOwnerControllerFactory } from './factories/controllers/create-owner-controller.factory'
import { expressRouteAdapter } from './tools/express'
import { Router } from 'express'

const router = Router()

router.post('/owner', expressRouteAdapter(makeCreateOwnerControllerFactory()))

export { router }
