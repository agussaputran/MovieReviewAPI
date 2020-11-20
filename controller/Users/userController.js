const { v4: uuidv4 } = require('uuid');
const db = require('../../connection/dbConnection')
const _ = require('lodash')
const humps = require('humps')

function chainWhere(object) {
  const parsedObject = humps.decamelizeKeys(object)
  const parsedObjectKeys = Object.keys(parsedObject)
  return parsedObjectKeys.map((objKey, index) => {
    let value = parsedObject[objKey]
    if (typeof value === 'string') {
      value = `"${value}"`
    }
    let composedString = `${objKey} = ${value}`
    if (index + 1 != parsedObjectKeys.length)
      composedString += ' AND'
    return composedString
  }).join(' ')
}

function chainSet(object) {
  const parsedObject = humps.decamelizeKeys(object)
  const parsedObjectKeys = Object.keys(parsedObject)
  return parsedObjectKeys.map((objKey, index) => {
    let value = parsedObject[objKey]
    if (typeof value === 'string') {
      value = `"${value}"`
    }
    let composedString = `${objKey} = ${value}`
    return composedString
  }).join(', ')
}

function createInsertColumns(object) {
  const parsedObject = humps.decamelizeKeys(object)
  return {
    columns: Object.keys(parsedObject).join(','),
    values: Object.values(parsedObject).map(value =>
      typeof value === 'string' ? `"${value}"` : value).join(',')
  }
}

function getUsers(tableName, searchParameters) {
  let query = `SELECT id, username, email, photo_profile, password FROM ${tableName}`
  const searchParameterKeys = Object.keys(searchParameters)
  if (searchParameterKeys.length) {
    query += " WHERE " + chainWhere(searchParameters)
  }
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err)
        reject(err)
      else
        resolve(result.map(res => {
          const plainObject = _.toPlainObject(res)
          const camelCaseObject = humps.camelizeKeys(plainObject)
          return camelCaseObject
        }))
    })
  })
}

function addUsers(tableName, body) {
  const id = uuidv4()
  body.id = id
  const columnValue = createInsertColumns(body)
  let query = `INSERT INTO ${tableName} (${columnValue.columns})
  VALUES (${columnValue.values})`
  return new Promise((resolve, reject) => {
    db.query(query, (err) => {
      if (err)
        reject(err)
      else
        resolve(body)
    })
  })
}

function editUsers(tableName, id, body) {
  let query = `UPDATE ${tableName}
  SET ${chainSet(body)}
  WHERE id="${id}"`
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err)
        reject(err)
      else if (!result.affectedRows)
        reject({
          code: "ERR_NOT_FOUND"
        })
      else
        resolve(body)
    })
  })
}


function removeUsers(tableName, id) {
  let query = `DELETE FROM ${tableName}
  WHERE id="${id}"`
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err)
        reject(err)
      else if (!result.affectedRows)
        reject({
          code: "ERR_NOT_FOUND"
        })
      else
        resolve(id)
    })
  })
}


module.exports = {
  getUsers,
  addUsers,
  editUsers,
  removeUsers
}