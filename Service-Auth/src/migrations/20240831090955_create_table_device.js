/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    try {
        await knex.schema.createTable("device", (table) => {
            table.increments("id")
            table.string("fingerPrint", 50)
            table.tinyint("timesFalse", { precision: 0 })
            table.dateTime("banTime", { precision: 0 })
            table.timestamps(true, true)
        })
    } catch (error) {
        console.error(e)
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    try {
        await knex.schema.dropTable("device")
    } catch (error) {
        console.error(error)
    }
};
