// https://www.makeuseof.com/nodejs-bcrypt-hash-verify-salt-password/ (validate pass)
// https://github.com/zestgeek/Auth-using-ReactJs-express-jwt-nodejs/blob/master/api/server.js (jwt)

const conn = require('../connect')

const jwt = require('jsonwebtoken')
// const bcrypt = require("bcrypt")
var simplecrypt = require("simplecrypt");
var sc = simplecrypt();

const auth_reuse = require("../components/auth_reuse")

const jwt_secret = process.env.JWT_SECRET;

// async function signUpHandle(data, role_name) {
//     // let passing_data = {}

//     const table_active = role_name

//     const email = data.email;

//     // return {
//     //     message: `SELECT * FROM ${table_active} WHERE email = "${email}"`
//     // }

//     try {
//         conn.query(`SELECT * FROM ${table_active} WHERE email = "${email}"`, async function (error, rows, fields) {

//             // return {
//             //     message: "tes"
//             // }

//             if (error) {
//                 connection.log(error)

//                 // passing_data = {
//                 //     message: "Error",
//                 //     data: error
//                 // }

//                 return {
//                     message: "Error",
//                     data: error
//                 }

//             } else {

//                 // console.log(rows);
//                 // return {
//                 //     message: rows.length
//                 // }

//                 if (rows.length !== 0) {
//                     console.log("User sudah terdaftar");

//                     // passing_data = {
//                     //     message: "User sudah terdaftar"
//                     // }

//                     return {
//                         message: "User sudah terdaftar"
//                     }
//                 } else {
//                     const nama = data.nama;
//                     const password = data.password;
//                     const alamat = data.alamat;
//                     const role_id = data.role_id;
//                     const created_at = data.created_at;
//                     const update_at = data.update_at;

//                     const hash = await bcrypt.hash(password, 10);

//                     await conn.query(`INSERT INTO ${table_active} (nama, email, password, alamat, role_id, created_at, update_at) VALUES(${nama}, ${email}, ${hash}, ${alamat}, ${role_id}, ${created_at}, ${update_at})`, async function (error, rows, fields) {
//                         if (error) {
//                             console.log(error)

//                             // passing_data = {
//                             //     message: "Ada Error",
//                             //     data: error
//                             // }

//                             return {
//                                 message: "Ada Error",
//                                 data: error
//                             }
//                         } else {
//                             // passing_data = {
//                             //     message: "Berhasil sign up !"
//                             // }

//                             return {
//                                 message: "Berhasil sign up !"
//                             }
//                         }
//                     })
//                 }

//             }
//         })

//         // return passing_data
//     } catch (error) {
//         console.error(`Ada Error saat menjalankan update keranjang: ${error}`);

//         passing_data = {
//             message: `Ada Error saat menjalankan update keranjang: ${error}`
//         }
//         return passing_data
//     }

// }

exports.signUp = async (req, res) => {

    // {
    //     "nama": "Fahmi",
    //     "email": "f@g.com",
    //     "password": "fahmi123",
    //     "alamat": "bekasi timur",
    //     "role_id": 2,
    //     "created_at": "1664862720",
    //     "update_at": "1664862720"
    // }

    const role_id = req.body.role_id;

    if (parseInt(role_id) != 1 && parseInt(role_id) != 2 && parseInt(role_id) != 3) {
        // tdk ditemukan rolenya
        res.status(200).send({
            message: "Error",
            data: `Tidak ada role ke ${role_id}`
        });
    } else {
        let role_name = ""

        if (parseInt(role_id) === 1) {
            // admin
            role_name = "admin"
        } else if (parseInt(role_id) === 2) {
            // penjual
            role_name = "penjual"
        } else if (parseInt(role_id) === 3) {
            // pembeli
            role_name = "pembeli"
        }

        const table_active = role_name

        const email = req.body.email;

        conn.query(`SELECT * FROM ${table_active} WHERE email = "${email}"`, async function (error, rows, fields) {

            if (error) {
                connection.log(error)

                res.status(200).send({
                    message: "Error",
                    data: error
                });

            } else {

                if (rows.length !== 0) {
                    // console.log("User sudah terdaftar");

                    res.status(200).send({
                        message: "User sudah terdaftar"
                    });
                } else {
                    const nama = req.body.nama;
                    const password = req.body.password;
                    const alamat = req.body.alamat;
                    const role_id = req.body.role_id;

                    const d = new Date();
                    const created_at = d.getTime();
                    const update_at = d.getTime();

                    // const hash = await bcrypt.hash(password, 10);
                    var hash = sc.encrypt(password);
                    // console.log("hash");
                    // console.log(hash);
                    var decode = sc.decrypt(hash);
                    // console.log("decode");
                    // console.log(decode);

                    await conn.query(`INSERT INTO ${table_active} (nama, email, password, alamat, role_id, created_at, update_at) VALUES("${nama}", "${email}", "${hash}", "${alamat}", ${role_id}, "${created_at}", "${update_at}")`, function (error, rows, fields) {
                        if (error) {
                            console.log(error)

                            res.status(200).send({
                                message: "Ada Error",
                                data: error
                            });
                        } else {

                            res.status(200).send({
                                message: "Berhasil sign up !"
                            });
                        }
                    })
                }

            }
        })

        // susah buat reuse
        // const auth_reuse_signup = await auth_reuse.signUpHandle(req.body, role_name)
        // console.log(auth_reuse_signup);
        // res.status(200).send(auth_reuse_signup);
    }

};

exports.login = async (req, res) => {

    // {
    //     "email": "d@g.com",
    //     "password": "daud123",
    //     "role_id": 3
    // }

    const role_id = req.body.role_id;

    if (parseInt(role_id) != 1 && parseInt(role_id) != 2 && parseInt(role_id) != 3) {
        // tdk ditemukan rolenya
        res.status(200).send({
            message: "Error",
            data: `Tidak ada role ke ${role_id}`
        });
    } else {
        let role_name = ""

        if (parseInt(role_id) === 1) {
            // admin
            role_name = "admin"
        } else if (parseInt(role_id) === 2) {
            // penjual
            role_name = "penjual"
        } else if (parseInt(role_id) === 3) {
            // pembeli
            role_name = "pembeli"
        }

        const table_active = role_name

        const email = req.body.email;

        await conn.query(`SELECT * FROM ${table_active} WHERE email = "${email}"`, async function (error, rows, fields) {

            if (error) {
                connection.log(error)
                res.status(200).send({
                    message: "Error"
                });
            } else {

                if (rows.length !== 0) {

                    let password = req.body.password;
                    // const result = await bcrypt.compare(password, rows[0].password);

                    let p = rows[0].password
                    var decode = sc.decrypt(p.toString());
                    console.log("pass decrypt");
                    console.log(decode);
                    // console.log("pass db");
                    console.log(rows[0].password);

                    if (password === decode) {

                        const payload = {
                            email: email
                        };

                        // console.log(jwt_secret);
                        const token = jwt.sign(payload, jwt_secret);

                        res.status(200).send({
                            message: "Success!",
                            isRegistered: true,
                            token: token,
                            data: {
                                "id": rows[0].id,
                                "email": rows[0].email,
                                "nama": rows[0].nama,
                                "alamat": rows[0].alamat,
                                "role_id": rows[0].role_id
                            }
                        });
                    } else {
                        res.status(200).send({
                            message: "Gagal!",
                            isRegistered: true
                        });
                    }

                } else {
                    res.status(200).send({
                        message: "User belum terdaftar",
                        isRegistered: false
                    });
                }

            }
        })



    }

};
