import { CategoryRepositoryData, CategoryRepositoryInterface } from '@/domain/interfaces/repositories/category-repository.interface'
import { prismaClient } from '../prisma-client'

export class CategoryRepository implements CategoryRepositoryInterface {
  async save (input: CategoryRepositoryData): Promise<CategoryRepositoryData> {
    return await prismaClient.category.create({
      data: {
        id: input.id,
        ownerId: input.ownerId,
        title: input.title,
        description: input.description,
        createdAt: input.createdAt,
        updatedAt: null
      }
    })
  }
}
