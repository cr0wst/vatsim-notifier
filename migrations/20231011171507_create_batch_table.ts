import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('batches', (table) => {
    table.uuid('id').primary();
    table.string('status').notNullable();
    table.jsonb('result').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}


export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTable('batches');
}

