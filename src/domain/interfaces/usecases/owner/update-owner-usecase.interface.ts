export type UpdateOwnerInput = {
  id: string
  name?: string
  document?: string
  password?: string
}

export interface UpdateOwnerUseCaseInterface {
  execute: (input: UpdateOwnerInput) => Promise<void>
}
