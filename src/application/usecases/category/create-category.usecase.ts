import { CategoryData, CategoryEntity } from '@/domain/entities/category/category.entity'
import { CategoryRepositoryInterface } from '@/domain/interfaces/repositories/category-repository.interface'
import { OwnerRepositoryInterface } from '@/domain/interfaces/repositories/owner-repository.interface'
import { CreateCategoryUseCaseInterface } from '@/domain/interfaces/usecases/category/create-category-usecase.interface'
import { InvalidParamError } from '@/shared/errors'

export class CreateCategoryUseCase implements CreateCategoryUseCaseInterface {
  constructor (
    private readonly ownerRepository: OwnerRepositoryInterface,
    private readonly categoryRepository: CategoryRepositoryInterface
  ) {}

  async execute (input: CategoryData): Promise<{ id: string }> {
    const ownerExists = await this.ownerRepository.getById(input?.ownerId)

    if (!ownerExists) {
      throw new InvalidParamError('ownerId')
    }

    const category = CategoryEntity.build(input)
    await this.categoryRepository.save(category)
    return { id: category.id }
  }
}
