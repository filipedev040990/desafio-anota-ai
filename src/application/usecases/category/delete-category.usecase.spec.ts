import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { CategoryRepositoryInterface } from '@/domain/interfaces/repositories/category-repository.interface'
import { DeleteCategoryUseCase } from './delete-category.usecase'
import { CatalogRepository } from '@/infra/database/repositories/catalog.repository'
import { ProductRepositoryInterface } from '@/domain/interfaces/repositories/product-repository.interface'
import { mock } from 'jest-mock-extended'

const categoryRepository = mock<CategoryRepositoryInterface>()
const catalogRepository = mock<CatalogRepository>()
const productRepository = mock<ProductRepositoryInterface>()

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

const fakeProduct = [{
  id: 'anyProductId',
  categoryId: 'anyCategoryId',
  ownerId: 'anyOwnerId',
  title: 'anyTitle',
  description: 'anyDescription',
  price: 1500,
  createdAt: new Date(),
  updatedAt: null
}]

describe('DeleteCategoryUseCase', () => {
  let sut: DeleteCategoryUseCase
  let id: string
  let ownerId: string

  beforeEach(() => {
    sut = new DeleteCategoryUseCase(categoryRepository, catalogRepository, productRepository)
    id = 'anyCategoryId'
    ownerId = 'anyOwnerId'
    categoryRepository.getByIdAndOwnerId.mockResolvedValue(fakeCategory)
    catalogRepository.getByOwnerIdAndCategoryId.mockResolvedValue(null)
    productRepository.getByCategoryId.mockResolvedValue(null)
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
    await expect(promise).rejects.toThrowError(new InvalidParamError('id'))
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

  test('should call ProductRepository.getByCategoryId once and with correct values', async () => {
    await sut.execute(id, ownerId)
    expect(productRepository.getByCategoryId).toHaveBeenCalledTimes(1)
    expect(productRepository.getByCategoryId).toHaveBeenCalledWith(id)
  })

  test('should throw if ProductRepository.getByCategoryId returns a product', async () => {
    productRepository.getByCategoryId.mockResolvedValueOnce(fakeProduct)
    const promise = sut.execute(id, ownerId)
    await expect(promise).rejects.toThrowError(new InvalidParamError('This category is already in use by a product'))
  })

  test('should call CategoryRepository.delete once and with correct values', async () => {
    await sut.execute(id, ownerId)
    expect(categoryRepository.delete).toHaveBeenCalledTimes(1)
    expect(categoryRepository.delete).toHaveBeenCalledWith('anyCategoryId', 'anyOwnerId')
  })
})
