import { CategoryData } from '@/domain/entities/category/category.entity'

export interface CreateCategoryUseCaseInterface {
  execute: (input: CategoryData) => Promise<{ id: string }>
}
