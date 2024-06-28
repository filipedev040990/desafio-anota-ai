import { CreateOwnerUseCaseInterface } from '@/domain/interfaces/usecases/owner/create-owner-usecase.interface'
import { HttpRequest } from '@/shared/types'
import { mock } from 'jest-mock-extended'
import { CreateOwnerController } from './create-owner.controller'
import { InvalidParamError } from '@/shared/errors'
import { badRequest } from '@/shared/helpers/http.helper'

const createOwnerUseCase = mock<CreateOwnerUseCaseInterface>()

describe('CreateOwnerController', () => {
  let sut: CreateOwnerController
  let input: HttpRequest

  beforeEach(() => {
    sut = new CreateOwnerController(createOwnerUseCase)
    input = {
      body: {
        name: 'AnyName',
        document: 'AnyDocument'
      }
    }
    createOwnerUseCase.execute.mockResolvedValue({ id: 'anyId' })
  })

  test('should call CreateOwnerUseCase once and with correct values', async () => {
    await sut.execute(input)
    expect(createOwnerUseCase.execute).toHaveBeenCalledTimes(1)
    expect(createOwnerUseCase.execute).toHaveBeenCalledWith({
      name: 'AnyName',
      document: 'AnyDocument'
    })
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)
    expect(output).toEqual({ statusCode: 201, body: { id: 'anyId' } })
  })

  test('should return a correct error if CreateOwnerUseCase throws', async () => {
    const error = new InvalidParamError('anyParam')
    createOwnerUseCase.execute.mockImplementationOnce(() => {
      throw error
    })

    const output = await sut.execute(input)

    expect(output).toEqual(badRequest(error))
  })
})
