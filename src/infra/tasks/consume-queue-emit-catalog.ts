import { UpdateCatalogOnS3 } from '@/application/usecases/catalog/update-catalog-on-s3.usecase'
import { CatalogRepository } from '../database/repositories/catalog.repository'
import { AwsS3Adapter } from '../bucket/aws/s3.adapter'
import { logger } from '@/shared/helpers/logger.helper'
import { AwsSqsAdapter } from '../queue/aws/sqs.adapter'
import constants from '@/shared/constants'

export const consumeQueueEmitCatalog = async (message: any): Promise<void> => {
  const catalogRepository = new CatalogRepository()
  const bucket = new AwsS3Adapter()
  const usecase = new UpdateCatalogOnS3(catalogRepository, bucket)

  const sqs = new AwsSqsAdapter()

  const messages = await sqs.receiveMessage(constants.QUEUE_EMIT_CATALOG, 1, 5)

  if (!messages || messages.length === 0) {
    return
  }

  for (const message of messages) {
    const { ownerId } = JSON.parse(message.Body)

    if (!ownerId) {
      continue
    }

    try {
      await usecase.execute(ownerId)
      await sqs.deleteMessage(constants.QUEUE_EMIT_CATALOG, message.ReceiptHandle, message.MessageId)
    } catch (error) {
      logger.error(error)
    }
  }
}
