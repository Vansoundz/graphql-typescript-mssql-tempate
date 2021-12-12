import pool from "./config"
import sql, { ConnectionPool } from 'mssql'
import { get, isBoolean, isEmpty, isInteger, isNumber, isString } from 'lodash'

type Obj = {
    [key: string]: any
}

class Db {
    pool: Promise<ConnectionPool> = pool;
    constructor() { }

    createTvp(dataArray: any[]) {
        const tvp = new sql.Table();
        const firstArrayValue = dataArray[0];
        const columnKeys = Object.keys(firstArrayValue);
        for (let columnKey of columnKeys) {
            if (isString(firstArrayValue[columnKey])) {
                tvp.columns.add(columnKey, sql.VarChar);
            }
            if (isNumber(firstArrayValue[columnKey])) {
                if (isInteger(firstArrayValue[columnKey])) {
                    tvp.columns.add(columnKey, sql.BigInt);
                } else {
                    tvp.columns.add(columnKey, sql.Float);
                }
            }
            if (isBoolean(firstArrayValue[columnKey])) {
                tvp.columns.add(columnKey, sql.Bit);
            }
        }
        for (let item of dataArray) {
            const rowvalues = Object.values<any>(item);
            tvp.rows.add(...rowvalues);
        }
        return tvp;
    };

    createRequest(request: sql.Request, data: Obj = {}) {
        const keys = Object.keys(data);
        keys.map(keyName => {
            const keyValue = data[keyName];
            if (Array.isArray(keyValue)) {
                if (!isEmpty(keyValue)) {
                    request.input(keyName, this.createTvp(keyValue));
                }
            } else {
                request.input(keyName, keyValue);
            }
        });
        return request;
    };

    async exec(procName: string, data = {}) {
        const pool = await this.pool;
        let request = await pool.request();

        request = this.createRequest(request, data);
        // eslint-disable-next-line no-console
        request.on('error', function (err) { console.error({ err }); });
        const result = await request.execute(procName);

        try {
            if (result.recordsets.length > 0) {
                const keys = Object.keys(result.recordsets[0][0]);
                const keyValue = result.recordsets[0][0][keys[0]];
                if (!isEmpty(keyValue)) return get(JSON.parse(keyValue), '[0]', {});
                return keyValue;
            } else {
                return {};
            }

        } catch (ex) {
            throw new Error('An unknown error has occurred'); //Throw the error from the sproc as an exception
        }
    }

    async execList(procName: string, data = {}) {
        const pool = await this.pool;
        let request = await pool.request();
        request = this.createRequest(request, data);

        const result = await request.execute(procName);

        try {
            if (result.recordsets.length > 0) {
                const keys = Object.keys(result.recordsets[0][0]);
                const keyValue = result.recordsets[0][0][keys[0]];
                if (keyValue === "") return [];
                if (!isEmpty(keyValue)) return JSON.parse(keyValue);
                return keyValue;
            } else {
                return {};
            }

        } catch (ex) {
            throw new Error('An unknown error has occurred'); //Throw the error from the sproc as an exception
        }
    }

    async search(tableName: string, whereParams: Obj = {}) {
        /* we build query similar to below format */
        /* 
            await pool.request()
                .input('input_parameter', sql.Int, value)
                .query('select * from mytable where id = @input_parameter') 
        */

        const pool = await this.pool;
        let request = await pool.request();
        let whereString = '';
        if (whereParams) {
            whereString = 'where ';
            request = this.createRequest(request, whereParams);
            const whereKeys = Object.keys(whereParams);
            whereKeys.forEach(function (item, index, arr) {
                whereString += `[${item}] = @${item}`;
                if (index !== arr.length - 1) {
                    whereString += ' AND ';
                }
            });
        }


        let queryString = `select * from ${tableName} ${whereString};`;
        const result = await request.query(queryString);

        return get(result, 'recordsets[0]', []);
    }

    async deleteWhere(tableName: string, whereParams: Obj = {}) {
        /* we build query similar to below format */
        /* 
            await pool.request()
                .input('input_parameter', sql.Int, value)
                .query('select * from mytable where id = @input_parameter') 
        */

        const pool = await this.pool;
        let request = await pool.request();
        let whereString = '';
        if (whereParams) {
            whereString = 'where ';
            request = this.createRequest(request, whereParams);
            const whereKeys = Object.keys(whereParams);
            whereKeys.forEach(function (item, index, arr) {
                whereString += `[${item}] = @${item}`;
                if (index !== arr.length - 1) {
                    whereString += ' AND ';
                }
            });
        }


        let queryString = `delete from ${tableName} ${whereString};`;
        const result = await request.query(queryString);

        return get(result, 'recordsets[0]', []);
    }

    async find(tableName: string, whereParams: Obj = {}) {
        /* we build query similar to below format */
        /* 
            await pool.request()
                .input('input_parameter', sql.Int, value)
                .query('select * from mytable where id = @input_parameter') 
        */

        const pool = await this.pool;
        let request = await pool.request();
        let whereString = '';
        if (whereParams) {
            whereString = 'where ';
            request = this.createRequest(request, whereParams);
            const whereKeys = Object.keys(whereParams);
            whereKeys.forEach(function (item, index, arr) {
                whereString += `[${item}] = @${item}`;
                if (index !== arr.length - 1) {
                    whereString += ' AND ';
                }
            });
        }


        let queryString = `select * from ${tableName} ${whereString};`;
        const result = await request.query(queryString);
        return get(result, 'recordsets[0][0]', {});
    }

    async create(tableName: string, dataParams: Obj = {}, primaryKey: string = '') {
        const pool = await this.pool;
        let request = await pool.request();

        let keyString = '';
        let valueString = '';

        if (dataParams) {
            request = this.createRequest(request, dataParams);
            const keys = Object.keys(dataParams);
            keys.forEach(function (item, index, arr) {
                keyString += `${item}`;
                valueString += `@${item}`;
                if (index !== arr.length - 1) {
                    valueString += ',';
                    keyString += ',';
                }
            });
        }

        let queryString = `
                insert into ${tableName}(${keyString}) values (${valueString})
                SELECT * from ${tableName} where ${primaryKey} = SCOPE_IDENTITY()`;
        const result = await request.query(queryString);
        return get(result, 'recordset[0]', {});
    }

    async update(tableName: string, dataParams: Obj = {}, whereParams: Obj = {}) {
        /* we build query similar to below format */
        /* 
            await pool.request()
                .input('data_parameter', sql.Int, value)
                .input('where_parameter', sql.Int, value)
                .query('update mytable set col1 = @data_parameter where col2 = @input_parameter') 
        */

        const pool = await this.pool;
        let request = await pool.request();

        let setString = 'set ';
        let whereString = 'where ';

        if (dataParams) {
            setString = 'set ';
            request = this.createRequest(request, dataParams);
            const setKeys = Object.keys(dataParams);
            setKeys.forEach(function (item, index, arr) {
                setString += `[${item}] = @${item}`;
                if (index !== arr.length - 1) {
                    setString += ',';
                }
            });
        }

        if (whereParams) {
            whereString = 'where ';
            request = this.createRequest(request, whereParams);
            const whereKeys = Object.keys(whereParams);
            whereKeys.forEach(function (item, index, arr) {
                whereString += `[${item}] = @${item}`;
                if (index !== arr.length - 1) {
                    whereString += ' AND ';
                }
            });
        }

        let queryString = `update ${tableName} ${setString} ${whereString}`;
        await request.query(queryString);
    }

}

export default new Db()