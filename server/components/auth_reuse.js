const conn = require('../connect')

const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

async function signUpHandle(data, role_name) {
    let passing_data = {}

    const table_active = role_name

    const email = data.email;

    // return {
    //     message: `SELECT * FROM ${table_active} WHERE email = "${email}"`
    // }

    conn.query(`SELECT * FROM ${table_active} WHERE email = "${email}"`, async function (error, rows, fields) {

        // return {
        //     message: "tes"
        // }

        if (error) {
            connection.log(error)

            // passing_data = {
            //     message: "Error",
            //     data: error
            // }

            return {
                message: "Error",
                data: error
            }

        } else {

            // console.log(rows);
            // return {
            //     message: rows.length
            // }

            if (rows.length !== 0) {
                console.log("User sudah terdaftar");

                passing_data = {
                    message: "User sudah terdaftar"
                }

                return {
                    message: "User sudah terdaftar"
                }
            } else {
                const nama = data.nama;
                const password = data.password;
                const alamat = data.alamat;
                const role_id = data.role_id;
                const created_at = data.created_at;
                const update_at = data.update_at;

                const hash = await bcrypt.hash(password, 10);

                await conn.query(`INSERT INTO ${table_active} (nama, email, password, alamat, role_id, created_at, update_at) VALUES(${nama}, ${email}, ${hash}, ${alamat}, ${role_id}, ${created_at}, ${update_at})`, async function (error, rows, fields) {
                    if (error) {
                        console.log(error)

                        passing_data = {
                            message: "Ada Error",
                            data: error
                        }

                        return {
                            message: "Ada Error",
                            data: error
                        }
                    } else {
                        passing_data = {
                            message: "Berhasil sign up !"
                        }

                        return {
                            message: "Berhasil sign up !"
                        }
                    }
                })
            }

        }
    })

    // return passing_data
}

// module.exports = signUpHandle;
// export default signUpHandle;

// https://stackoverflow.com/questions/55744617/how-pass-argument-from-one-nodejs-file-to-another
exports.signUpHandle = signUpHandle