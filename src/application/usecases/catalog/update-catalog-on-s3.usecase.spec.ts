import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { UpdateCatalogOnS3 } from './update-catalog-on-s3.usecase'
import { mock } from 'jest-mock-extended'
import { CatalogRepositoryInterface, FullCatalogRepositoryData } from '@/domain/interfaces/repositories/catalog-repository.interface'
import { bucketInterface } from '@/domain/interfaces/tools/bucket.interface'

const catalogRepository = mock<CatalogRepositoryInterface>()
const bucketService = mock<bucketInterface>()
const fakeFullCatalog: FullCatalogRepositoryData = {
  owner: 'AnyOwnerName',
  catalogs: [{
    categoryTitle: 'AnyCategoryTitle',
    categoryDescription: 'AnyCategoryDescription',
    items: [{
      title: 'anyItemTitle',
      description: 'anyItemDescription',
      price: 1000
    }]
  }, {
    categoryTitle: 'anotherCategoryTitle',
    categoryDescription: 'anotherCategoryDescription',
    items: [{
      title: 'anotherItemTitle',
      description: 'anotherItemDescription',
      price: 2000
    }]
  }]
}

describe('UpdateCatalogOnS3', () => {
  let sut: UpdateCatalogOnS3
  let ownerId: string

  beforeEach(() => {
    sut = new UpdateCatalogOnS3(catalogRepository, bucketService)
    ownerId = 'anyOwnerId'
    catalogRepository.getFullCatalog.mockResolvedValue(fakeFullCatalog)
  })

  test('should throw if ownerId is not provided', async () => {
    ownerId = null as any
    const promise = sut.execute(ownerId)
    await expect(promise).rejects.toThrowError(new MissingParamError('ownerId'))
  })

  test('should call repository.getFullCatalog once and with correct ownerId', async () => {
    await sut.execute(ownerId)
    expect(catalogRepository.getFullCatalog).toHaveBeenCalledTimes(1)
    expect(catalogRepository.getFullCatalog).toHaveBeenCalledWith('anyOwnerId')
  })

  test('should throws if CatalogRepository.getFullCatalog returns null', async () => {
    catalogRepository.getFullCatalog.mockResolvedValueOnce(null)
    const promise = sut.execute(ownerId)
    await expect(promise).rejects.toThrowError(new InvalidParamError('ownerId'))
  })

  test('shoud call BucketService once and with correct input', async () => {
    await sut.execute(ownerId)
    expect(bucketService.createOrUpdateObject).toHaveBeenCalledTimes(1)
    expect(bucketService.createOrUpdateObject).toHaveBeenCalledWith({
      Bucket: 'anota-ai-catalogs',
      Key: 'anyOwnerId.json',
      Body: JSON.stringify(fakeFullCatalog),
      ContentType: 'application/json'
    })
  })
})
