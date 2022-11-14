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

                const midtrans_res = JSON.parse(items[i].midtrans_response);
                // console.log(midtrans_res.transaction_id);
                await getDetailMidtransRes(midtrans_res.transaction_id);

                parseInt(items[i].created_at)
                var date_unix = new Date(1668392943546 * 1000);
                console.log("date_unix");
                console.log(date_unix);
                
                console.log(date_unix.toLocaleDateString("default"));

                // // Hours part from the timestamp
                // var hours = date.getHours();
                // // Minutes part from the timestamp
                // var minutes = "0" + date.getMinutes();
                // // Seconds part from the timestamp
                // var seconds = "0" + date.getSeconds();

                // // Will display time in 10:30:23 format
                // var formattedTime =
                //     hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
                //     console.log("formattedTime");
                //     console.log(formattedTime);

                let obj = {};
                if (temp_newest_midtrans_res.transaction_status === "pending") {
                    console.log("temp_newest_midtrans_res.transaction_time");
                    console.log(temp_newest_midtrans_res.transaction_time);

                    const order_date =
                        temp_newest_midtrans_res.transaction_time;
                    const split_order_date = order_date.split("-");
                    console.log("split");
                    console.log(split_order_date);

                    const get_tgl_order = split_order_date[2].split(" ")[0];
                    console.log("get_tgl_order");
                    console.log(get_tgl_order);

                    const tgl_new = parseInt(get_tgl_order) + 1;
                    const pay_before_date = `${tgl_new}-${
                        split_order_date[1]
                    }-${split_order_date[0]} ${
                        split_order_date[2].split(" ")[1]
                    }`;
                    console.log("pay_before_date");
                    console.log(pay_before_date);

                    obj = {
                        id: items[i].id,
                        id_pembeli: items[i].id_pembeli,
                        no_invoice: items[i].no_invoice,
                        product_details: JSON.parse(items[i].product_details),
                        kurir: JSON.parse(items[i].kurir),
                        alamat_tujuan: JSON.parse(items[i].alamat_tujuan),
                        detail_harga: JSON.parse(items[i].detail_harga),
                        midtrans_response: temp_newest_midtrans_res,
                        pay_before_date: pay_before_date,
                        no_resi: items[i].no_resi,
                        created_at: items[i].created_at,
                        update_at: items[i].update_at,
                    };
                } else {
                    obj = {
                        id: items[i].id,
                        id_pembeli: items[i].id_pembeli,
                        no_invoice: items[i].no_invoice,
                        product_details: JSON.parse(items[i].product_details),
                        kurir: JSON.parse(items[i].kurir),
                        alamat_tujuan: JSON.parse(items[i].alamat_tujuan),
                        detail_harga: JSON.parse(items[i].detail_harga),
                        midtrans_response: temp_newest_midtrans_res,
                        no_resi: items[i].no_resi,
                        created_at: items[i].created_at,
                        update_at: items[i].update_at,
                    };
                }

                transaksi_list.push(obj);
            }
            console.log("transaksi_list");
            console.log(transaksi_list);
            return transaksi_list;
        } catch (error) {
            console.error(`Axios error..: ${error}`);
        }
    }

    let promise_get_transaksi = getTransaksiList();

    let temp_newest_midtrans_res = {};
    async function getDetailMidtransRes(id_transaksi_midtrans) {
        var payload = JSON.stringify({ transaction_id: id_transaksi_midtrans });

        var config = {
            method: "post",
            url: `${api_url}/midtrans/status`,
            headers: {
                "Content-Type": "application/json",
            },
            data: payload,
        };

        try {
            const resp = await axios(config);
            const data = await resp.data;
            console.log("data");
            console.log(data);

            temp_newest_midtrans_res = data.data;
        } catch (error) {
            console.error(`Axios error..: ${error}`);
        }
    }
</script>

<Navbar />

<div class="container__">
    {#await promise_get_transaksi}
        <p>...waiting</p>
    {:then transaksi_list_items}
        {#each transaksi_list as t}
            <div class="card__">
                <div class="top__">
                    <div class="left__">
                        <span>Belanja </span><span>{t.created_at}</span><span
                            >{t.no_invoice}</span
                        >
                    </div>
                    <div class="right__">
                        <span>{t.pay_before_date}</span>
                    </div>
                </div>
                <div class="middle__">
                    <div class="left__">
                        <div class="avatar">
                            <div class="w-24 rounded">
                                <img
                                    src="https://placeimg.com/192/192/people"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="middle__">
                        <span>{t.product_details.nama}</span>
                        <span
                            >{t.product_details.jumlah} barang x {t
                                .product_details.harga}</span
                        >
                    </div>
                    <div class="right__">
                        <span>Total Belanja</span>
                        <span>Rp. {t.detail_harga.total_harga}</span>
                    </div>
                </div>
                <div class="bottom__" />
            </div>
        {/each}
    {:catch error}
        <p style="color: red">{error.message}</p>
    {/await}
</div>

<style>
    .container__ {
        display: flex;
        padding-top: 80px;
        flex-direction: column;
        gap: 20px;
    }
</style>
