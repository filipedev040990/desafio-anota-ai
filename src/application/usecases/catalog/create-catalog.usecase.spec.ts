import { CatalogData, CatalogEntity } from '@/domain/entities/catalog/catalog.entity'
import { CreateCatalogUseCase } from './create-catalog.usecase'
import { CategoryRepositoryInterface } from '@/domain/interfaces/repositories/category-repository.interface'
import { OwnerRepositoryInterface } from '@/domain/interfaces/repositories/owner-repository.interface'
import { ProductRepositoryInterface } from '@/domain/interfaces/repositories/product-repository.interface'
import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { CatalogRepositoryInterface } from '@/domain/interfaces/repositories/catalog-repository.interface'
import { QueueInterface } from '@/domain/interfaces/queue/queue.interface'
import * as queueHelper from '@/shared/helpers/queue.helper'
import { mock } from 'jest-mock-extended'

const ownerRepository = mock<OwnerRepositoryInterface>()
const categoryRepository = mock<CategoryRepositoryInterface>()
const productRepository = mock<ProductRepositoryInterface>()
const catalogRepository = mock<CatalogRepositoryInterface>()
const queueService = mock<QueueInterface>()
const fakeOwner = {
  id: 'anyOwnerId',
  name: 'AnyName',
  document: 'anyDocument',
  password: 'hashedPassword',
  createdAt: new Date(),
  updatedAt: null
}
const fakeCategory = {
  id: 'anyCategoryId',
  ownerId: 'anyOwnerId',
  title: 'AnyTitle',
  description: 'anyDescription',
  createdAt: new Date(),
  updatedAt: null
}
const fakeProducts = [{
  id: 'Product 1',
  categoryId: 'anyCategoryId',
  ownerId: 'anyOwnerId',
  title: 'Product 1 title',
  description: 'Product 1 Description',
  price: 1000,
  createdAt: new Date(),
  updatedAt: null
}, {
  id: 'Product 2',
  categoryId: 'anyCategoryId',
  ownerId: 'anyOwnerId',
  title: 'Product 2 title',
  description: 'Product 2 Description',
  price: 2000,
  createdAt: new Date(),
  updatedAt: null
}]
const fakeCatalogEntity = {
  id: 'anyCatalogId',
  ownerId: 'anyOwnerId',
  categoryId: 'anyCategoryId',
  items: ['Product 1', 'Product 2'],
  createdAt: new Date(),
  updatedAt: null
}

describe('CreateCatalogUseCase', () => {
  let sut: CreateCatalogUseCase
  let input: CatalogData

  beforeEach(() => {
    sut = new CreateCatalogUseCase(ownerRepository, categoryRepository, productRepository, catalogRepository, queueService)
    input = {
      ownerId: 'anyOwnerId',
      categoryId: 'anyCategoryId',
      items: ['Product 1', 'Product 2']
    }
    ownerRepository.getById.mockResolvedValue(fakeOwner)
    categoryRepository.getByIdAndOwnerId.mockResolvedValue(fakeCategory)
    productRepository.getByIdAndCategoryId.mockResolvedValue(input.items[0] ? fakeProducts[0] : fakeProducts[1])
    queueService.sendMessage.mockResolvedValue(true)

    jest.spyOn(queueHelper, 'queueDeduplicationIdGenerate').mockReturnValue('anyDeduplicationId')
    jest.spyOn(CatalogEntity, 'build').mockReturnValue(fakeCatalogEntity)
  })

  test('should call OwnerRepository.getById once and with correct ownerId', async () => {
    await sut.execute(input)
    expect(ownerRepository.getById).toHaveBeenCalledTimes(1)
    expect(ownerRepository.getById).toHaveBeenCalledWith('anyOwnerId')
  })

  test('should throws if OwnerRepository.getById returns null', async () => {
    ownerRepository.getById.mockResolvedValueOnce(null)
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new InvalidParamError('ownerId'))
  })

  test('should call categoryRepository.getByIdAndOwnerId once and with correct ownerId', async () => {
    await sut.execute(input)
    expect(categoryRepository.getByIdAndOwnerId).toHaveBeenCalledTimes(1)
    expect(categoryRepository.getByIdAndOwnerId).toHaveBeenCalledWith('anyCategoryId', 'anyOwnerId')
  })

  test('should throw if any required field is not provided', async () => {
    const requiredFields: Array<keyof CatalogData> = ['ownerId', 'categoryId']

    for (const field of requiredFields) {
      input[field] = undefined as any

      const promise = sut.execute(input)
      await expect(promise).rejects.toThrowError(new MissingParamError(field))

      input[field] = field as any
    }
  })

  test('should throws if categoryRepository.getByIdAndOwnerId returns null', async () => {
    categoryRepository.getByIdAndOwnerId.mockResolvedValueOnce(null)
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new InvalidParamError('categoryId'))
  })

  test('should call productRepository.getByIdAndCategoryId once and with correct ownerId', async () => {
    await sut.execute(input)
    expect(productRepository.getByIdAndCategoryId).toHaveBeenCalledTimes(2)

    if (input.items[0]) {
      expect(productRepository.getByIdAndCategoryId).toHaveBeenCalledWith('Product 1', 'anyCategoryId')
    }

    if (input.items[1]) {
      expect(productRepository.getByIdAndCategoryId).toHaveBeenCalledWith('Product 2', 'anyCategoryId')
    }
  })

  test('should throw if productRepository.getByIdAndCategoryId returns null', async () => {
    if (input.items[0]) {
      productRepository.getByIdAndCategoryId.mockResolvedValueOnce(null)
    }

    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new InvalidParamError('productId: Product 1'))
  })

  test('should call Catalog once and with correct values', async () => {
    jest.spyOn(sut, 'handleProducts').mockResolvedValue(fakeProducts)
    const spy = jest.spyOn(CatalogEntity, 'build')
    await sut.execute(input)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(input)
  })

  test('should call catalogRepository.getByOwnerIdAndCategoryId once and with correct ownerId', async () => {
    await sut.execute(input)
    expect(catalogRepository.getByOwnerIdAndCategoryId).toHaveBeenCalledTimes(1)
    expect(catalogRepository.getByOwnerIdAndCategoryId).toHaveBeenCalledWith('anyOwnerId', 'anyCategoryId')
  })

  test('should call catalogRepository.save once and with correct ownerId', async () => {
    await sut.execute(input)
    expect(catalogRepository.save).toHaveBeenCalledTimes(1)
    expect(catalogRepository.save).toHaveBeenCalledWith(fakeCatalogEntity)
  })

  test('should call catalogRepository.saveItems once and with correct ownerId', async () => {
    await sut.execute(input)
    expect(catalogRepository.saveItems).toHaveBeenCalledTimes(2)
  })

  test('should return a correct output on success', async () => {
    const output = await sut.execute(input)
    expect(output).toEqual({ id: 'anyCatalogId', bucketUrl: 'https://anota-ai-catalogs.s3.undefined.amazonaws.com/anyOwnerId.json' })
  })

  test('should call queueService.sendMessage once and with correct ownerId', async () => {
    await sut.execute(input)
    expect(queueService.sendMessage).toHaveBeenCalledTimes(1)
    expect(queueService.sendMessage).toHaveBeenCalledWith('emit_catalog.fifo', '{"ownerId":"anyOwnerId"}', 'emit_catalog', 'anyDeduplicationId')
  })
})
