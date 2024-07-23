import { DeleteCategoryUseCase } from '@/application/usecases/category/delete-category.usecase'
import { CatalogRepository } from '@/infra/database/repositories/catalog.repository'
import { CategoryRepository } from '@/infra/database/repositories/category.repository'
import { ProductRepository } from '@/infra/database/repositories/product.repository'

export const makeDeleteCategoryUseCaseFactory = (): DeleteCategoryUseCase => {
  return new DeleteCategoryUseCase(new CategoryRepository(), new CatalogRepository(), new ProductRepository())
}
