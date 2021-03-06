const dbConn = require("../../connection/dbConnection")
const _ = require('lodash')
const humps = require('humps')

function getPaginate(setting) {
    let query = `SELECT * FROM movies 
    ${setting.order} ${setting.limit} ${setting.offset}`

    return new Promise((resolve, reject) => {
        dbConn.query(query, (err, result) => {
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

// we need some key from movies to get a number in movies database
function countData(objectKey, tableName) {
    let query = `SELECT COUNT(${objectKey}) as total FROM ${tableName}`

    return new Promise((resolve, reject) => {
        dbConn.query(query, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

module.exports = {
    getPaginate,
    countData
}
