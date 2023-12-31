import log from "./log";
import { db } from "./db";
import { generateControllerBatchDifference } from "./diff";
import { loadControllerData } from "./load";
import config from "./config";
import { Client, GatewayIntentBits } from "discord.js";
import { reportControllerDifferences } from "./discord";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

async function main() {
  await db.migrate.latest();
  await client.login(config.DISCORD_BOT_TOKEN);
  // Run once on startup
  await run();

  // call run every configured interval
  await setInterval(run, config.SCRAPE_INTERVAL_MS);
}

async function run() {
  // Load Data from the API into the DB
  const currentBatchId = await loadControllerData();

  // Get previous batch ID
  const previousBatchId = await db("batches").select("id").orderBy("created_at", "desc").limit(2).then((rows) => rows[1]?.id ?? null);

  if (previousBatchId) {
    const differences = await generateControllerBatchDifference(previousBatchId, currentBatchId);

    log.debug(`${differences.added.length} controllers were added.`);
    log.debug(`${differences.removed.length} controllers were removed.`);

    await reportControllerDifferences(differences, client);

    // Now delete the previous batch since it's no longer needed.
    log.debug(`Deleting previous batch ${previousBatchId}.`);
    await db("batches").where("id", '<>', currentBatchId).delete();
    await db("controllers").where("batch", '<>', currentBatchId).delete();
  }
}

main().catch((err) => {
  log.error(err);
  process.exit(1);
});