import { MissingParamError } from '@/shared/errors'
import { ListCategoryUseCase } from './list-category.usecase'
import { mock } from 'jest-mock-extended'
import { CategoryRepositoryData, CategoryRepositoryInterface } from '@/domain/interfaces/repositories/category-repository.interface'

const repository = mock<CategoryRepositoryInterface>()
const fakeCategories: CategoryRepositoryData [] = [{
  id: 'anyCategoryId',
  ownerId: 'anyOwnerId',
  title: 'Any Category',
  description: 'Any Description',
  createdAt: new Date(),
  updatedAt: null
}, {
  id: 'anotherCategoryId',
  ownerId: 'anyOwnerId',
  title: 'Another Category',
  description: 'Another Description',
  createdAt: new Date(),
  updatedAt: null
}]

describe('ListCategoryUseCase', () => {
  let sut: ListCategoryUseCase
  let ownerId: string

  beforeEach(() => {
    sut = new ListCategoryUseCase(repository)
    ownerId = 'anyOwnerId'
    repository.getByOwnerId.mockResolvedValue(fakeCategories)
  })

  test('should throws if ownerId is not provided', async () => {
    const promise = sut.execute(null as any)
    await expect(promise).rejects.toThrowError(new MissingParamError('ownerId'))
  })

  test('should call OwnerRepository.getByOwnerId once and with correct ownerId', async () => {
    await sut.execute(ownerId)
    expect(repository.getByOwnerId).toHaveBeenCalledTimes(1)
    expect(repository.getByOwnerId).toHaveBeenCalledWith('anyOwnerId')
  })

  test('should return null if OwnerRepository.getByOwnerId returns null', async () => {
    repository.getByOwnerId.mockResolvedValueOnce(null)
    const output = await sut.execute(ownerId)
    expect(output).toBe(null)
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(ownerId)
    expect(output).toEqual(fakeCategories)
  })
})
