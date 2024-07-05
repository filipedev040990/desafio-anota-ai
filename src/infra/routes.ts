import { makeAuthenticateControllerFactory } from './factories/controllers/authenticate-controller.factory'
import { makeCreateCategoryControllerFactory } from './factories/controllers/create-category-controller.factory'
import { makeCreateOwnerControllerFactory } from './factories/controllers/create-owner-controller.factory'
import { makeCreateProductControllerFactory } from './factories/controllers/create-product-controller.factory'
import { expressRouteAdapter } from './tools/express'
import { Router } from 'express'

const router = Router()

router.post('/auth', expressRouteAdapter(makeAuthenticateControllerFactory()))
router.post('/owner', expressRouteAdapter(makeCreateOwnerControllerFactory()))
router.post('/category', expressRouteAdapter(makeCreateCategoryControllerFactory()))
router.post('/product', expressRouteAdapter(makeCreateProductControllerFactory()))

export { router }
