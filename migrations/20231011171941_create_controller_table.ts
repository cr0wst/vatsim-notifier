import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('controllers', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('batch').notNullable();
    table.integer('cid').notNullable();
    table.string('name').notNullable();
    table.integer('facility').notNullable();
    table.integer('rating').notNullable();
    table.string('callsign').notNullable();
    table.string('frequency').notNullable();
    table.string('server').notNullable();
    table.integer('visual_range').notNullable();
    table.specificType('text_atis', 'text[]').nullable();
    table.timestamp('logon_time').notNullable();
    table.timestamp('last_updated').notNullable();
  });
}


export async function down(knex: Knex): Promise<void> {
}

