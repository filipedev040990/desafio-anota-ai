import { CreateProductUseCase } from './create-product.usecase'
import { OwnerRepositoryInterface } from '@/domain/interfaces/repositories/owner-repository.interface'
import { InvalidParamError } from '@/shared/errors'
import { CategoryRepositoryInterface } from '@/domain/interfaces/repositories/category-repository.interface'
import { ProductRepositoryInterface } from '@/domain/interfaces/repositories/product-repository.interface'
import { ProductEntity } from '@/domain/entities/product/product.entity'
import { mock } from 'jest-mock-extended'
import { CreateProductInput } from '@/domain/interfaces/usecases/product/create-product-usecase.interface'

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
  id: 'anyId',
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
  let sut: CreateProductUseCase
  let input: CreateProductInput

  beforeAll(() => {
    sut = new CreateProductUseCase(ownerRepository, categoryRepository, productRepository)
    input = {
      ownerId: 'anyOwnerId',
      products: [{
        categoryId: 'anyCategoryId',
        items: [{
          title: 'anyTitle',
          description: 'anyDescription',
          price: 5000
        }]
      }]
    }
    ownerRepository.getById.mockResolvedValue(fakeOwner)
    categoryRepository.getByIdAndOwnerId.mockResolvedValue(fakeCategoryEntuty)
    jest.spyOn(ProductEntity, 'build').mockReturnValue(fakeProductEntity)
  })

  test('should call Category once and with correct values', async () => {
    const spy = jest.spyOn(ProductEntity, 'build')
    await sut.execute(input)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({
      ownerId: 'anyOwnerId',
      categoryId: 'anyCategoryId',
      title: 'anyTitle',
      description: 'anyDescription',
      price: 5000

    })
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

  test('should call productRepository.save once and with correct values', async () => {
    await sut.execute(input)
    expect(productRepository.save).toHaveBeenCalledTimes(1)
    expect(productRepository.save).toHaveBeenCalledWith(fakeProductEntity)
  })

  test('should call productRepository.getByAllFields with correct values', async () => {
    await sut.execute(input)
    expect(productRepository.getByAllFields).toHaveBeenCalledWith('anyCategoryId', 'anyOwnerId', 'anyTitle', 'anyDescription', 1000)
  })

  describe('checkProductAlreadyExists', () => {
    test('should return false if productRepository.getByAllFields returns null', async () => {
      productRepository.getByAllFields.mockResolvedValueOnce(null)
      const output = await sut.checkProductAlreadyExists(fakeProductEntity)
      expect(output).toBe(false)
    })

    test('should return true', async () => {
      productRepository.getByAllFields.mockResolvedValueOnce(fakeProductEntity)
      const output = await sut.checkProductAlreadyExists(fakeProductEntity)
      expect(output).toBe(true)
    })
  })
})
