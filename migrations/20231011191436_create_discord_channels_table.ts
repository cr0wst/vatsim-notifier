import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('discord_channel', (table) => {
    table.string('id').primary();
    table.jsonb('config').notNullable();
  });
}


export async function down(knex: Knex): Promise<void> {
}

