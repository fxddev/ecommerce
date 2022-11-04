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
            const cred = JSON.parse(get_cred);
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

    async function getOngkirJNE() {
        console.log("destination");
        console.log(destination);

        const alamat_penjual = JSON.parse(carts[0].alamat_penjual);
        origin = alamat_penjual.origins.city_id;
        console.log("origin");
        console.log(origin);

        // const cred = JSON.parse(get_cred);
        // const data = cred.data;
        // const id_pembeli = data.id;
        // console.log("id_pembeli");
        // console.log(id_pembeli);

        // const obj = {
        //     id_pembeli: parseInt(id_pembeli),
        // };
        // var payload = JSON.stringify(obj);

        // var config = {
        //     method: "post",
        //     url: `${api_url}/keranjang`,
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     data: payload,
        // };
        // try {
        //     const resp = await axios(config);
        //     const data = await resp.data;
        //     console.log(data);

        //     // carts = data.data;
        // } catch (error) {
        //     console.error(`Axios error..: ${error}`);
        // }
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
        // console.log(ongkir);s
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
        const jumlah = parseInt(harga_barang) + parseInt(selected_kurir.value);
        total_tagihan = jumlah;
        console.log("total_tagihan");
        console.log(total_tagihan);
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
        <p>Total Tagihan : {total_tagihan}</p>
    </div>
</div>
