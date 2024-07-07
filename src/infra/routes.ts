import { makeAuthenticateControllerFactory } from './factories/controllers/authenticate-controller.factory'
import { makeCreateCategoryControllerFactory } from './factories/controllers/create-category-controller.factory'
import { makeCreateOwnerControllerFactory } from './factories/controllers/create-owner-controller.factory'
import { makeCreateProductControllerFactory } from './factories/controllers/create-product-controller.factory'
import { makeAuthenticationMiddlewareFactory } from './factories/middlewares/auth-middleware.factory'
import { expressAdapterMiddleware } from './middlewares/middleware'
import { expressRouteAdapter } from './tools/express'
import { Router } from 'express'

const router = Router()

router.post('/auth', expressRouteAdapter(makeAuthenticateControllerFactory()))
router.post('/owner', expressAdapterMiddleware(makeAuthenticationMiddlewareFactory()), expressRouteAdapter(makeCreateOwnerControllerFactory()))
router.post('/category', expressAdapterMiddleware(makeAuthenticationMiddlewareFactory()), expressRouteAdapter(makeCreateCategoryControllerFactory()))
router.post('/product', expressAdapterMiddleware(makeAuthenticationMiddlewareFactory()), expressRouteAdapter(makeCreateProductControllerFactory()))

export { router }
