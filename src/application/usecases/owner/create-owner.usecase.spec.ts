import { OwnerData, OwnerEntity } from '@/domain/entities/owner/owner.entitt'
import { CreateOwnerUseCase } from './create-owner.usecase'
import { OwnerRepositoryInterface } from '@/domain/interfaces/repositories/owner-repository.interface'
import { mock } from 'jest-mock-extended'
import { InvalidParamError } from '@/shared/errors'

const repository = mock<OwnerRepositoryInterface>()
const fakeOwnerEntity = {
  id: 'anyId',
  name: 'AnyName',
  document: 'anyDocument',
  createdAt: new Date(),
  updatedAt: null
}

describe('CreateOwnerUseCase', () => {
  let sut: CreateOwnerUseCase
  let input: OwnerData

  beforeEach(() => {
    sut = new CreateOwnerUseCase(repository)
    input = {
      name: 'AnyName',
      document: 'anyDocument'
    }
    jest.spyOn(OwnerEntity, 'build').mockReturnValue(fakeOwnerEntity)
    repository.save.mockResolvedValue(fakeOwnerEntity)
    repository.getByDocument.mockResolvedValue(null)
  })

  test('should call OwnerEntity once and with correct values', async () => {
    const spy = jest.spyOn(OwnerEntity, 'build')
    await sut.execute(input)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(input)
  })

  test('shold call OwnerRepository.save once and with correct values', async () => {
    await sut.execute(input)
    expect(repository.save).toHaveBeenCalledTimes(1)
    expect(repository.save).toHaveBeenCalledWith(fakeOwnerEntity)
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)
    expect(output).toEqual({ id: 'anyId' })
  })

  test('should call OwnerRepository.getByDocument once and with correct document', async () => {
    await sut.execute(input)
    expect(repository.getByDocument).toHaveBeenCalledTimes(1)
    expect(repository.getByDocument).toHaveBeenCalledWith('anyDocument')
  })

  test('should throw if document already exists', async () => {
    repository.getByDocument.mockResolvedValueOnce(fakeOwnerEntity)
    const promise = sut.execute(input)
    await expect(promise).rejects.toThrowError(new InvalidParamError('This document already exists'))
  })
})
