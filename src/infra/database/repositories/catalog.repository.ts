import { CatalogItemRepositoryData, CatalogRepositoryData, CatalogRepositoryInterface } from '@/domain/interfaces/repositories/catalog-repository.interface'
import { prismaClient } from '../prisma-client'

export class CatalogRepository implements CatalogRepositoryInterface {
  async save (data: CatalogRepositoryData): Promise<CatalogRepositoryData> {
    return await prismaClient.catalog.create({ data })
  }

  async saveItems (data: CatalogItemRepositoryData): Promise<void> {
    await prismaClient.catalogItem.create({ data })
  }

  async deleteItems (catalogId: string): Promise<void> {
    await prismaClient.catalogItem.deleteMany({ where: { catalogId } })
  }

  async getByOwnerIdAndCategoryId (ownerId: string, categoryId: string): Promise<CatalogRepositoryData | null> {
    return await prismaClient.catalog.findFirst({ where: { ownerId, categoryId } })
  }
}
