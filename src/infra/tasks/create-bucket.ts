import { logger } from '@/shared/helpers/logger.helper'
import { AwsSqsAdapter } from '../queue/aws/sqs.adapter'

export const createAwsBucket = async (): Promise<void> => {
  try {
    const sqs = new AwsSqsAdapter()
    await sqs.createPublicBucket('anota-ai-catalogs')
  } catch (error: any) {
    logger.error('Error creating aws bucket', { error })
    throw error
  }
}
