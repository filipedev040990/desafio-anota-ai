import { CreateProductUseCase } from '@/application/usecases/product/create-product.usecase'
import { CategoryRepository } from '@/infra/database/repositories/category.repository'
import { OwnerRepository } from '@/infra/database/repositories/owner.repository'
import { ProductRepository } from '@/infra/database/repositories/product.repository'

export const makeCreateProductUsecaseFactory = (): CreateProductUseCase => {
  return new CreateProductUseCase(new OwnerRepository(), new CategoryRepository(), new ProductRepository())
}
