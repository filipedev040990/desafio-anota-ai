import { OwnerData, OwnerEntity } from '@/domain/entities/owner/owner.entitt'
import { CreateOwnerUseCase } from './create-owner.usecase'
import { OwnerRepositoryInterface } from '@/domain/interfaces/repositories/owner-repository.interface'
import { mock } from 'jest-mock-extended'

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
      document: 'AnyDocument'
    }
    jest.spyOn(OwnerEntity, 'build').mockReturnValue(fakeOwnerEntity)
    repository.save.mockResolvedValue(fakeOwnerEntity)
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
})
