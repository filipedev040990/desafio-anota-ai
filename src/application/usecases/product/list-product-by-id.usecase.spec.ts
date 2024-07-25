import { OwnerRepositoryInterface } from '@/domain/interfaces/repositories/owner-repository.interface'
import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { ProductRepositoryData, ProductRepositoryInterface } from '@/domain/interfaces/repositories/product-repository.interface'
import { ListProductByIdUseCase } from './list-product-by-id.usecase'
import { mock } from 'jest-mock-extended'

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
const fakeProduct: ProductRepositoryData | null = {
  id: 'anyId',
  ownerId: 'anyOwnerId',
  categoryId: 'anyCategoryId',
  title: 'anyTitle',
  description: 'anyDescription',
  price: 1000,
  createdAt: new Date(),
  updatedAt: null
}

describe('ListProductByIdUseCase', () => {
  let sut: ListProductByIdUseCase
  let ownerId: string
  let productId: string

  beforeEach(() => {
    sut = new ListProductByIdUseCase(ownerRepository, productRepository)
    ownerId = 'anyOwnerId'
    productId = 'anyProductId'
    ownerRepository.getById.mockResolvedValue(fakeOwner)
    productRepository.getByIdAndOwnerId.mockResolvedValue(fakeProduct)
  })

  test('should call OwnerRepository.getById once and with correct values', async () => {
    await sut.execute(ownerId, productId)
    expect(ownerRepository.getById).toHaveBeenCalledTimes(1)
    expect(ownerRepository.getById).toHaveBeenCalledWith('anyOwnerId')
  })

  test('should throws if OwnerRepository.getById returns null', async () => {
    ownerRepository.getById.mockResolvedValueOnce(null)
    const promise = sut.execute(ownerId, productId)
    await expect(promise).rejects.toThrowError(new InvalidParamError('ownerId'))
  })

  test('should throws if productId is not provided', async () => {
    productId = undefined as any
    const promise = sut.execute(ownerId, productId)
    await expect(promise).rejects.toThrowError(new MissingParamError('productId'))
  })

  test('should throws if ownerId is not provided', async () => {
    ownerId = undefined as any
    const promise = sut.execute(ownerId, productId)
    await expect(promise).rejects.toThrowError(new MissingParamError('ownerId'))
  })

  test('should call ProductRepository.getByIdAndOwnerId once and with correct values', async () => {
    await sut.execute(ownerId, productId)
    expect(productRepository.getByIdAndOwnerId).toHaveBeenCalledTimes(1)
    expect(productRepository.getByIdAndOwnerId).toHaveBeenCalledWith('anyProductId', 'anyOwnerId')
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(ownerId, productId)
    expect(output).toEqual(fakeProduct)
  })

  test('should return null if ProductRepository.getByIdAndOwnerId returns null', async () => {
    productRepository.getByIdAndOwnerId.mockResolvedValueOnce(null)
    const output = await sut.execute(ownerId, productId)
    expect(output).toEqual(null)
  })
})
