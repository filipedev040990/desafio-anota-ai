import { CategoryRepositoryInterface } from '@/domain/interfaces/repositories/category-repository.interface'
import { UpdateCategoryUseCase } from './update-category.usecase'
import { UpdateCategoryUseCaseInput } from '@/domain/interfaces/usecases/category/update-category-usecase.interface'
import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { mock } from 'jest-mock-extended'

jest.mock('@/shared/helpers/utils.helper', () => ({
  publishUpdateCatalogMessage: jest.fn()
}))

const categoryRepository = mock<CategoryRepositoryInterface>()
const fakeCategory = {
  id: 'anyCategoryId',
  ownerId: 'anyOwnerId',
  title: 'anyTitle',
  description: 'v',
  createdAt: new Date(),
  updatedAt: null
}

describe('UpdateCategoryUseCase', () => {
  let sut: UpdateCategoryUseCase
  let input: UpdateCategoryUseCaseInput

  beforeEach(() => {
    sut = new UpdateCategoryUseCase(categoryRepository)
    input = {
      id: 'anyCategoryId',
      ownerId: 'anyOwnerId',
      description: 'anyDescription',
      title: 'anyTitle'
    }
    categoryRepository.getByIdAndOwnerId.mockResolvedValue(fakeCategory)
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

  test('should call CategoryRepository.getByIdAndOwnerId once and with correct values', async () => {
    await sut.execute(input)
    expect(categoryRepository.getByIdAndOwnerId).toHaveBeenCalledTimes(1)
    expect(categoryRepository.getByIdAndOwnerId).toHaveBeenCalledWith('anyCategoryId', 'anyOwnerId')
  })

  test('should throw if CategoryRepository.getByIdAndOwnerId returns null', async () => {
    categoryRepository.getByIdAndOwnerId.mockResolvedValueOnce(null)
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new InvalidParamError('id'))
  })

  test('should throw if description and title are not provided', async () => {
    input.description = undefined as any
    input.title = undefined as any
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new MissingParamError('description or title must be provided'))
  })
})
