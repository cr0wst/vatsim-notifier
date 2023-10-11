import { randomUUID } from "crypto";
import log from "./log";
import { fetchData } from "./VatsimClient";
import { db } from "./db";

export async function loadControllerData(): Promise<string> {
  const batchId = randomUUID();
  log.info(`Starting Batch ${batchId}}`);
  const data = await fetchData();
  await db("batches").insert({
    id: batchId,
    status: "SUCCESS",
    result: data
  });

  if (data.facilities) {
    log.debug("Updating the facilities table.");
    await db("facilities").insert(data.facilities).onConflict("id").merge();
  }

  if (data.ratings) {
    log.debug("Updating the ratings table.");
    await db("ratings").insert(data.ratings).onConflict("id").merge();
  }


  if (data.controllers) {
    log.debug("Updating the controllers table.");
    const filteredControllers = data.controllers.filter((controller) => {
      // Ignore the 199.998 frequency since it's hidden
      return controller.frequency !== "199.998";
    });

    await db("controllers").insert(
      filteredControllers.map((controller) => {
        return {
          ...controller,
          batch: batchId
        };
      })
    );
  }

  return batchId;
}