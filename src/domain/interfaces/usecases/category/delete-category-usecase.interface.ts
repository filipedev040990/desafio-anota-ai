export interface DeleteCategoryUseCaseInterface {
  execute: (id: string, ownerId: string) => Promise<void>
}
