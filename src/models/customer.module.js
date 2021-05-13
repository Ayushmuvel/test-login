const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
const Role = require('../utils/userRoles.utils');
class UserModel {
    tableName = 'customer';

    find = async(params = {}) => {
        let sql = `SELECT * FROM ${this.tableName}`;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`;

        return await query(sql, [...values]);
    }

    findOne = async(params) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;

        const result = await query(sql, [...values]);

        // return back the first row (user)
        return result[0];
    }

    create = async({ Name, Email, Mobile, created_on, created_by, last_up_by, last_up_on, Active }) => {
        const sql = `INSERT INTO ${this.tableName}
        (Name,Email,Mobile,Created_on,Created_by,last_up_by,last_up_on,Active) VALUES (?,?,?,?,?,?,?,?)`;

        const result = await query(sql, [Name, Email, Mobile, created_on, created_by, last_up_by, last_up_on, Active]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    update = async(params, id) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE Email = ?`;

        const result = await query(sql, [...values, id]);

        return result;
    }

}

module.exports = new UserModel;