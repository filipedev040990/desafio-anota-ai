import { CreateCategoryUseCase } from '@/application/usecases/category/create-category.usecase'
import { CategoryRepository } from '@/infra/database/repositories/category.repository'
import { OwnerRepository } from '@/infra/database/repositories/owner.repository'

export const makeCreateCategoryUsecaseFactory = (): CreateCategoryUseCase => {
  return new CreateCategoryUseCase(new OwnerRepository(), new CategoryRepository())
}
