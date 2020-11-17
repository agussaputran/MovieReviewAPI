const dbConn = require("../../connection/dbConnection")
const _ = require('lodash')
const humps = require('humps')

function getLimitation(tableField, tableName, setting) {
    let sql = `SELECT ${tableField} FROM ${tableName}
    ${setting.order} ${setting.limit} ${setting.offset}`

    return new Promise((resolve, reject) => {
        dbConn.query(sql, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result.map(res => {
                    const plainObject = _.toPlainObject(res)
                    const camelCaseObject = humps.camelizeKeys(plainObject)
                    return camelCaseObject
                }))
            }
        })
    })
}

// 'SELECT COUNT(*) as total FROM movie'
function countData(tableField, tableName) {
    let sql = `SELECT COUNT(${tableField}) as total FROM ${tableName}`

    return new Promise((resolve, reject) => {
        dbConn.query(sql, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

module.exports = {
    getLimitation,
    countData
}
