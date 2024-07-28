import { DeleteProductUseCase } from '@/application/usecases/product/delete-product-by-id.usecase'
import { CatalogRepository } from '@/infra/database/repositories/catalog.repository'
import { OwnerRepository } from '@/infra/database/repositories/owner.repository'
import { ProductRepository } from '@/infra/database/repositories/product.repository'

export const makeDeleteProductUsecaseFactory = (): DeleteProductUseCase => {
  return new DeleteProductUseCase(new OwnerRepository(), new ProductRepository(), new CatalogRepository())
}
