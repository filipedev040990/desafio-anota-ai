import { OwnerRepositoryInterface } from '@/domain/interfaces/repositories/owner-repository.interface'
import { InvalidParamError } from '@/shared/errors'
import { ProductRepositoryInterface } from '@/domain/interfaces/repositories/product-repository.interface'
import { mock } from 'jest-mock-extended'
import { ListAllProductsUseCase } from './list-products.usecase'
import { ListProductOutput } from '@/domain/interfaces/usecases/product/list-all-products-usecase.interface'

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
const fakeProducts: ListProductOutput [] | null = [{
  category: 'anyCategory',
  title: 'anyTitle',
  description: 'anyDescription',
  price: 1000,
  createdAt: new Date(),
  updatedAt: null
}, {
  category: 'anotherCategory',
  title: 'anotherTitle',
  description: 'anotherDescription',
  price: 1500,
  createdAt: new Date(),
  updatedAt: null
}]

describe('ListAllProductsUseCase', () => {
  let sut: ListAllProductsUseCase
  let ownerId: string

  beforeAll(() => {
    sut = new ListAllProductsUseCase(ownerRepository, productRepository)
    ownerId = 'anyOwnerId'
    ownerRepository.getById.mockResolvedValue(fakeOwner)
    productRepository.getAll.mockResolvedValue(fakeProducts)
  })

  test('should call OwnerRepository.getById once and with correct values', async () => {
    await sut.execute(ownerId)
    expect(ownerRepository.getById).toHaveBeenCalledTimes(1)
    expect(ownerRepository.getById).toHaveBeenCalledWith('anyOwnerId')
  })

  test('should throws if OwnerRepository.getById returns null', async () => {
    ownerRepository.getById.mockResolvedValueOnce(null)
    const promise = sut.execute(ownerId)
    await expect(promise).rejects.toThrowError(new InvalidParamError('ownerId'))
  })

  test('should call ProductRepository.getAll once and with correct ownerId', async () => {
    await sut.execute(ownerId)
    expect(productRepository.getAll).toHaveBeenCalledTimes(1)
    expect(productRepository.getAll).toHaveBeenCalledWith('anyOwnerId')
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(ownerId)
    expect(output).toEqual(fakeProducts)
  })

  test('should return null if ProductRepository.getAll returns null', async () => {
    productRepository.getAll.mockResolvedValueOnce(null)
    const output = await sut.execute(ownerId)
    expect(output).toEqual(null)
  })
})
