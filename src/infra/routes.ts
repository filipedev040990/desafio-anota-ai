import { makeAuthenticateControllerFactory } from './factories/controllers/authenticate-controller.factory'
import { makeCreateCatalogControllerFactory } from './factories/controllers/create-catalog-controller.factory'
import { makeCreateCategoryControllerFactory } from './factories/controllers/create-category-controller.factory'
import { makeCreateOwnerControllerFactory } from './factories/controllers/create-owner-controller.factory'
import { makeCreateProductControllerFactory } from './factories/controllers/create-product-controller.factory'
import { makeGetCatalogByOwnerIdControllerFactory } from './factories/controllers/get-catalog-by-ownerId-controller.factory'
import { makeListCategoryControllerFactory } from './factories/controllers/list-category-controller.factory'
import { makeUpdateOwnerControllerFactory } from './factories/controllers/update-owner-controller.factory'
import { makeAuthenticationMiddlewareFactory } from './factories/middlewares/auth-middleware.factory'
import { expressAdapterMiddleware } from './middlewares/middleware'
import { expressRouteAdapter } from './tools/express'
import { Router } from 'express'

const router = Router()

router.post('/auth', expressRouteAdapter(makeAuthenticateControllerFactory()))

// Owner
router.post('/owner', expressRouteAdapter(makeCreateOwnerControllerFactory()))
router.put('/owner', expressAdapterMiddleware(makeAuthenticationMiddlewareFactory()), expressRouteAdapter(makeUpdateOwnerControllerFactory()))

// Category
router.post('/category', expressAdapterMiddleware(makeAuthenticationMiddlewareFactory()), expressRouteAdapter(makeCreateCategoryControllerFactory()))
router.get('/category', expressAdapterMiddleware(makeAuthenticationMiddlewareFactory()), expressRouteAdapter(makeListCategoryControllerFactory()))

router.post('/product', expressAdapterMiddleware(makeAuthenticationMiddlewareFactory()), expressRouteAdapter(makeCreateProductControllerFactory()))
router.post('/catalog', expressAdapterMiddleware(makeAuthenticationMiddlewareFactory()), expressRouteAdapter(makeCreateCatalogControllerFactory()))
router.get('/full_catalog', expressAdapterMiddleware(makeAuthenticationMiddlewareFactory()), expressRouteAdapter(makeGetCatalogByOwnerIdControllerFactory()))

export { router }
