import { ListProductByIdUseCase } from '@/application/usecases/product/list-product-by-id.usecase'
import { OwnerRepository } from '@/infra/database/repositories/owner.repository'
import { ProductRepository } from '@/infra/database/repositories/product.repository'

export const makeListProductByIdUsecaseFactory = (): ListProductByIdUseCase => {
  return new ListProductByIdUseCase(new OwnerRepository(), new ProductRepository())
}
