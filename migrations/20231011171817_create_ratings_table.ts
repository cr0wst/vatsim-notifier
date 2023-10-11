import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('ratings', (table) => {
    table.integer('id').primary();
    table.string('short').notNullable();
    table.string('long').notNullable();
  });
}


export async function down(knex: Knex): Promise<void> {
}

