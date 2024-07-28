export interface DeleteProductUseCaseInterface {
  execute: (id: string, ownerId: string) => Promise<void>
}
