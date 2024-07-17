import { MissingParamError } from '@/shared/errors'
import { randomUUID } from 'crypto'

export type OwnerData = {
  name: string
  document: string
  password: string
}

export class OwnerEntity {
  constructor (
    public id: string,
    public name: string,
    public document: string,
    public password: string,
    public createdAt: Date,
    public updatedAt: Date | null
  ) {}

  public static build (input: OwnerData): OwnerEntity {
    this.validate(input)
    return this.create(input)
  }

  private static validate (input: OwnerData): void {
    const requiredFields: Array<keyof OwnerData> = ['name', 'document', 'password']
    for (const field of requiredFields) {
      if (!input[field]) {
        throw new MissingParamError(field)
      }
    }
  }

  private static create (input: OwnerData): OwnerEntity {
    return new OwnerEntity(randomUUID(), input.name, input.document, input.password, new Date(), null)
  }
}
