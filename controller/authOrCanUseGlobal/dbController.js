const { v4: uuidv4 } = require("uuid");
const db = require("../../connection/dbConnection");
const _ = require("lodash");
const humps = require("humps");

function chainWhere(object) {
  const parsedObject = humps.decamelizeKeys(object);
  const parsedObjectKeys = Object.keys(parsedObject);
  return parsedObjectKeys
    .map((objKey, index) => {
      let value = parsedObject[objKey];
      if (typeof value === "string") {
        value = `"${value}"`;
      }
      let composedString = `${objKey} = ${value}`;
      if (index + 1 != parsedObjectKeys.length) composedString += " AND";
      return composedString;
    })
    .join(" ");
}

function whereLike(object) {
  const parsedObject = humps.decamelizeKeys(object);
  const parsedObjectKeys = Object.keys(parsedObject);
  return parsedObjectKeys
    .map((objKey) => {
      let value = parsedObject[objKey];
      if (typeof value === "string") {
        value = `${value}`;
      }
      let composedString = `${objKey} LIKE "%${value}%"`;
      return composedString;
    })
    .join(" ");
}

function chainSet(object) {
  const parsedObject = humps.decamelizeKeys(object);
  const parsedObjectKeys = Object.keys(parsedObject);
  return parsedObjectKeys
    .map((objKey, index) => {
      let value = parsedObject[objKey];
      if (typeof value === "string") {
        value = `"${value}"`;
      }
      let composedString = `${objKey} = ${value}`;
      return composedString;
    })
    .join(", ");
}

function createInsertColumns(object) {
  const parsedObject = humps.decamelizeKeys(object);
  return {
    columns: Object.keys(parsedObject).join(","),
    values: Object.values(parsedObject)
      .map((value) => (typeof value === "string" ? `"${value}"` : value))
      .join(","),
  };
}

function get(tableName, searchParameters) {
  let query = `SELECT * FROM ${tableName}`;
  const searchParameterKeys = Object.keys(searchParameters);
  if (searchParameterKeys.length) {
    query += " WHERE " + chainWhere(searchParameters);
  }
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) reject(err);
      else
        resolve(
          result.map((res) => {
            const plainObject = _.toPlainObject(res);
            const camelCaseObject = humps.camelizeKeys(plainObject);
            return camelCaseObject;
          })
        );
    });
  });
}

function getMovieDetail(movieId) {
  let query = `SELECT m.id m.title, m.poster, m.trailer, m.synopsis
  COUNT(r.review), AVG(r.rate), mi.release_date, mi.director, mi.budget, mi.featured_song, g.name
  FROM movies m
  LETF JOIN reviews r ON movies.id = reviews.movie_id
  JOIN movieInfo mi ON mi.movies_id = r.movie_id
  JOIN movieGenre mg ON mg.movies_id = mi.movies_id
  JOIN genre g ON g.id = mg.genre_id
  GROUP BY m.id
  where m.id = "${movieId}"`;
  // select id, title, genre.name, avg(reviews.rate) from movies
  // LEFT JOIN reviews ON movies.id = reviews.movie_id
  // JOIN movieGenre ON movies.id = movieGenre.movie_id
  // JOIN genre  ON movieGenre.genre_id = genre.id
  // GROUP BY id

  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) reject(err);
      else
        resolve(
          result.map((res) => {
            const plainObject = _.toPlainObject(res);
            const camelCaseObject = humps.camelizeKeys(plainObject);
            return camelCaseObject;
          })
        );
    });
  });
}

function getSearch(tableName, searchParameters) {
  let query = `SELECT * FROM ${tableName}`;
  const searchParameterKeys = Object.keys(searchParameters);
  if (searchParameterKeys.length) {
    query += " WHERE " + whereLike(searchParameters);
  }
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) reject(err);
      else
        resolve(
          result.map((res) => {
            const plainObject = _.toPlainObject(res);
            const camelCaseObject = humps.camelizeKeys(plainObject);
            return camelCaseObject;
          })
        );
    });
  });
}

function getReviewsFromUser(userId) {
  let query = `SELECT r.id, r.review_title, r.review, review, r.rate, r.date, m.title
  FROM reviews r JOIN movies m ON m.id = r.movie_id
  WHERE r.user_id = "${userId}" ORDER BY date DESC`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) reject(err);
      else
        resolve(
          result.map((res) => {
            const plainObject = _.toPlainObject(res);
            const camelCaseObject = humps.camelizeKeys(plainObject);
            return camelCaseObject;
          })
        );
    });
  });
}

function getReviewsFromUserWithTitle(userId, movieTitle) {
  let query = `SELECT r.id, r.review_title, r.review, review, r.rate, r.date, m.title
  FROM reviews r JOIN movies m ON m.id = r.movie_id
  WHERE r.user_id = "${userId}" AND m.title LIKE "%${movieTitle}%" ORDER BY date DESC`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) reject(err);
      else
        resolve(
          result.map((res) => {
            const plainObject = _.toPlainObject(res);
            const camelCaseObject = humps.camelizeKeys(plainObject);
            return camelCaseObject;
          })
        );
    });
  });
}

function add(tableName, body) {
  const id = uuidv4();
  body.id = id;
  const columnValue = createInsertColumns(body);
  let query = `INSERT INTO ${tableName} (${columnValue.columns})
  VALUES (${columnValue.values})`;
  return new Promise((resolve, reject) => {
    db.query(query, (err) => {
      if (err) reject(err);
      else resolve(body);
    });
  });
}

function edit(tableName, id, body) {
  let query = `UPDATE ${tableName}
  SET ${chainSet(body)}
  WHERE id="${id}"`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) reject(err);
      else if (!result.affectedRows)
        reject({
          code: "ERR_NOT_FOUND",
        });
      else resolve(body);
    });
  });
}

function remove(tableName, id) {
  let query = `DELETE FROM ${tableName}
  WHERE id="${id}"`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) reject(err);
      else if (!result.affectedRows)
        reject({
          code: "ERR_NOT_FOUND",
        });
      else resolve(id);
    });
  });
}

module.exports = {
  get,
  getSearch,
  getReviewsFromUser,
  getReviewsFromUserWithTitle,
  add,
  edit,
  remove,
  getMovieDetail,
};
