import { ListAllProductsUseCase } from '@/application/usecases/product/list-products.usecase'
import { OwnerRepository } from '@/infra/database/repositories/owner.repository'
import { ProductRepository } from '@/infra/database/repositories/product.repository'

export const makeListAllProductsUsecaseFactory = (): ListAllProductsUseCase => {
  return new ListAllProductsUseCase(new OwnerRepository(), new ProductRepository())
}
