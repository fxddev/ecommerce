<script>
    import axios from "axios";

    import { navigate } from "svelte-navigator";

    const get_cred = localStorage.getItem("cred");
    //   console.log(get_cred);
    const cred = JSON.parse(get_cred);

    if (get_cred === null) {
        navigate(`/login?seller`, { replace: true });
    } else {
        const data = cred.data;
        const role_id = data.role_id;
        console.log(role_id);

        if (parseInt(role_id) === 3) {
            // jika bukan seller
            navigate(`/`, { replace: true });
        }
    }

    const api_url = localStorage.getItem("api_url");

    let transaksi_list = [];
    async function getTransaksiList() {
        const data = cred.data;
        const role_id = data.role_id;

        var payload = JSON.stringify({
            role_id: parseInt(role_id),
        });

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

                var buy_date_convert = new Date(parseInt(items[i].created_at));
                console.log("buy_date_convert");
                console.log(buy_date_convert);
                const split_buy_date = buy_date_convert.toString().split(" ");
                console.log("split_buy_date");
                console.log(split_buy_date);
                const buy_date = `${split_buy_date[2]} ${split_buy_date[1]} ${split_buy_date[3]}`;
                console.log("buy_date");
                console.log(buy_date);

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
                        buy_date: buy_date,
                        product_details: JSON.parse(items[i].product_details),
                        kurir: JSON.parse(items[i].kurir),
                        alamat_tujuan: JSON.parse(items[i].alamat_tujuan),
                        detail_harga: JSON.parse(items[i].detail_harga),
                        midtrans_response: temp_newest_midtrans_res,
                        pay_before_date: pay_before_date,
                        is_proses: items[i].is_proses,
                        no_resi: items[i].no_resi,
                        is_selesai: items[i].is_selesai,
                        created_at: items[i].created_at,
                        update_at: items[i].update_at,
                    };
                } else {
                    obj = {
                        id: items[i].id,
                        id_pembeli: items[i].id_pembeli,
                        no_invoice: items[i].no_invoice,
                        buy_date: buy_date,
                        product_details: JSON.parse(items[i].product_details),
                        kurir: JSON.parse(items[i].kurir),
                        alamat_tujuan: JSON.parse(items[i].alamat_tujuan),
                        detail_harga: JSON.parse(items[i].detail_harga),
                        midtrans_response: temp_newest_midtrans_res,
                        is_proses: items[i].is_proses,
                        no_resi: items[i].no_resi,
                        is_selesai: items[i].is_selesai,
                        created_at: items[i].created_at,
                        update_at: items[i].update_at,
                    };
                }

                transaksi_list.push(obj);
            }
            console.log("transaksi_list");
            console.log(transaksi_list);

            checkNothingTransaction();

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

    let is_nothing_transactions = true;
    async function checkNothingTransaction() {
        for (let i = 0; i < transaksi_list.length; i++) {
            if (
                transaksi_list[i].midtrans_response.transaction_status ===
                "settlement"
            ) {
                is_nothing_transactions = false;
            }
        }
    }

    let is_btn_proses = false;
    async function prosesTransaksi(id_pesanan) {
        console.log("Sedang klik proses dg id_pesanan=");
        console.log(id_pesanan);

        is_btn_proses = true;

        var payload = JSON.stringify({
            id: parseInt(id_pesanan),
            is_proses: "true",
        });

        var config = {
            method: "post",
            url: `${api_url}/pesanan/update`,
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

            temp_newest_midtrans_res = {};
            transaksi_list = [];

            let promise_get_transaksi = getTransaksiList();
            is_btn_proses = false;
        } catch (error) {
            console.error(`Axios error..: ${error}`);
        }
    }
</script>

{#await promise_get_transaksi}
    <p>...waiting</p>
{:then transaksi_list_items}
    {#if is_nothing_transactions}
        Oops tidak ada transaksi
    {/if}

    <div class="overflow-x-auto">
        <table class="table w-full">
            <!-- head -->
            <thead>
                <tr>
                    <th />
                    <th>Nama</th>
                    <th>Harga</th>
                    <th>Jumlah</th>
                    <th>Total Harga</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                {#each transaksi_list as t, i}
                    {#if t.midtrans_response.transaction_status != "expire" && t.midtrans_response.transaction_status != "pending"}
                        <tr>
                            <th />
                            <td>{t.product_details[0].nama}</td>
                            <td>{t.product_details[0].harga}</td>
                            <td>{t.product_details[0].jumlah}</td>
                            <td>{t.detail_harga.total_harga}</td>
                            <td>
                                <button class="btn btn-ghost">Detail</button>
                                {#if t.is_proses === ""}
                                    {#if is_btn_proses}
                                        <button class="btn loading"
                                            >loading</button
                                        >
                                    {:else}
                                        <button
                                            class="btn"
                                            on:click={() =>
                                                prosesTransaksi(t.id)}
                                            >Proses</button
                                        >
                                    {/if}
                                {:else if t.no_resi === ""}
                                    <label for="my-modal-4" class="btn"
                                        >Kirim</label
                                    >
                                {:else if t.is_selesai === ""}
                                    <button class="btn" disabled="disabled"
                                        >Sedang dikirim</button
                                    >
                                {:else}
                                    <button class="btn" disabled="disabled"
                                        >Selesai</button
                                    >
                                {/if}
                            </td>
                        </tr>
                    {/if}
                {/each}
            </tbody>
        </table>
    </div>
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}

<!-- Put this part before </body> tag -->
<input type="checkbox" id="my-modal-4" class="modal-toggle" />
<label for="my-modal-4" class="modal cursor-pointer">
    <label class="modal-box relative" for="">
        <h3 class="text-lg font-bold">Congratulations random Internet user!</h3>
        <p class="py-4">
            You've been selected for a chance to get one year of subscription to
            use Wikipedia for free!
        </p>
    </label>
</label>
