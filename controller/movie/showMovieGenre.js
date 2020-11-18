const db = require('../../connection/dbConnection')
const _ = require('lodash')
const humps = require('humps')

function showGenre(title) {
    let sql = `SELECT name FROM genres g
                JOIN movieGenre mg ON g.id = mg.genre_id 
                JOIN movies m ON mg.movies_id = m.id where title = "${title}"`

    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result.map(res => {
                    const plainObject = _.toPlainObject(res)
                    const camelCaseObject = humps.camelizeKeys(plainObject)
                    return camelCaseObject
                })
                )
            }
        })

    })
}

module.exports = { showGenre } 
