import { HttpRequest } from '@/shared/types'
import { InvalidParamError } from '@/shared/errors'
import { badRequest } from '@/shared/helpers/http.helper'
import { GetCatalogByOwnerIdController } from './get-full-catalog.controller'
import { GetCatalogByOwnerIdUseCaseInterface } from '@/domain/interfaces/usecases/catalog/get-catalog-by-ownerId.usecase.interface'
import { mock } from 'jest-mock-extended'

const usecase = mock<GetCatalogByOwnerIdUseCaseInterface>()
const fakeS3Url = 'anyUrl'
describe('GetCatalogByOwnerIdController', () => {
  let sut: GetCatalogByOwnerIdController
  let input: HttpRequest

  beforeEach(() => {
    sut = new GetCatalogByOwnerIdController(usecase)
    input = {
      body: {
        ownerId: 'anyOwnerId'
      }
    }
    usecase.execute.mockResolvedValue(fakeS3Url)
  })

  test('should call CreateCatalogUseCase once and with correct values', async () => {
    await sut.execute(input)
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(usecase.execute).toHaveBeenCalledWith('anyOwnerId')
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)
    expect(output).toEqual({ statusCode: 200, body: fakeS3Url })
  })

  test('should return a correct error if CreateOwnerUseCase throws', async () => {
    const error = new InvalidParamError('anyParam')
    usecase.execute.mockImplementationOnce(() => {
      throw error
    })

    const output = await sut.execute(input)

    expect(output).toEqual(badRequest(error))
  })
})
