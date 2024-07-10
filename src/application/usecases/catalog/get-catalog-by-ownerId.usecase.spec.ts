import { mock } from 'jest-mock-extended'
import { GetCatalogByOwnerIdUseCase } from './get-catalog-by-ownerId.usecase'
import { CatalogRepositoryInterface, FullCatalogRepositoryData } from '@/domain/interfaces/repositories/catalog-repository.interface'

const repository = mock<CatalogRepositoryInterface>()
const fakeFullCatalog: FullCatalogRepositoryData = {
  owner: 'AnyOwnerName',
  catalog: [{
    categoryTitle: 'AnyCategoryTitle',
    categoryDescription: 'AnyCategoryDescription',
    items: [{
      title: 'anyItemTitle',
      description: 'anyItemDescription',
      price: 1000
    }]
  }]
}

describe('GetCatalogByOwnerIdUseCase', () => {
  let sut: GetCatalogByOwnerIdUseCase
  let ownerId: string

  beforeEach(() => {
    sut = new GetCatalogByOwnerIdUseCase(repository)
    ownerId = 'anyOwnerId'
    repository.getFullCatalog.mockResolvedValue(fakeFullCatalog)
  })

  test('should call repository.getFullCatalog once and with correct ownerId', async () => {
    await sut.execute(ownerId)
    expect(repository.getFullCatalog).toHaveBeenCalledTimes(1)
    expect(repository.getFullCatalog).toHaveBeenCalledWith('anyOwnerId')
  })

  test('should return null if repository.getFullCatalog returns null', async () => {
    repository.getFullCatalog.mockResolvedValueOnce(null)
    const output = await sut.execute(ownerId)
    expect(output).toBe(null)
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(ownerId)
    expect(output).toEqual(fakeFullCatalog)
  })
})
