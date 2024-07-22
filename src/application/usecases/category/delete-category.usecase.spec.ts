import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { CategoryRepositoryInterface } from '@/domain/interfaces/repositories/category-repository.interface'
import { mock } from 'jest-mock-extended'
import { DeleteCategoryUseCase } from './delete-category.usecase'
import { CatalogRepository } from '@/infra/database/repositories/catalog.repository'

const categoryRepository = mock<CategoryRepositoryInterface>()
const catalogRepository = mock<CatalogRepository>()

const fakeCategory = {
  id: 'anyCategoryId',
  ownerId: 'anyOwnerId',
  title: 'anyTitle',
  description: 'anyDescription',
  createdAt: new Date(),
  updatedAt: null
}

const fakeCatalog = {
  id: 'anyId',
  ownerId: 'anyOwnerId',
  categoryId: 'anyCategoryId',
  createdAt: new Date()
}

describe('DeleteCategoryUseCase', () => {
  let sut: DeleteCategoryUseCase
  let id: string
  let ownerId: string

  beforeEach(() => {
    sut = new DeleteCategoryUseCase(categoryRepository, catalogRepository)
    id = 'anyCategoryId'
    ownerId = 'anyOwnerId'
    categoryRepository.getByIdAndOwnerId.mockResolvedValue(fakeCategory)
    catalogRepository.getByOwnerIdAndCategoryId.mockResolvedValue(null)
  })

  test('should throw if id is not provided', async () => {
    id = undefined as any
    const promise = sut.execute(id, ownerId)
    await expect(promise).rejects.toThrowError(new MissingParamError('id'))
  })

  test('should throw if ownerId is not provided', async () => {
    ownerId = undefined as any
    const promise = sut.execute(id, ownerId)
    await expect(promise).rejects.toThrowError(new MissingParamError('ownerId'))
  })

  test('should call CategoryRepository.getByIdAndOwnerId once and with correct values', async () => {
    await sut.execute(id, ownerId)
    expect(categoryRepository.getByIdAndOwnerId).toHaveBeenCalledTimes(1)
    expect(categoryRepository.getByIdAndOwnerId).toHaveBeenCalledWith(id, ownerId)
  })

  test('should throw if CategoryRepository.getByIdAndOwnerId returns null', async () => {
    categoryRepository.getByIdAndOwnerId.mockResolvedValueOnce(null)
    const promise = sut.execute(id, ownerId)
    await expect(promise).rejects.toThrowError(new InvalidParamError('id or ownerId is invalid'))
  })

  test('should call CatalogRepository.getByOwnerIdAndCategoryId once and with correct values', async () => {
    await sut.execute(id, ownerId)
    expect(catalogRepository.getByOwnerIdAndCategoryId).toHaveBeenCalledTimes(1)
    expect(catalogRepository.getByOwnerIdAndCategoryId).toHaveBeenCalledWith(ownerId, id)
  })

  test('should throw if CategoryRepository.getByIdAndOwnerId returns a catalog', async () => {
    catalogRepository.getByOwnerIdAndCategoryId.mockResolvedValueOnce(fakeCatalog)
    const promise = sut.execute(id, ownerId)
    await expect(promise).rejects.toThrowError(new InvalidParamError('This category is already in use by a catalog'))
  })

  test('should call CategoryRepository.delete once and with correct values', async () => {
    await sut.execute(id, ownerId)
    expect(categoryRepository.delete).toHaveBeenCalledTimes(1)
    expect(categoryRepository.delete).toHaveBeenCalledWith('anyCategoryId', 'anyOwnerId')
  })
})
