import { HttpRequest } from '@/shared/types'
import { InvalidParamError } from '@/shared/errors'
import { badRequest } from '@/shared/helpers/http.helper'
import { DeleteCategoryUseCaseInterface } from '@/domain/interfaces/usecases/category/delete-category-usecase.interface'
import { DeleteCategoryController } from './delete-category.controller'
import { mock } from 'jest-mock-extended'

const usecase = mock<DeleteCategoryUseCaseInterface>()

describe('DeleteCategoryController', () => {
  let sut: DeleteCategoryController
  let input: HttpRequest

  beforeEach(() => {
    sut = new DeleteCategoryController(usecase)
    input = {
      body: {
        ownerId: 'anyId'
      },
      params: {
        id: 'anyId'
      }
    }
  })

  test('should call DeleteCategoryUsecase once and with correct values', async () => {
    await sut.execute(input)
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(usecase.execute).toHaveBeenCalledWith(input.params.id, input.body.ownerId)
  })

  test('should return a correct error if DeleteOwnerUseCase throws', async () => {
    const error = new InvalidParamError('anyParam')
    usecase.execute.mockImplementationOnce(() => {
      throw error
    })

    const output = await sut.execute(input)

    expect(output).toEqual(badRequest(error))
  })
})
