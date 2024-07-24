export type UpdateCategoryUseCaseInput = {
  id: string
  ownerId: string
  title?: string
  description?: string
}

export interface UpdateCategoryUseCaseInterface {
  execute: (input: UpdateCategoryUseCaseInput) => Promise<void>
}
