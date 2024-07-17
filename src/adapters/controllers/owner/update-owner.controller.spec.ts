import { HttpRequest } from '@/shared/types'
import { InvalidParamError } from '@/shared/errors'
import { badRequest } from '@/shared/helpers/http.helper'
import { UpdateOwnerUseCaseInterface } from '@/domain/interfaces/usecases/owner/update-owner-usecase.interface'
import { UpdateOwnerController } from './update-owner.controller'
import { mock } from 'jest-mock-extended'

const updateOwnerUseCase = mock<UpdateOwnerUseCaseInterface>()

describe('UpdateOwnerController', () => {
  let sut: UpdateOwnerController
  let input: HttpRequest

  beforeEach(() => {
    sut = new UpdateOwnerController(updateOwnerUseCase)
    input = {
      body: {
        ownerId: 'anyId',
        name: 'NewName',
        document: 'NewDocument',
        password: 'newPassword'
      }
    }
  })

  test('should call updateOwnerUseCase once and with correct values', async () => {
    await sut.execute(input)
    expect(updateOwnerUseCase.execute).toHaveBeenCalledTimes(1)
    expect(updateOwnerUseCase.execute).toHaveBeenCalledWith({
      ownerId: 'anyId',
      name: 'NewName',
      document: 'NewDocument',
      password: 'newPassword'
    })
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)
    expect(output).toEqual({ statusCode: 204, body: null })
  })

  test('should return a correct error if updateOwnerUseCase throws', async () => {
    const error = new InvalidParamError('anyParam')
    updateOwnerUseCase.execute.mockImplementationOnce(() => {
      throw error
    })

    const output = await sut.execute(input)

    expect(output).toEqual(badRequest(error))
  })
})
