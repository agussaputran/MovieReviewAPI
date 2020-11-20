const db = require('../../connection/dbConnection')
const _ = require('lodash')
const humps = require('humps')

function getGenre(genre) {
    let sql = `SELECT id, title, poster, g.name FROM movies m 
                JOIN movieGenre mg ON mg.movies_id = m.id 
                JOIN genres g ON mg.genre_id = g.id where name = "${genre}"`

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

module.exports = { getGenre } 
