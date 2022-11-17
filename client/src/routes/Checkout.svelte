<script>
    import axios from "axios";
    import { navigate } from "svelte-navigator";

    import { cartSelected } from "../store/MyWritableStore";

    const api_url = localStorage.getItem("api_url");

    const get_cred = localStorage.getItem("cred");
    console.log(get_cred);
    const cred = JSON.parse(get_cred);

    let carts = [];
    // cartSelected.subscribe((value) => {
    //     if (parseInt(value) != 0) {
    //         carts = value;
    //         console.log("carts");
    //         console.log(carts);
    //     }
    // });

    let user_data = [];
    let alamat_lengkap_tampil = {};
    let origin = "0",
        destination = "0";
    async function getAlamat() {
        if (get_cred === null) {
            navigate(`/login?customer`, { replace: true });
        } else {
            const data = cred.data;
            const id = data.id;
            const role_id = data.role_id;
            console.log("id");
            console.log(id);

            var payload = JSON.stringify({
                id: parseInt(id),
                role_id: parseInt(role_id),
            });

            var config = {
                method: "post",
                url: `${api_url}/user`,
                headers: {
                    "Content-Type": "application/json",
                },
                data: payload,
            };

            try {
                const resp = await axios(config);
                const data = await resp.data;
                console.log(data);

                user_data = data.data;
                console.log(user_data);
                // console.log(user_data[0].alamat);
                // console.log(JSON.parse(user_data[0].alamat));
                if (user_data[0].alamat != "") {
                    alamat_lengkap_tampil = JSON.parse(user_data[0].alamat);
                    console.log(alamat_lengkap_tampil);

                    destination = alamat_lengkap_tampil.origins.city_id;
                }
            } catch (error) {
                console.error(`Axios error..: ${error}`);
            }
        }
    }
    getAlamat();

    async function getCarts() {
        if (get_cred === null) {
            navigate(`/login?customer`, { replace: true });
        } else {
            const data = cred.data;
            const id_pembeli = data.id;
            console.log("id_pembeli");
            console.log(id_pembeli);

            const obj = {
                id_pembeli: parseInt(id_pembeli),
            };
            var payload = JSON.stringify(obj);

            var config = {
                method: "post",
                url: `${api_url}/keranjang`,
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

                const item = data.data;
                for (let index = 0; index < item.length; index++) {
                    console.log("item[index].is_selected");
                    console.log(item[index].is_selected);
                    if (parseInt(item[index].is_selected) === 1) {
                        carts.push(item[index]);
                        console.log("item[index");
                        console.log(item[index]);
                    }
                }
                console.log("carts");
                console.log(carts);
                // carts = data.data;

                return carts;
            } catch (error) {
                console.error(`Axios error..: ${error}`);
            }
        }
    }

    // if (carts.length === 0) {
    //     console.log('sedang getCarts()');
    //     getCarts();
    // }

    // https://svelte.dev/tutorial/await-blocks
    let promise_get_carts = getCarts();

    let ongkir = [];
    async function getOngkir(kurir) {
        console.log("destination");
        console.log(destination);

        const alamat_penjual = JSON.parse(carts[0].alamat_penjual);
        origin = alamat_penjual.origins.city_id;
        console.log("origin");
        console.log(origin);

        // getOngkirJNE()

        // const cred = JSON.parse(get_cred);
        // const data = cred.data;
        // const id_pembeli = data.id;
        // console.log("id_pembeli");
        // console.log(id_pembeli);

        const obj = {
            origin: origin.toString(),
            destination: destination.toString(),
            weight: weight.toString(),
            courier: kurir,
        };
        var payload = JSON.stringify(obj);

        var config = {
            method: "post",
            url: `${api_url}/rajaongkir/cost`,
            headers: {
                "Content-Type": "application/json",
            },
            data: payload,
        };
        try {
            const resp = await axios(config);
            const data = await resp.data;
            console.log(data);

            const res = data.data.rajaongkir.results;
            console.log("res");
            console.log(res);
            console.log("res.length");
            console.log(res.length);
            for (let index = 0; index < res.length; index++) {
                const costs = res[index].costs;
                // console.log("costs");
                // console.log(costs);
                for (let j = 0; j < costs.length; j++) {
                    const obj = {
                        code: res[index].code,
                        name: res[index].name,
                        service: costs[j].service,
                        description: costs[j].description,
                        value: costs[j].cost[0].value,
                        etd: costs[j].cost[0].etd,
                        note: costs[j].cost[0].note,
                    };
                    ongkir.push(obj);
                }

                // ongkir.push(res[index]);
                // console.log("res[index]");
                // console.log(res[index]);
                console.log("ongkir");
                console.log(ongkir);
            }

            return res;
        } catch (error) {
            console.error(`Axios error..: ${error}`);
        }
    }

    // getOngkir();

    let weight;
    let promise_get_ongkir;
    async function handleKurir(value) {
        ongkir = [];

        weight = value.berat;
        console.log("weight");
        console.log(weight);
        // console.log("value");
        // console.log(value);

        // if (ongkir.length == 0) {
        promise_get_ongkir = getOngkir("jne");
        console.log("promise_get_ongkir");
        console.log(promise_get_ongkir);
        // }
        // console.log("ongkir");
        // console.log(ongkir);
    }

    let selected_kurir = [];

    let total_tagihan = 0;
    $: {
        let harga_barang;
        for (let i = 0; i < carts.length; i++) {
            harga_barang = carts[i].harga;
            console.log("harga_barang");
            console.log(harga_barang);
        }
        if (selected_kurir.value !== undefined) {
            const jumlah =
                parseInt(harga_barang) + parseInt(selected_kurir.value);
            total_tagihan = jumlah;
            console.log("total_tagihan");
            console.log(total_tagihan);
        }
    }

    let no_invoice = "";
    async function getInvoice() {
        var data = "";

        var config = {
            method: "post",
            url: `${api_url}/pesanan/create-invoice`,
            headers: {},
            data: data,
        };

        try {
            const resp = await axios(config);
            const data = await resp.data;
            // console.log(data);

            no_invoice = data.message;
        } catch (error) {
            console.error(`Axios error..: ${error}`);
        }
    }

    let midtrans_response = {};
    async function bayarBankMidtrans() {
        const data = cred.data;
        const email = data.email;
        const no_hp = alamat_lengkap_tampil.nomor_hp;
        console.log("no_hp");
        console.log(no_hp);

        let item_details = [];
        for (let i = 0; i < carts.length; i++) {
            const obj = {
                id: carts[i].id_product.toString(),
                price: parseInt(carts[i].harga),
                quantity: parseInt(carts[i].jumlah),
                name: carts[i].nama_product,
            };
            item_details.push(obj);
        }

        console.log("selected_kurir");
        console.log(selected_kurir);
        const obj_kurir = {
            code: selected_kurir.code,
            price: parseInt(selected_kurir.value),
            quantity: 1,
            name: `${selected_kurir.code.toUpperCase()} ${
                selected_kurir.service
            }`,
        };
        item_details.push(obj_kurir);

        const last_no_hp_sub = no_hp.length - 6;
        console.log("last_no_hp_sub");
        console.log(last_no_hp_sub);
        const va_number = no_hp.substr(last_no_hp_sub, no_hp.length);
        console.log("va_number");
        console.log(va_number);
        const obj = {
            payment_type: "bank_transfer",
            transaction_details: {
                gross_amount: parseInt(total_tagihan),
                order_id: no_invoice.toString(),
            },
            customer_details: {
                email: email,
                first_name: alamat_lengkap_tampil.nama_penerima,
                last_name: "App",
                phone: no_hp,
            },
            item_details: item_details,
            bank_transfer: { bank: "bri", va_number: va_number },
        };

        var payload = JSON.stringify(obj);
        console.log("payload bayarBankMidtrans");
        console.log(payload);

        var config = {
            method: "post",
            url: `${api_url}/midtrans/bayar`,
            headers: {
                "Content-Type": "application/json",
            },
            data: payload,
        };

        try {
            const resp = await axios(config);
            const data = await resp.data;
            // console.log(data);

            midtrans_response = data.data;
            console.log("midtrans_response");
            console.log(midtrans_response);
        } catch (error) {
            console.error(`Axios error..: ${error}`);
        }
    }

    async function createPesanan() {
        const data = cred.data;
        const id_pembeli = data.id;
        console.log("id_pembeli");
        console.log(id_pembeli);

        let product_details = [];
        for (let i = 0; i < carts.length; i++) {
            const obj = {
                id: carts[i].id_product.toString(),
                nama: carts[i].nama_product,
                harga: carts[i].harga,
                jumlah: carts[i].jumlah,
            };
            product_details.push(obj);
        }

        console.log("selected_kurir");
        console.log(selected_kurir);
        let kurir = {};
        const obj_kurir = {
            name: `${selected_kurir.code.toUpperCase()} ${
                selected_kurir.service
            }`,
            value: selected_kurir.value.toString(),
            etd: selected_kurir.etd,
        };
        kurir = obj_kurir;

        let harga_barang = "";
        for (let j = 0; j < carts.length; j++) {
            if (carts.length === 1) {
                harga_barang = carts[j].harga;
            }
        }

        const obj = {
            id_pembeli: parseInt(id_pembeli),
            no_invoice: no_invoice,
            product_details: product_details,
            kurir: kurir,
            alamat_tujuan: alamat_lengkap_tampil,
            detail_harga: {
                harga_barang: harga_barang,
                harga_kurir: selected_kurir.value.toString(),
                total_harga: total_tagihan.toString(),
            },
            midtrans_response: midtrans_response,
            no_resi: "",
        };

        var payload = JSON.stringify(obj);
        console.log("payload createPesanan");
        console.log(payload);

        var config = {
            method: "post",
            url: `${api_url}/pesanan/create`,
            headers: {
                "Content-Type": "application/json",
            },
            data: payload,
        };

        try {
            const resp = await axios(config);
            const data = await resp.data;
            console.log(data);
        } catch (error) {
            console.error(`Axios error..: ${error}`);
        }
    }

    // const b = {
    //     payment_type: "bank_transfer",
    //     transaction_details: {
    //         gross_amount: 119000,
    //         order_id: "INV/4102022/IDP/3",
    //     },
    //     customer_details: {
    //         email: "fahmia@g.c",
    //         first_name: "Fahmi Daud Abdillah",
    //         last_name: "App",
    //         phone: "628515679355",
    //     },
    //     item_details: [
    //         { id: "5", price: 110000, quantity: 1, name: "Kertas" },
    //         { code: "jne", price: 9000, quantity: 1, name: "JNE REG" },
    //     ],
    //     bank_transfer: { bank: "bri", va_number: "679355" },
    // };

    // const cP = {
    //     id_pembeli: 2,
    //     no_invoice: "INV/4102022/IDP/3",
    //     product_details: [
    //         { id: "5", nama: "Kertas", harga: "110000", jumlah: "1" },
    //     ],
    //     kurir: { name: "JNE REG", value: "9000", etd: "1-2" },
    //     alamat_tujuan: {
    //         nama_penerima: "Fahmi Daud Abdillah",
    //         nomor_hp: "628515679355",
    //         origins: {
    //             city_id: "54",
    //             province_id: "9",
    //             province: "Jawa Barat",
    //             type: "Kabupaten",
    //             city_name: "Bekasi",
    //             postal_code: "17837",
    //         },
    //         alamat_lengkap: "Perum wali barokah blok d 10 17510",
    //     },
    //     detail_harga: {
    //         harga_barang: "110000",
    //         harga_kurir: "9000",
    //         total_harga: "119000",
    //     },
    //     midtrans_response: {},
    //     no_resi: "",
    // };

    async function deleteKeranjang() {
        let array = [];
        for (let i = 0; i < carts.length; i++) {
            const obj = {
                id: parseInt(carts[i].id_keranjang),
            };
            array.push(obj);
        }

        console.log("array dari keranjang yg akan dihapus");
        console.log(array);

        var payload = JSON.stringify(array);

        var config = {
            method: "post",
            url: `${api_url}/keranjang/deletes`,
            headers: {
                "Content-Type": "application/json",
            },
            data: payload,
        };

        try {
            const resp = await axios(config);
            const data = await resp.data;
            console.log(data);
        } catch (error) {
            console.error(`Axios error..: ${error}`);
        }
    }

    let is_buat_psnan = false;
    let msg_btn_psn = "Buat Pesanan";
    async function buatPesanan() {
        is_buat_psnan = true;
        await getInvoice();
        await bayarBankMidtrans();
        await createPesanan();
        await deleteKeranjang();
        console.log("no_invoice");
        console.log(no_invoice);

        is_buat_psnan = false;
        msg_btn_psn = "Sukses";

        navigate(`/transaksi-list`, { replace: true });
    }
</script>

<div>
    <div>
        <p>Alamat Pengiriman</p>
        <p>{alamat_lengkap_tampil.nama_penerima}</p>
        <p>{alamat_lengkap_tampil.nomor_hp}</p>
        <p>{alamat_lengkap_tampil.alamat_lengkap}</p>
        {#if alamat_lengkap_tampil.origins != undefined}
            <p>
                {alamat_lengkap_tampil.origins.type}
                {alamat_lengkap_tampil.origins.city_name}
            </p>
        {/if}
    </div>
    <div>
        {#await promise_get_carts}
            <p>...waiting</p>
        {:then items_carts}
            {#each items_carts as c}
                <div class="card card-side bg-base-100 shadow-xl">
                    <figure>
                        <img
                            src="https://placeimg.com/200/280/arch"
                            alt="Movie"
                        />
                    </figure>
                    <div class="card-body">
                        <h2 class="card-title">{c.nama_product}</h2>
                        <p>{c.jumlah} barang</p>
                        <p>Rp. {c.harga}</p>
                        <div class="card-actions justify-end">
                            <select
                                class="select w-full max-w-xs"
                                on:click={() => handleKurir(c)}
                                bind:value={selected_kurir}
                            >
                                <option disabled selected>Pengiriman</option>
                                {#await promise_get_ongkir}
                                    <p>...waiting</p>
                                {:then item_ongkir}
                                    {#each ongkir as o}
                                        <option value={o}
                                            >{o.code}
                                            {o.service} estimasi tiba hingga {o.etd}
                                            hari Rp.{o.value}</option
                                        >
                                    {/each}
                                {:catch error}
                                    <p style="color: red">{error.message}</p>
                                {/await}
                            </select>
                        </div>
                    </div>
                </div>
            {/each}
        {:catch error}
            <p style="color: red">{error.message}</p>
        {/await}

        {selected_kurir ? selected_kurir.service : "[waiting...]"}
    </div>

    <div>
        <h3>Ringkasan belanja</h3>
        {#await promise_get_carts}
            <p>...waiting</p>
        {:then items_carts}
            {#each items_carts as c}
                <p>Total Harga ({items_carts.length} Produk) : {c.harga}</p>
            {/each}
        {:catch error}
            <p style="color: red">{error.message}</p>
        {/await}
        <p>
            Total Ongkos Kirim :
            {#if selected_kurir.code === undefined}
                <span>0</span>
            {:else}
                {selected_kurir.value}
            {/if}
        </p>
        <p>
            Total Tagihan :
            {#if total_tagihan !== NaN}
                {total_tagihan}
            {/if}
        </p>
        {#if total_tagihan === 0}
            <button class="btn" disabled="disabled">Buat Pesanan</button>
        {:else if is_buat_psnan}
            <button class="btn loading">loading</button>
        {:else}
            <button class="btn" on:click={() => buatPesanan()}
                >{msg_btn_psn}</button
            >
        {/if}
    </div>
</div>
