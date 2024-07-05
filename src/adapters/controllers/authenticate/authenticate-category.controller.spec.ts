import { AuthenticateUseCaseInterface } from '@/domain/interfaces/usecases/authenticate/authenticate-usecase.interface'
import { AuthenticateController } from './authenticate-category.controller'
import { badRequest } from '@/shared/helpers/http.helper'
import { InvalidParamError } from '@/shared/errors'
import { HttpRequest } from '@/shared/types'
import { mock } from 'jest-mock-extended'

const usecase = mock<AuthenticateUseCaseInterface>()

describe('AuthenticateController', () => {
  let sut: AuthenticateController
  let input: HttpRequest

  beforeEach(() => {
    sut = new AuthenticateController(usecase)
    input = {
      body: {
        document: 'anyDocument',
        password: 'anyPassword'
      }
    }
    usecase.execute.mockResolvedValue({ accessToken: 'anyAccessToken' })
  })

  test('should call AuthenticateUsecase once and with correct values', async () => {
    await sut.execute(input)
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(usecase.execute).toHaveBeenCalledWith(input.body.document, input.body.password)
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)
    expect(output).toEqual({ statusCode: 200, body: { accessToken: 'anyAccessToken' } })
  })

  test('should return a correct error if AuthenticateUsecase throws', async () => {
    const error = new InvalidParamError('anyParam')
    usecase.execute.mockImplementationOnce(() => {
      throw error
    })

    const output = await sut.execute(input)

    expect(output).toEqual(badRequest(error))
  })
})
