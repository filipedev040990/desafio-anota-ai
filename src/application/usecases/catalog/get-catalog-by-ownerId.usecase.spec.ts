import { mock } from 'jest-mock-extended'
import { GetCatalogByOwnerIdUseCase } from './get-catalog-by-ownerId.usecase'
import { CatalogRepositoryInterface } from '@/domain/interfaces/repositories/catalog-repository.interface'

const repository = mock<CatalogRepositoryInterface>()
const fakeS3Url = 'anyUrl'

describe('GetCatalogByOwnerIdUseCase', () => {
  let sut: GetCatalogByOwnerIdUseCase
  let ownerId: string

  beforeEach(() => {
    sut = new GetCatalogByOwnerIdUseCase(repository)
    ownerId = 'anyOwnerId'
    repository.getCatalogS3.mockResolvedValue(fakeS3Url)
  })

  test('should call repository.getCatalogS3 once and with correct ownerId', async () => {
    await sut.execute(ownerId)
    expect(repository.getCatalogS3).toHaveBeenCalledTimes(1)
    expect(repository.getCatalogS3).toHaveBeenCalledWith('anyOwnerId')
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(ownerId)
    expect(output).toEqual(fakeS3Url)
  })
})
