const scheduleService = {
    getAllData(knex,table) {
      return knex.select('*').from(table).orderBy('id')
    },
    insertData(knex, table, column) {
      return knex
        .insert(column)
        .into(table)
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    getById(knex, table, id) {
      return knex.from(table).select('*').where('id', id)//.orderBy('id').first()
    },
    getByBusinessId(knex, table, business_id) {
      return knex.from(table).select('*').where('business_id', business_id).orderBy('id','asc')
    },
    getByAny(knex, table, anyColumn, id) {
        return knex.from(table).select('*').where(anyColumn, id).first()
      },
    deleteData(knex, table, id) {
      return knex(table)
        .where({ id })
        .delete()
    },
    deleteBusinessData(knex, table, business_id) {
      return knex(table)
        .where({ business_id })
        .delete()
    },
    updateData(knex, table, id, newDataFields) {
      return knex(table)
        .where({ id })
        .update(newDataFields)
    },
  }
  
  module.exports = scheduleService;