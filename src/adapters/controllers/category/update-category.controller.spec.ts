import { HttpRequest } from '@/shared/types'
import { InvalidParamError } from '@/shared/errors'
import { badRequest } from '@/shared/helpers/http.helper'
import { UpdateCategoryUseCaseInterface } from '@/domain/interfaces/usecases/category/update-category-usecase.interface'
import { UpdateCategoryController } from './update-category.controller'
import { mock } from 'jest-mock-extended'

const usecase = mock<UpdateCategoryUseCaseInterface>()

describe('UpdateCategoryController', () => {
  let sut: UpdateCategoryController
  let input: HttpRequest

  beforeEach(() => {
    sut = new UpdateCategoryController(usecase)
    input = {
      body: {
        categoryId: 'anyCategoryId',
        description: 'anyDescription',
        title: 'anyTitle'
      }
    }
  })

  test('should call UpdateCategoryUsecase once and with correct values', async () => {
    await sut.execute(input)
    expect(usecase.execute).toHaveBeenCalledTimes(1)
    expect(usecase.execute).toHaveBeenCalledWith(input.body)
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)
    expect(output).toEqual({ statusCode: 201, body: null })
  })

  test('should return a correct error if UpdateOwnerUseCase throws', async () => {
    const error = new InvalidParamError('anyParam')
    usecase.execute.mockImplementationOnce(() => {
      throw error
    })

    const output = await sut.execute(input)

    expect(output).toEqual(badRequest(error))
  })
})
