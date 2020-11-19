const db = require('../../connection/dbConnection')
const _ = require('lodash')
const humps = require('humps')

function getActor(title) {
    let sql = `SELECT name, photo FROM actors a
                JOIN movieActor ma ON a.id = ma.actor_id 
                JOIN movies m ON ma.movie_id = m.id where title = "${title}"`


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

module.exports = { getActor } 
