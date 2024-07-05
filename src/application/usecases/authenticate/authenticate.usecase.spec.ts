import { UnauthorizedError, MissingParamError } from '@/shared/errors'
import { AuthenticateUseCase } from './authenticate.usecase'
import { mock } from 'jest-mock-extended'
import { CryptographyInterface } from '@/domain/interfaces/tools/cryptography.interface'
import { OwnerRepositoryInterface } from '@/domain/interfaces/repositories/owner-repository.interface'
import { JwtInterface } from '@/domain/interfaces/tools/jwt.adapter.interface'

const ownerRepository = mock<OwnerRepositoryInterface>()
const cryptographyService = mock<CryptographyInterface>()
const jwtService = mock<JwtInterface>()
const fakeOwner = {
  id: 'anyId',
  name: 'AnyName',
  document: 'anyDocument',
  password: 'hashedPassword',
  createdAt: new Date('2024-01-01'),
  updatedAt: null
}

describe('AuthenticateUseCase', () => {
  let sut: AuthenticateUseCase
  let document: string
  let password: string

  beforeEach(() => {
    sut = new AuthenticateUseCase(ownerRepository, cryptographyService, jwtService)
    document = 'anyDocument'
    password = 'anyPassword'
    ownerRepository.getByDocument.mockResolvedValue(fakeOwner)
    cryptographyService.compare.mockResolvedValue(true)
    jwtService.sign.mockResolvedValue('anyJwtToken')
  })

  beforeAll(() => {
    jest.clearAllMocks()
  })

  test('should throws if document is not provided', async () => {
    document = undefined as any
    const promise = sut.execute(document, password)
    await expect(promise).rejects.toThrowError(new MissingParamError('document'))
  })

  test('should throws if password is not provided', async () => {
    password = undefined as any
    const promise = sut.execute(document, password)
    await expect(promise).rejects.toThrowError(new MissingParamError('password'))
  })

  test('should call ownerRepository.getByDocument once and with correct docment', async () => {
    await sut.execute(document, password)
    expect(ownerRepository.getByDocument).toHaveBeenCalledTimes(1)
    expect(ownerRepository.getByDocument).toHaveBeenCalledWith(document)
  })

  test('should throw if ownerRepository.getByDocument returns null', async () => {
    ownerRepository.getByDocument.mockResolvedValueOnce(null)
    const promise = sut.execute(document, password)
    await expect(promise).rejects.toThrowError(new UnauthorizedError())
  })

  test('should call cryptographyService.compare once and with correct values', async () => {
    await sut.execute(document, password)
    expect(cryptographyService.compare).toHaveBeenCalledTimes(1)
    expect(cryptographyService.compare).toHaveBeenCalledWith('anyPassword', 'hashedPassword')
  })

  test('should throw if cryptographyService.compare returns null', async () => {
    cryptographyService.compare.mockResolvedValueOnce(false)
    const promise = sut.execute(document, password)
    await expect(promise).rejects.toThrowError(new UnauthorizedError())
  })

  test('should call jwtService.sign once and with correct values', async () => {
    await sut.execute(document, password)
    expect(jwtService.sign).toHaveBeenCalledTimes(1)
    expect(jwtService.sign).toHaveBeenCalledWith({ id: 'anyId' })
  })

  test('should return a token on success', async () => {
    const output = await sut.execute(document, password)
    expect(output).toEqual({ accessToken: 'anyJwtToken' })
  })
})
