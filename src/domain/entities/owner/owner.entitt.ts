import { MissingParamError } from '@/shared/errors'
import { randomUUID } from 'crypto'

export type OrderData = {
  name: string
  document: string
}

export class OwnerEntity {
  constructor (
    public readonly id: string,
    public readonly name: string,
    public readonly document: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date | null
  ) {}

  public static build (input: OrderData): OwnerEntity {
    return this.create(input)
  }

  private static create (input: OrderData): OwnerEntity {
    this.validate(input)
    return new OwnerEntity(randomUUID(), input.name, input.document, new Date(), null)
  }

  private static validate (input: OrderData): void {
    if (!input?.name) {
      throw new MissingParamError('name')
    }

    if (!input?.document) {
      throw new MissingParamError('document')
    }
  }
}
