import { OwnerRepositoryInterface } from '@/domain/interfaces/repositories/owner-repository.interface'
import { InvalidParamError } from '@/shared/errors'
import { ProductRepositoryData, ProductRepositoryInterface } from '@/domain/interfaces/repositories/product-repository.interface'
import { DeleteProductUseCase } from './delete-product-by-id.usecase'
import { CatalogItemRepositoryData, CatalogRepositoryInterface } from '@/domain/interfaces/repositories/catalog-repository.interface'
import { mock } from 'jest-mock-extended'

const ownerRepository = mock<OwnerRepositoryInterface>()
const productRepository = mock<ProductRepositoryInterface>()
const catalogRepository = mock<CatalogRepositoryInterface>()
const fakeOwner = {
  id: 'anyOwnerId',
  name: 'AnyName',
  document: 'anyDocument',
  password: 'hashedPassword',
  createdAt: new Date(),
  updatedAt: null
}
const fakeProducts: ProductRepositoryData | null = {
  id: 'anyProductId',
  ownerId: 'anyOwnerId',
  categoryId: 'anyCategoryId',
  title: 'anyTitle',
  description: 'anyDescription',
  price: 1000,
  createdAt: new Date(),
  updatedAt: null
}
const fakeCatalogItems: CatalogItemRepositoryData [] | null = [{
  id: 'anyId',
  catalogId: 'anyCatalogId',
  productId: 'anyProductId',
  createdAt: new Date(),
  updatedAt: null
}]

describe('DeleteProductUseCase', () => {
  let sut: DeleteProductUseCase
  let productId: string
  let ownerId: string

  beforeEach(() => {
    sut = new DeleteProductUseCase(ownerRepository, productRepository, catalogRepository)
    productId = 'anyProductId'
    ownerId = 'anyOwnerId'
    ownerRepository.getById.mockResolvedValue(fakeOwner)
    productRepository.getByIdAndOwnerId.mockResolvedValue(fakeProducts)
    catalogRepository.getCatalogItemByProductId.mockResolvedValue(null)
  })

  test('should call OwnerRepository.getById once and with correct values', async () => {
    await sut.execute(productId, ownerId)
    expect(ownerRepository.getById).toHaveBeenCalledTimes(1)
    expect(ownerRepository.getById).toHaveBeenCalledWith('anyOwnerId')
  })

  test('should throws if OwnerRepository.getById returns null', async () => {
    ownerRepository.getById.mockResolvedValueOnce(null)
    const promise = sut.execute(productId, ownerId)
    await expect(promise).rejects.toThrowError(new InvalidParamError('ownerId'))
  })

  test('should call ProductRepository.getByIdAndOwnerId once and with correct ownerId', async () => {
    await sut.execute(productId, ownerId)
    expect(productRepository.getByIdAndOwnerId).toHaveBeenCalledTimes(1)
    expect(productRepository.getByIdAndOwnerId).toHaveBeenCalledWith('anyProductId', 'anyOwnerId')
  })

  test('should throws if ProductRepository.getByIdAndOwnerId returns null', async () => {
    productRepository.getByIdAndOwnerId.mockResolvedValueOnce(null)
    const promise = sut.execute(productId, ownerId)
    await expect(promise).rejects.toThrowError(new InvalidParamError('id'))
  })

  test('should call CatalogRepository.getCatalogItemByProductId once and with correct ownerId', async () => {
    await sut.execute(productId, ownerId)
    expect(catalogRepository.getCatalogItemByProductId).toHaveBeenCalledTimes(1)
    expect(catalogRepository.getCatalogItemByProductId).toHaveBeenCalledWith('anyProductId')
  })

  test('should throws if CatalogRepository.getCatalogItemByProductId is Truthy', async () => {
    catalogRepository.getCatalogItemByProductId.mockResolvedValueOnce(fakeCatalogItems)
    const promise = sut.execute(productId, ownerId)
    await expect(promise).rejects.toThrowError(new InvalidParamError('This product is associated with a catalog'))
  })

  test('should call ProductRepository.delete once and with correct ownerId', async () => {
    await sut.execute(productId, ownerId)
    expect(productRepository.delete).toHaveBeenCalledTimes(1)
    expect(productRepository.delete).toHaveBeenCalledWith('anyProductId', 'anyOwnerId')
  })
})
