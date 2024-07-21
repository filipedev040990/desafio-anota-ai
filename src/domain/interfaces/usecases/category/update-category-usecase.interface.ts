export type UpdateCategoryUseCaseInput = {
  categoryId: string
  title?: string
  description?: string
}

export interface UpdateCategoryUseCaseInterface {
  execute: (input: UpdateCategoryUseCaseInput) => Promise<void>
}
