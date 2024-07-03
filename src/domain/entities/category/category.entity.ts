import { MissingParamError } from '@/shared/errors'
import { randomUUID } from 'crypto'

export type CategoryData = {
  ownerId: string
  title: string
  description: string
}

export class CategoryEntity {
  constructor (
    public readonly id: string,
    public readonly ownerId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date | null
  ) {}

  public static build (input: CategoryData): CategoryEntity {
    this.validate(input)
    return this.create(input)
  }

  private static validate (input: CategoryData): void {
    const requiredFields: Array<keyof CategoryData> = ['ownerId', 'title', 'description']
    for (const field of requiredFields) {
      if (!input[field]) {
        throw new MissingParamError(field)
      }
    }
  }

  private static create (input: CategoryData): CategoryEntity {
    return new CategoryEntity(randomUUID(), input.ownerId, input.title, input.description, new Date(), null)
  }
}
