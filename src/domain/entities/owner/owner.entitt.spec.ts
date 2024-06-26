import { MissingParamError } from '@/shared/errors'
import { OwnerEntity } from './owner.entitt'
import MockDate from 'mockdate'

jest.mock('crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('anyId')
}))

describe('Owner Entity', () => {
  let sut: any
  let input: any

  beforeEach(() => {
    sut = OwnerEntity
    input = {
      name: 'AnyName',
      document: 'anyDocument'
    }
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should throw if owner name is not provided', () => {
    input.name = undefined
    expect(() => sut.build(input)).toThrowError(new MissingParamError('name'))
  })

  test('should throw if owner document is not provided', () => {
    input.document = undefined
    expect(() => sut.build(input)).toThrowError(new MissingParamError('document'))
  })

  test('should make a correct Ownew Entity', () => {
    const owner = sut.build(input)
    expect(owner).toEqual({
      id: 'anyId',
      name: 'AnyName',
      document: 'anyDocument',
      createdAt: new Date(),
      updatedAt: null
    })
  })
})
