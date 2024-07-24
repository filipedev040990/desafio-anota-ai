import { CategoryRepositoryInterface } from '@/domain/interfaces/repositories/category-repository.interface'
import { UpdateCategoryUseCaseInput, UpdateCategoryUseCaseInterface } from '@/domain/interfaces/usecases/category/update-category-usecase.interface'
import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { publishUpdateCatalogMessage } from '@/shared/helpers/utils.helper'

export class UpdateCategoryUseCase implements UpdateCategoryUseCaseInterface {
  constructor (
    private readonly categoryRepository: CategoryRepositoryInterface
  ) {}

  async execute (input: UpdateCategoryUseCaseInput): Promise<void> {
    await this.validate(input)
    await this.categoryRepository.update(input)
    await publishUpdateCatalogMessage(input.ownerId)
  }

  async validate (input: UpdateCategoryUseCaseInput): Promise<void> {
    const { id, ownerId, description, title } = input
    if (!id) {
      throw new MissingParamError('id')
    }

    const category = await this.categoryRepository.getByIdAndOwnerId(id, ownerId)

    if (!category) {
      throw new InvalidParamError('id')
    }

    if (!description && !title) {
      throw new MissingParamError('description or title must be provided')
    }
  }
}
