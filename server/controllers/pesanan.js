const conn = require('../connect')

const jwt = require('jsonwebtoken')

exports.create = async (req, res) => {

    // {
    //     "id_pembeli": 2,
    //     "product_details": [
    //         {
    //             "id": 5,
    //             "nama": "Kertas",
    //             "harga": "10000",
    //             "jumlah": "1"
    //         }
    //     ],
    //     "kurir": {
    //         "code": "JNE",
    //         "service": "OKE",
    //         "value": "10000",
    //         "etd": "1-2"
    //     },
    //     "alamat_tujuan": {
    //         "nama": "Fahmi",
    //         "nomor_telp": "62812534782",
    //         "alamat": "Perum"
    //     },
    //     "detail_harga": {
    //         "harga_barang": "10000",
    //         "harga_kurir": "6000",
    //         "Total_harga": "16000"
    //     },
    //     "midtrans_response": {
    //         "status": "Pending"
    //     },
    //     "no_resi": ""
    // }

    const id_pembeli = req.body.id_pembeli;
    const product_details = JSON.stringify(req.body.product_details)
    const kurir = JSON.stringify(req.body.kurir)
    const alamat_tujuan = JSON.stringify(req.body.alamat_tujuan)
    // const detail_harga = req.body.detail_harga;
    const detail_harga = JSON.stringify(req.body.detail_harga);
    // const midtrans_response = req.body.midtrans_response
    const midtrans_response = JSON.stringify(req.body.midtrans_response)
    const no_resi = req.body.no_resi;

    const d = new Date();
    const created_at = d.getTime();
    const update_at = d.getTime();

    conn.query(`SELECT id FROM pesanan ORDER BY id DESC LIMIT 1`, function (error, rows, fields) {
        if (error) {
            console.log(error)

            res.status(200).send({
                message: "Ada Error",
                data: error
            });
        } else {

            // res.status(200).send({
            //     message: rows[0].id
            // });

            const d = new Date();
            let month = d.getMonth();
            let day = d.getDate()
            let year = d.getFullYear();
            let no_invoice = ""
            if (rows.length === 0) {
                no_invoice = `INV/${day}${month}${year}/IDP/1`;
            } else {
                const new_idp = parseInt(rows[0].id)+1
                no_invoice = `INV/${day}${month}${year}/IDP/${new_idp}`;
            }

            conn.query(`INSERT INTO pesanan (id_pembeli, no_invoice, product_details, kurir, alamat_tujuan, detail_harga, midtrans_response, no_resi, created_at, update_at) VALUES(${id_pembeli}, "${no_invoice}", '${product_details}', '${kurir}', '${alamat_tujuan}', '${detail_harga}', '${midtrans_response}', "${no_resi}", "${created_at}", "${update_at}")`, function (error, rows, fields) {
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

        }
    })

};

exports.gets = async (req, res) => {

    // {
    //     "id_pembeli": 1
    // }
    const id_pembeli = req.body.id_pembeli;

    conn.query(`
    SELECT
        pesanan.id,
        products.nama AS nama_product,
        products.img,
        kurir.nama AS nama_kurir,
        pesanan.alamat_tujuan,
        pesanan.detail_harga,
        pesanan.midtrans_response,
        pesanan.no_resi,
        pesanan.created_at,
        pesanan.update_at
    FROM pesanan
    INNER JOIN products
        ON pesanan.id_product = products.id
    INNER JOIN kurir
        ON pesanan.id_kurir = kurir.id
    WHERE
    pesanan.id_pembeli = ${id_pembeli}`, async function (error, rows, fields) {

        if (error) {
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
                    message: "Tidak ada pesanan sama sekali"
                });
            }

        }
    })
};

exports.update = async (req, res) => {

    // {
    //     "id": 2,
    //     "id_product": 1,
    //     "id_pembeli": 1,
    //     "midtrans_response": {
    //         "status": "Success"
    //     },
    //     "id_kurir": 1,
    //     "alamat_tujuan": {
    //         "nama": "Fahmi",
    //         "nomor_telp": "0812534782",
    //         "alamat": "Perum"
    //     },
    //     "detail_harga": {
    //         "harga_barang": "10000",
    //         "harga_kurir": "6000",
    //         "Total_harga": "16000"
    //     },
    //     "no_resi": "#GDYGY#6474748",
    //     "created_at": "24165137578475"
    // }

    const id = req.body.id;
    const id_product = req.body.id_product;
    const id_pembeli = req.body.id_pembeli;
    // const midtrans_response = req.body.midtrans_response
    const midtrans_response = JSON.stringify(req.body.midtrans_response)
    const id_kurir = req.body.id_kurir;
    const alamat_tujuan = JSON.stringify(req.body.alamat_tujuan)
    // const detail_harga = req.body.detail_harga;
    const detail_harga = JSON.stringify(req.body.detail_harga);
    const no_resi = req.body.no_resi;
    const created_at = req.body.created_at;

    const d = new Date();
    const update_at = d.getTime();

    conn.query(`UPDATE pesanan 
    SET 
    id_product=${id_product}, id_pembeli=${id_pembeli}, midtrans_response='${midtrans_response}', id_kurir=${id_kurir}, alamat_tujuan='${alamat_tujuan}', detail_harga='${detail_harga}',no_resi="${no_resi}", created_at="${created_at}", update_at="${update_at}" 
    WHERE 
    id = ${id}`, function (error, rows, fields) {
        if (error) {
            console.log(error)

            res.status(200).send({
                message: "Ada Error",
                data: error
            });
        } else {

            res.status(200).send({
                message: "Berhasil update pesanan !"
            });
        }
    })

};