const bcrypt = require('bcrypt');
const { result } = require('lodash');
const saltRounds = 10;

function salt(password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err)
                reject(err)
            else
                resolve(hash)
        })

    });
}

function checkPassword(password, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, function (err, hash) {
            if (err)
                reject(err)
            else
                resolve(hash)
        })

    });
}

module.exports = {
    salt,
    checkPassword
}