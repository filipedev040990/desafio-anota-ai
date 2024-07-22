import { CategoryRepositoryData, CategoryRepositoryInterface } from '@/domain/interfaces/repositories/category-repository.interface'
import { prismaClient } from '../prisma-client'
import { UpdateCategoryUseCaseInput } from '@/domain/interfaces/usecases/category/update-category-usecase.interface'

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

  async getById (id: string): Promise<CategoryRepositoryData | null> {
    return await prismaClient.category.findFirst({ where: { id } })
  }

  async getByIdAndOwnerId (categoryId: string, ownerId: string): Promise<CategoryRepositoryData | null> {
    return await prismaClient.category.findFirst({ where: { id: categoryId, ownerId } })
  }

  async getByOwnerId (ownerId: string): Promise<CategoryRepositoryData[] | null> {
    const categories = await prismaClient.category.findMany({ where: { ownerId } })
    return categories.length ? categories : null
  }

  async update (input: UpdateCategoryUseCaseInput): Promise<void> {
    const { id, description, title } = input
    const data: { description?: string, title?: string} = {}

    if (description) {
      data.description = description
    }

    if (title) {
      data.title = title
    }

    await prismaClient.category.update({
      where: {
        id
      },
      data
    })
  }

  async delete (id: string, ownerId: string): Promise<void> {
    await prismaClient.category.delete({ where: { id, ownerId } })
  }
}
