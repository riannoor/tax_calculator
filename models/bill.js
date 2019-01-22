const Db = require('./db');

class Bill extends Db{
    constructor () {
        super();
        this.tableName = 'bills';
        this.itemTableName = 'items';
        this.taxCodeTableName = 'master_tax_codes';
    }
    
    create(key, values, callback){
        return this.pool.query(`INSERT INTO ${this.tableName} DEFAULT VALUES RETURNING *`, (err, result) => {
            if (err) {
                console.error('Error executing query', err.stack)
                return callback(err, null);
            }
            else{
                key += ', bill_id'
                values.forEach(value => {
                    value.push(result.rows[0].id);
                });
                return super.create(this.itemTableName, key, values, (err, result) => {
                    if(result){
                        return this.getById(result[0].bill_id, callback);
                    }
                });
            }
        });
    }

    update(billId, key, values, callback){
        return this.pool.query(`DELETE FROM ${this.itemTableName} WHERE bill_id = ${billId}`, (err, result) => {
            if (err) {
                console.error('Error executing query', err.stack)
                return callback(err, null);
            }
            else if(result.rows.length == 0 ){
                console.error('items not found')
                return callback(null, []);
            }
            else{
                key += ', bill_id'
                values.forEach(value => {
                    value.push(billId);
                });
                return super.create(this.itemTableName, key, values, callback);
            }
        });
    }

    getById(billId, callback){
        return this.pool.query(`SELECT ${this.itemTableName}.*, ${this.taxCodeTableName}.name AS type FROM ${this.itemTableName} INNER JOIN ${this.taxCodeTableName} ON ${this.itemTableName}.tax_code_id = ${this.taxCodeTableName}.id WHERE bill_id = ${billId}`, (err, result) => {
            if (err) {
                console.error('Error executing query', err.stack)
                return callback(err, null);
            }
            else{
                return callback(null, result.rows);
            }
        });
    }

    deleteById(billId, callback){
        return this.pool.query(`DELETE FROM ${this.itemTableName} WHERE bill_id = ${billId}`, (err, result) => {
            if (err) {
                console.error('Error executing query', err.stack)
                return callback(err, null);
            }
            else{
                return super.deleteById(this.tableName, billId, callback);
            }
        });
    }
}

module.exports = new Bill();