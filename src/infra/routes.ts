import { makeAuthenticateControllerFactory } from './factories/controllers/authenticate-controller.factory'
import { makeCreateCatalogControllerFactory } from './factories/controllers/create-catalog-controller.factory'
import { makeCreateCategoryControllerFactory } from './factories/controllers/create-category-controller.factory'
import { makeCreateOwnerControllerFactory } from './factories/controllers/create-owner-controller.factory'
import { makeCreateProductControllerFactory } from './factories/controllers/create-product-controller.factory'
import { makeDeleteCategoryControllerFactory } from './factories/controllers/delete-category-controller.factory'
import { makeDeleteProductControllerFactory } from './factories/controllers/delete-product-controller.factory'
import { makeGetCatalogByOwnerIdControllerFactory } from './factories/controllers/get-catalog-by-ownerId-controller.factory'
import { makeListAllProductsControllerFactory } from './factories/controllers/list-all-products-controller.factory'
import { makeListCategoryControllerFactory } from './factories/controllers/list-category-controller.factory'
import { makeListProductByIdControllerFactory } from './factories/controllers/list-product-by-id-controller.factory'
import { makeUpdateCategoryControllerFactory } from './factories/controllers/update-category-controller.factory'
import { makeUpdateOwnerControllerFactory } from './factories/controllers/update-owner-controller.factory'
import { makeUpdateProductControllerFactory } from './factories/controllers/update-product-controller.factory'
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
router.put('/category/:id', expressAdapterMiddleware(makeAuthenticationMiddlewareFactory()), expressRouteAdapter(makeUpdateCategoryControllerFactory()))
router.delete('/category/:id', expressAdapterMiddleware(makeAuthenticationMiddlewareFactory()), expressRouteAdapter(makeDeleteCategoryControllerFactory()))
router.post('/category', expressAdapterMiddleware(makeAuthenticationMiddlewareFactory()), expressRouteAdapter(makeCreateCategoryControllerFactory()))
router.get('/category', expressAdapterMiddleware(makeAuthenticationMiddlewareFactory()), expressRouteAdapter(makeListCategoryControllerFactory()))

// Product
router.put('/product/:id', expressAdapterMiddleware(makeAuthenticationMiddlewareFactory()), expressRouteAdapter(makeUpdateProductControllerFactory()))
router.get('/product/:id', expressAdapterMiddleware(makeAuthenticationMiddlewareFactory()), expressRouteAdapter(makeListProductByIdControllerFactory()))
router.delete('/product/:id', expressAdapterMiddleware(makeAuthenticationMiddlewareFactory()), expressRouteAdapter(makeDeleteProductControllerFactory()))
router.post('/product', expressAdapterMiddleware(makeAuthenticationMiddlewareFactory()), expressRouteAdapter(makeCreateProductControllerFactory()))
router.get('/product', expressAdapterMiddleware(makeAuthenticationMiddlewareFactory()), expressRouteAdapter(makeListAllProductsControllerFactory()))

// Catalog
router.post('/catalog', expressAdapterMiddleware(makeAuthenticationMiddlewareFactory()), expressRouteAdapter(makeCreateCatalogControllerFactory()))
router.get('/full_catalog', expressAdapterMiddleware(makeAuthenticationMiddlewareFactory()), expressRouteAdapter(makeGetCatalogByOwnerIdControllerFactory()))

export { router }
