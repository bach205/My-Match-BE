/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    try {
        await knex.schema.createTable("otp", (table) => {
            table.increments("id")
            table.string("phoneNumber", 20)
            table.string("code", 6)
            table.dateTime("expirationTime", { precision: 0 })
            table.timestamps(true, true)
        })
    } catch (e) {
        console.error(e)
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    try {
        await knex.schema.dropTable("otp");
    } catch (e) {
        console.error(e)
    }

};
