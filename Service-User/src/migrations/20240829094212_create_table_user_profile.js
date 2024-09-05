/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    try {
        await knex.schema.createTable("user_profile", table => {
            table.bigIncrements("id")
            table.string("phoneNumber", 20).unique()
            table.string("name", 20)
            table.date("birth")
            table.string("gender", 8)
            table.string("mbti", 4)
            table.string("academic", 20)
            table.string("style", 16)
            table.string("targetGender", 8)
            table.string("targetRelation", 6)
            table.timestamps(true, true)
        })
    } catch (e) {
        console.error(e);
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    try {
        await knex.schema.dropTable("user_profile")
    } catch (e) {
        console.error(e)
    }
};
