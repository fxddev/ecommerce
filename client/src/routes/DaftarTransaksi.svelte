<script>
    import axios from "axios";

    import Navbar from "../components/pembeli/Navbar.svelte";

    const get_cred = localStorage.getItem("cred");
    console.log(get_cred);
    const cred = JSON.parse(get_cred);

    const api_url = localStorage.getItem("api_url");

    let transaksi_list = [];
    async function getTransaksiList() {
        const data = cred.data;
        const id_pembeli = data.id;

        var payload = JSON.stringify({ id_pembeli: parseInt(id_pembeli) });

        var config = {
            method: "post",
            url: `${api_url}/pesanan`,
            headers: {
                "Content-Type": "application/json",
            },
            data: payload,
        };

        try {
            const resp = await axios(config);
            const data = await resp.data;
            // console.log("data");
            // console.log(data);

            // console.log("JSON.parse(data)");
            // console.log(JSON.parse(data.data[0].alamat_tujuan));

            let items = data.data;
            for (let i = 0; i < items.length; i++) {
                // console.log(items[i]);

                const obj = {
                    id: items[i].id,
                    id_pembeli: items[i].id_pembeli,
                    no_invoice: items[i].no_invoice,
                    product_details: JSON.parse(items[i].product_details),
                    kurir: JSON.parse(items[i].kurir),
                    alamat_tujuan: JSON.parse(items[i].alamat_tujuan),
                    detail_harga: JSON.parse(items[i].detail_harga),
                    midtrans_response: JSON.parse(
                        items[i].midtrans_response
                    ),
                    no_resi: items[i].no_resi,
                    created_at: items[i].created_at,
                    update_at: items[i].update_at,
                };
                transaksi_list.push(obj)
            }
            console.log("transaksi_list");
            console.log(transaksi_list);
        } catch (error) {
            console.error(`Axios error..: ${error}`);
        }
    }
    getTransaksiList();
</script>

<Navbar />
