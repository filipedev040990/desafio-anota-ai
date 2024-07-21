import { CategoryRepositoryInterface } from '@/domain/interfaces/repositories/category-repository.interface'
import { UpdateCategoryUseCaseInput, UpdateCategoryUseCaseInterface } from '@/domain/interfaces/usecases/category/update-category-usecase.interface'
import { MissingParamError } from '@/shared/errors'

export class UpdateCategoryUseCase implements UpdateCategoryUseCaseInterface {
  constructor (
    private readonly categoryRepository: CategoryRepositoryInterface
  ) {}

  async execute (input: UpdateCategoryUseCaseInput): Promise<void> {
    this.validate(input)
    await this.categoryRepository.update(input)
  }

  validate (input: UpdateCategoryUseCaseInput): void {
    const { id, description, title } = input
    if (!id) {
      throw new MissingParamError('id')
    }

    if (!description && !title) {
      throw new MissingParamError('description or title must be provided')
    }
  }
}
