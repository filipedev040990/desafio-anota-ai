import { MissingParamError } from '@/shared/errors'
import { GetOwnerByDocumentUseCase } from './get-owner-by-document'
import { mock } from 'jest-mock-extended'
import { OwnerRepositoryInterface } from '@/domain/interfaces/repositories/owner-repository.interface'

const repository = mock<OwnerRepositoryInterface>()

describe('GetOwnerByDocumentUseCase', () => {
  let sut: GetOwnerByDocumentUseCase
  let document: string

  beforeEach(() => {
    sut = new GetOwnerByDocumentUseCase(repository)
    document = 'anyDocument'
    repository.getByDocument.mockResolvedValue({
      id: 'anyId',
      name: 'AnyName',
      document: 'anyDocument',
      createdAt: new Date('2024-01-01'),
      updatedAt: null
    })
  })

  test('should throw if document is not provided', async () => {
    document = null as any
    const promise = sut.execute(document)
    await expect(promise).rejects.toThrowError(new MissingParamError('document'))
  })

  test('should  call OwnerRepository.getByDocument once and with correct document', async () => {
    await sut.execute(document)
    expect(repository.getByDocument).toHaveBeenCalledTimes(1)
    expect(repository.getByDocument).toHaveBeenCalledWith('anyDocument')
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(document)
    expect(output).toEqual({
      id: 'anyId',
      name: 'AnyName',
      document: 'anyDocument',
      createdAt: new Date('2024-01-01'),
      updatedAt: null
    })
  })

  test('should return null if OwnerRepository.getByDocument returns null', async () => {
    repository.getByDocument.mockResolvedValueOnce(null)
    const output = await sut.execute(document)
    expect(output).toBe(null)
  })
})
