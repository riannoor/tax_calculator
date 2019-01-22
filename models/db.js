const { Pool } = require('pg');



class Db{
    constructor(){
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL
          });
    }
    normalizeValue(value) {
        return JSON.stringify(value).replace('"[', '').replace(']"', '').replace(/"/g, "'");
    }

    all(table) {
        return this.pool.query(`SELECT * FROM ${table}`);
    }

    clear(table) {
        return this.pool.query(`DELETE FROM ${table}`);
    }

    create(table, key, values, callback) {
        values = Object.values(values).map((value) => this.normalizeValue(value));
        let insertValues = '';
        for(let i=0; i<values.length; i++){
           insertValues += `(${this.normalizeValue(values[i])})`;
           if(values.length>0 && i<values.length-1){
               insertValues += ',';
           }
        }

        console.log(`INSERT INTO ${table} (${key}) VALUES ${insertValues} RETURNING *`);
        return this.pool.query(`INSERT INTO ${table} (${key}) VALUES ${insertValues} RETURNING *`, (err, result) => {
            if (err) {
                console.error('Error executing query', err.stack)
                return callback(err, null);
            }
            else{
                return callback(null, result.rows);
            }
        });
    }

    getById(table, id, callback) {
        return this.pool.query(`SELECT * FROM ${table} WHERE id=${id}`, (err, result) => {
            if (err) {
                console.error('Error executing query', err.stack)
                return callback(err, null);
            }
            else{
                return callback(null, result);
            }
        });
    }

    update(table, id, params, callback) {
        if (params.id) delete params.id;
        const assigns = Object.keys(params);
        const values = assigns.map((key) => `${key}=${normalizeValue(params[key])}`).join(', '); // eslint-disable-line
        return this.pool.query(`UPDATE ${table} SET ${values} WHERE id=${id} RETURNING *`, (err, result) => {
            if (err) {
                console.error('Error executing query', err.stack)
                return callback(err, null);
            }
            else{
                return callback(null, result);
            }
        });
    }

    deleteById(table, id, callback) {
        return this.pool.query(`DELETE FROM ${table} WHERE id = ${id}` , (err, result) => {
            if (err) {
                console.error('Error executing query', err.stack)
                return callback(err, null);
            }
            else{
                console.log(result);
                return callback(null, result);
            }
        });
    }
}

module.exports = Db;