import { MissingParamError } from '@/shared/errors'
import { ProductEntity } from './product.entity'
import MockDate from 'mockdate'

jest.mock('crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('anyId')
}))

describe('ProductEntity', () => {
  let sut: any
  let input: any

  beforeEach(() => {
    sut = ProductEntity
    input = {
      categoryId: 'anyCategoryId',
      ownerId: 'anyOwnerId',
      title: 'anyTitle',
      description: 'anyDescription',
      price: 1000
    }
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should if any required field is not provided', async () => {
    const requiredFields = ['categoryId', 'ownerId', 'title', 'description', 'price']
    for (const field of requiredFields) {
      input[field] = null

      expect(() => {
        sut.build(input)
      }).toThrowError(new MissingParamError(field))

      input[field] = field
    }
  })

  test('should make a correct Product', async () => {
    const product = sut.build(input)
    expect(product).toEqual({
      id: 'anyId',
      categoryId: 'anyCategoryId',
      ownerId: 'anyOwnerId',
      title: 'anyTitle',
      description: 'anyDescription',
      price: 1000,
      createdAt: new Date(),
      updatedAt: null
    })
  })
})
