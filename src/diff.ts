import { Controller, db } from "./db";
import log from "./log";

export async function generateControllerBatchDifference(previousBatchId: string, currentBatchId: string) {
  log.debug(`Generating controller batch difference between ${previousBatchId} and ${currentBatchId}.`);
  const controllers = await db("controllers").select("*").whereIn("batch", [previousBatchId, currentBatchId]);
  const previousBatch = controllers.filter((controller) => controller.batch === previousBatchId);
  const currentBatch = controllers.filter((controller) => controller.batch === currentBatchId);

  return {
    added: calculateAdded(previousBatch, currentBatch),
    removed: calculateRemoved(previousBatch, currentBatch)
  }
}

function calculateRemoved(previousBatch: Controller[], currentBatch: Controller[]) {
  const removed = previousBatch.filter((controller) => !currentBatch.find((c) => c.cid === controller.cid));

  return removed;
}

function calculateAdded(previousBatch: Controller[], currentBatch: Controller[]) {
  const added = currentBatch.filter((controller) => !previousBatch.find((c) => c.cid === controller.cid));

  return added;
}