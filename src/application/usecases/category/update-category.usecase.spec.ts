import { CategoryRepositoryInterface } from '@/domain/interfaces/repositories/category-repository.interface'
import { mock } from 'jest-mock-extended'
import { UpdateCategoryUseCase } from './update-category.usecase'
import { UpdateCategoryUseCaseInput } from '@/domain/interfaces/usecases/category/update-category-usecase.interface'
import { MissingParamError } from '@/shared/errors'

const categoryRepository = mock<CategoryRepositoryInterface>()

describe('UpdateCategoryUseCase', () => {
  let sut: UpdateCategoryUseCase
  let input: UpdateCategoryUseCaseInput

  beforeEach(() => {
    sut = new UpdateCategoryUseCase(categoryRepository)
    input = {
      id: 'anyid',
      description: 'anyDescription',
      title: 'anyTitle'
    }
  })

  test('should call CategoryRepository.save once and with correct values', async () => {
    await sut.execute(input)
    expect(categoryRepository.update).toHaveBeenCalledTimes(1)
    expect(categoryRepository.update).toHaveBeenCalledWith(input)
  })

  test('should throw if id is not provided', async () => {
    input.id = undefined as any
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new MissingParamError('id'))
  })

  test('should throw if description and title are not provided', async () => {
    input.description = undefined as any
    input.title = undefined as any
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new MissingParamError('description or title must be provided'))
  })
})
