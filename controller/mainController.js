const db = require("../connection/dbConnection");
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");
const humps = require("humps");

class Controller {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async get(searchParameters) {
    const decamelizedParameters = humps.decamelizeKeys(searchParameters);

    const result = await db(this.tableName)
      .where(decamelizedParameters)
      .catch((err) => {
        throw err;
      });

    return result.map((res) => {
      const plainObject = _.toPlainObject(res);
      const camelCaseObject = humps.camelizeKeys(plainObject);
      return camelCaseObject;
    });
  }

  async add(body) {
    const id = uuidv4();
    body.id = id;

    const decamelizedBody = humps.decamelizeKeys(body);

    const result = await db(this.tableName)
      .insert(decamelizedBody)
      .catch((err) => {
        throw err;
      });
    return result;
  }

  async edit(id, body) {
    const decamelizedBody = humps.decamelizeKeys(body);

    const result = await db(this.tableName)
      .update(decamelizedBody)
      .where({ id })
      .catch((err) => {
        throw err;
      });
    return result;
  }

  async remove(id) {
    const result = await db(this.tableName)
      .delete()
      .where({ id })
      .catch((err) => {
        throw err;
      });
    return result;
  }
}

module.exports = Controller;
