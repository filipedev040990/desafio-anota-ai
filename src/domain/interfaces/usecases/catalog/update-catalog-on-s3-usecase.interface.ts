export interface UpdateCatalogOnS3Interface {
  execute: (ownerId: string) => Promise<void>
}
