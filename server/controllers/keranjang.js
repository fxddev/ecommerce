const conn = require('../connect')

const jwt = require('jsonwebtoken')

exports.keranjang = async (req, res) => {

    const id_pembeli = req.body.id_pembeli;

    conn.query(`SELECT
    keranjang.id AS id_keranjang,
    pembeli.id AS id_pembeli,
    penjual.nama AS nama_penjual,
    penjual.alamat AS alamat_penjual,
    products.nama AS nama_product,
    products.img,
    products.harga,
    products.minimum_pembelian,
    keranjang.jumlah,
    products.stok,
    products.status
  FROM keranjang
    INNER JOIN pembeli
      ON keranjang.id_pembeli = ${id_pembeli}
    INNER JOIN products
      ON keranjang.id_product = products.id
    INNER JOIN penjual
      ON products.id_penjual = penjual.id`, async function (error, rows, fields) {

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

exports.tambahKeranjang = async (req, res) => {

    // {
    //     "id_product": ,
    //     "id_pembeli": ,
    //     "jumlah": "1",
    //     "created_at": "24165137578475",
    //     "update_at": "24165137578475"
    // }

    const id_product = req.body.id_product;
    const id_pembeli = req.body.id_pembeli;
    const jumlah = req.body.jumlah;

    const d = new Date();
    const created_at = d.getTime();
    const update_at = d.getTime();

    conn.query(`SELECT * FROM keranjang WHERE id_pembeli = ${id_pembeli} AND id_product = ${id_product}`, function (error, rows, fields) {
        if (error) {
            console.log(error)

            res.status(200).send({
                message: "Ada Error",
                data: error
            });
        } else {

            if (parseInt(rows.length) === 0) {
                conn.query(`INSERT INTO keranjang (id_product, id_pembeli, jumlah, created_at, update_at) VALUES(${id_product}, ${id_pembeli}, "${jumlah}", "${created_at}", "${update_at}")`, function (error, rows, fields) {
                    if (error) {
                        console.log(error)

                        res.status(200).send({
                            message: "Ada Error",
                            data: error
                        });
                    } else {

                        res.status(200).send({
                            message: "Berhasil tambah keranjang !"
                        });
                    }
                })
            } else {

                // res.status(200).send({
                //     message: "Update ygsudah ada !",
                //     data: rows
                // });

                const jumlah_calc = parseInt(rows[0].jumlah) + parseInt(jumlah)
                const jumlah_new = jumlah_calc.toString()

                "UPDATE mahasiswa SET nim=?, nama=?, jurusan=? WHERE id_mahasiswa=?"
                // UPDATE `keranjang` SET `jumlah` = '2' WHERE `keranjang`.`id` = 1;
                conn.query(`UPDATE keranjang 
                SET 
                id_product=${rows[0].id_product}, id_pembeli=${rows[0].id_pembeli}, jumlah="${jumlah_new}", created_at="${rows[0].created_at}", update_at="${update_at}" 
                WHERE 
                id = ${rows[0].id}`, function (error, rows, fields) {
                    if (error) {
                        console.log(error)

                        res.status(200).send({
                            message: "Ada Error",
                            data: error
                        });
                    } else {

                        res.status(200).send({
                            message: "Berhasil update keranjang !"
                        });
                    }
                })
            }
        }
    })

};

exports.updateKeranjang = async (req, res) => {

    // {
    //     "id_product": ,
    //     "id_pembeli": ,
    //     "jumlah": "-1",
    //     "created_at": "24165137578475",
    //     "update_at": "24165137578475"
    // }

    const id_product = req.body.id_product;
    const id_pembeli = req.body.id_pembeli;

    conn.query(`SELECT * FROM keranjang WHERE id_pembeli = ${id_pembeli} AND id_product = ${id_product}`, function (error, rows, fields) {
        if (error) {
            console.log(error)

            res.status(200).send({
                message: "Ada Error",
                data: error
            });
        } else {

            if (parseInt(rows.length) === 0) {
                res.status(200).send({
                    message: `Tidak ada id produk ${id_product} / id_pembeli ${id_pembeli} di keranjang !`
                });
            } else {

                // res.status(200).send({
                //     message: "Update ygsudah ada !",
                //     data: rows
                // });


                const jumlah = req.body.jumlah;

                let jumlah_calc, jumlah_new
                if (parseInt(jumlah) === -1) {
                    jumlah_calc = parseInt(rows[0].jumlah) - 1

                    if (parseInt(jumlah_calc) < 1) {
                        jumlah_new = 1
                    } else {
                        jumlah_new = jumlah_calc.toString()
                    }
                } else {
                    jumlah_new = jumlah.toString()
                }

                const update_at = req.body.update_at;

                // "UPDATE mahasiswa SET nim=?, nama=?, jurusan=? WHERE id_mahasiswa=?"
                // UPDATE `keranjang` SET `jumlah` = '2' WHERE `keranjang`.`id` = 1;
                conn.query(`UPDATE keranjang 
                SET 
                id_product=${rows[0].id_product}, id_pembeli=${rows[0].id_pembeli}, jumlah="${jumlah_new}", created_at="${rows[0].created_at}", update_at="${update_at}" 
                WHERE 
                id = ${rows[0].id}`, function (error, rows, fields) {
                    if (error) {
                        console.log(error)

                        res.status(200).send({
                            message: "Ada Error",
                            data: error
                        });
                    } else {

                        res.status(200).send({
                            message: "Berhasil update keranjang !"
                        });
                    }
                })
            }
        }
    })

};

exports.deletesKeranjang = async (req, res) => {

    // [
    //     {
    //         "id":  
    //     },
    //     {
    //         "id": 
    //     }
    // ]

    const array = req.body;

    // res.status(200).send({
    //     message: "tes",
    //     data: array
    // });

    let condition = "WHERE id IN "
    let clause = ""
    for (let i = 0; i < array.length; i++) {

        let id_each
        if (parseInt(i) === 0) {
            id_each = `${array[i].id}`
        } else {
            id_each = `,${array[i].id}`
        }
        // console.log(clause);
        clause += id_each;
        // console.log(condition);
    }

    condition += "("
    condition += clause
    condition += ")"
    // console.log(condition);

    // res.status(200).send({
    //     message: "tesCond",
    //     data: condition
    // });

    // DELETE from `keranjang` WHERE id IN (5,6)
    conn.query(`DELETE FROM keranjang ${condition}`, function (error, rows, fields) {
        if (error) {
            console.log(error)

            res.status(200).send({
                message: "Ada Error",
                data: error
            });
        } else {
            res.status(200).send({
                message: `Berhasil hapus ${condition}`,
            });
        }
    })

};