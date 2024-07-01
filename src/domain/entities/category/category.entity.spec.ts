import { MissingParamError } from '@/shared/errors'
import { CategoryEntity } from './category.entity'
import MockDate from 'mockdate'

jest.mock('crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('anyId')
}))

describe('CategoryEntity', () => {
  let sut: any
  let input: any

  beforeEach(() => {
    sut = CategoryEntity
    input = {
      ownerId: 'anyOwnerId',
      title: 'AnyTitle',
      description: 'anyDescription'
    }
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should if ownerId is not provided', async () => {
    input.ownerId = null
    expect(() => {
      sut.build(input)
    }).toThrowError(new MissingParamError('ownerId'))
  })

  test('should if title is not provided', async () => {
    input.title = null
    expect(() => {
      sut.build(input)
    }).toThrowError(new MissingParamError('title'))
  })

  test('should if description is not provided', async () => {
    input.description = null
    expect(() => {
      sut.build(input)
    }).toThrowError(new MissingParamError('description'))
  })

  test('should make a correct Category', async () => {
    const category = sut.build(input)
    expect(category).toEqual({
      id: 'anyId',
      ownerId: 'anyOwnerId',
      title: 'AnyTitle',
      description: 'anyDescription',
      createdAt: new Date(),
      updatedAt: undefined
    })
  })
})
