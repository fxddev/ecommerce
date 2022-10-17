const conn = require('../connect')

const jwt = require('jsonwebtoken')

exports.products = async (req, res) => {

    conn.query(`SELECT * FROM products`, async function (error, rows, fields) {

        if (error) {
            connection.log(error)

            res.status(200).send({
                message: "Error",
                data: error
            });

        } else {

            if (rows.length !== 0) {
                res.status(200).send({
                    message: "Sukses",
                    data: rows
                });
            } else {
                res.status(200).send({
                    message: "Tidak ada product sama sekali"
                });
            }

        }
    })
};
