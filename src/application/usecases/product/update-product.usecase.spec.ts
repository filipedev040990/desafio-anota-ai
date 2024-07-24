import { OwnerRepositoryInterface } from '@/domain/interfaces/repositories/owner-repository.interface'
import { InvalidParamError } from '@/shared/errors'
import { CategoryRepositoryInterface } from '@/domain/interfaces/repositories/category-repository.interface'
import { ProductRepositoryInterface } from '@/domain/interfaces/repositories/product-repository.interface'
import { UpdateProductInput } from '@/domain/interfaces/usecases/product/update-product-usecase.interface'
import { UpdateProductUseCase } from './update-product.usecase'
import { mock } from 'jest-mock-extended'
import MockDate from 'mockdate'

jest.mock('@/shared/helpers/utils.helper', () => ({
  publishUpdateCatalogMessage: jest.fn()
}))

const categoryRepository = mock<CategoryRepositoryInterface>()
const ownerRepository = mock<OwnerRepositoryInterface>()
const productRepository = mock<ProductRepositoryInterface>()
const fakeOwner = {
  id: 'anyOwnerId',
  name: 'AnyName',
  document: 'anyDocument',
  password: 'hashedPassword',
  createdAt: new Date(),
  updatedAt: null
}
const fakeProductEntity = {
  id: 'anyProductId',
  categoryId: 'anyCategoryId',
  ownerId: 'anyOwnerId',
  title: 'anyTitle',
  description: 'anyDescription',
  price: 1000,
  createdAt: new Date(),
  updatedAt: null
}

const fakeCategoryEntuty = {
  id: 'anyId',
  ownerId: 'anyOwnerId',
  title: 'AnyTitle',
  description: 'anyDescription',
  createdAt: new Date(),
  updatedAt: null
}

describe('CreateProductUseCase', () => {
  let sut: UpdateProductUseCase
  let input: UpdateProductInput

  beforeEach(() => {
    sut = new UpdateProductUseCase(ownerRepository, categoryRepository, productRepository)
    input = {
      id: 'anyProductId',
      ownerId: 'anyOwnerId',
      categoryId: 'anyCategoryId',
      title: 'anyTitle',
      description: 'anyDescription',
      price: 5000
    }

    ownerRepository.getById.mockResolvedValue(fakeOwner)
    categoryRepository.getByIdAndOwnerId.mockResolvedValue(fakeCategoryEntuty)
    productRepository.getById.mockResolvedValue(fakeProductEntity)
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call OwnerRepository.getById once and with correct values', async () => {
    await sut.execute(input)
    expect(ownerRepository.getById).toHaveBeenCalledTimes(1)
    expect(ownerRepository.getById).toHaveBeenCalledWith('anyOwnerId')
  })

  test('should call CategoryRepository.getByIdAndOwnerId once and with correct values', async () => {
    await sut.execute(input)
    expect(categoryRepository.getByIdAndOwnerId).toHaveBeenCalledTimes(1)
    expect(categoryRepository.getByIdAndOwnerId).toHaveBeenCalledWith('anyCategoryId', 'anyOwnerId')
  })

  test('should throws if OwnerRepository.getById returns null', async () => {
    ownerRepository.getById.mockResolvedValueOnce(null)
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new InvalidParamError('ownerId'))
  })

  test('should throws if categoryRepository.getByIdAndOwnerId returns null', async () => {
    categoryRepository.getByIdAndOwnerId.mockResolvedValueOnce(null)
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new InvalidParamError('categoryId'))
  })

  test('should call productRepository.getById once and with correct values', async () => {
    await sut.execute(input)
    expect(productRepository.getById).toHaveBeenCalledTimes(1)
    expect(productRepository.getById).toHaveBeenCalledWith('anyProductId')
  })

  test('should call productRepository.update once and with correct values', async () => {
    await sut.execute(input)
    expect(productRepository.update).toHaveBeenCalledTimes(1)
    expect(productRepository.update).toHaveBeenCalledWith({
      id: 'anyProductId',
      ownerId: 'anyOwnerId',
      categoryId: 'anyCategoryId',
      title: 'anyTitle',
      description: 'anyDescription',
      price: 5000,
      updatedAt: new Date()
    })
  })

  describe('checkProductAlreadyExists', () => {
    test('should return false if productRepository.getByAllFields returns null', async () => {
      const output = await sut.checkProductAlreadyExists(input, fakeProductEntity)
      expect(output).toBe(false)
    })

    test('should return true', async () => {
      input = {
        id: 'anyProductId',
        ownerId: 'anyOwnerId',
        categoryId: 'anyCategoryId',
        title: 'anyTitle',
        description: 'anyDescription',
        price: 5000
      }

      const oldProdutct = {
        id: 'anyProductId',
        categoryId: 'anyCategoryId',
        ownerId: 'anyOwnerId',
        title: 'anyTitle',
        description: 'anyDescription',
        price: 5000,
        createdAt: new Date(),
        updatedAt: null
      }
      const output = await sut.checkProductAlreadyExists(input, oldProdutct)
      expect(output).toBe(true)
    })
  })
})
