import { UpdateOwnerInput } from '@/domain/interfaces/usecases/owner/update-owner-usecase.interface'
import { UpdateOwnerUseCase } from './update-owner.usecase'
import { ConflictError, InvalidParamError, MissingParamError } from '@/shared/errors'
import { mock } from 'jest-mock-extended'
import { OwnerRepositoryInterface } from '@/domain/interfaces/repositories/owner-repository.interface'
import { CryptographyInterface } from '@/domain/interfaces/tools/cryptography.interface'

const ownerRepository = mock<OwnerRepositoryInterface>()
const cryptographyService = mock<CryptographyInterface>()
const fakeOwnerEntity = {
  id: 'anotherId',
  name: 'AnyName',
  document: 'anyDocument',
  password: 'hashedPassword',
  createdAt: new Date(),
  updatedAt: null
}

describe('UpdateOwnerUseCase', () => {
  let sut: UpdateOwnerUseCase
  let input: UpdateOwnerInput

  beforeEach(() => {
    sut = new UpdateOwnerUseCase(ownerRepository, cryptographyService)
    input = {
      ownerId: 'anyId',
      name: 'NewName',
      document: 'NewDocument',
      password: 'newPassword'
    }
    ownerRepository.getByDocument.mockResolvedValue(null)
    cryptographyService.encrypt.mockReturnValue('hashedPassword')
  })

  test('should throw if id is not provided', async () => {
    input.ownerId = undefined as any
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new MissingParamError('ownerId'))
  })

  test('should throw if all optional fields are empty', async () => {
    input.name = undefined as any
    input.document = undefined as any
    input.password = undefined as any
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new InvalidParamError('Enter a field to be changed'))
  })

  test('should call OwnerRepository.getByDocument once and with correct document when is provided', async () => {
    await sut.execute(input)
    expect(ownerRepository.getByDocument).toHaveBeenCalledTimes(1)
    expect(ownerRepository.getByDocument).toHaveBeenCalledWith('NewDocument')
  })

  test('should throw if document already exists', async () => {
    ownerRepository.getByDocument.mockResolvedValueOnce(fakeOwnerEntity)
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new ConflictError('document'))
  })

  test('should call cryptographyService.encrypt when password is provided', async () => {
    await sut.execute(input)
    expect(cryptographyService.encrypt).toHaveBeenCalledTimes(1)
    expect(cryptographyService.encrypt).toHaveBeenCalledWith('newPassword')
  })

  test('should make a correct input when all field are provideds', async () => {
    const inputToUpdate = sut.makeInput(input)
    expect(inputToUpdate).toEqual({
      ownerId: 'anyId',
      name: 'NewName',
      document: 'NewDocument',
      password: 'hashedPassword'
    })
  })

  test('should make a correct input without name', async () => {
    input.name = undefined as any
    const inputToUpdate = sut.makeInput(input)
    expect(inputToUpdate).toEqual({
      ownerId: 'anyId',
      document: 'NewDocument',
      password: 'hashedPassword'
    })
  })

  test('should make a correct input without document', async () => {
    input.document = undefined as any
    const inputToUpdate = sut.makeInput(input)
    expect(inputToUpdate).toEqual({
      ownerId: 'anyId',
      name: 'NewName',
      password: 'hashedPassword'
    })
  })

  test('should make a correct input without password', async () => {
    input.password = undefined as any
    const inputToUpdate = sut.makeInput(input)
    expect(inputToUpdate).toEqual({
      ownerId: 'anyId',
      name: 'NewName',
      document: 'NewDocument'
    })
  })

  test('should call OwnerRepository.update once and with correct input', async () => {
    await sut.execute(input)
    expect(ownerRepository.update).toHaveBeenCalledTimes(1)
    expect(ownerRepository.update).toHaveBeenCalledWith({
      ownerId: 'anyId',
      name: 'NewName',
      document: 'NewDocument',
      password: 'hashedPassword'
    })
  })
})
