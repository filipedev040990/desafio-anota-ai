import { UpdateProductUseCase } from '@/application/usecases/product/update-product.usecase'
import { CategoryRepository } from '@/infra/database/repositories/category.repository'
import { OwnerRepository } from '@/infra/database/repositories/owner.repository'
import { ProductRepository } from '@/infra/database/repositories/product.repository'

export const makeUpdateProductUsecaseFactory = (): UpdateProductUseCase => {
  return new UpdateProductUseCase(new OwnerRepository(), new CategoryRepository(), new ProductRepository())
}
