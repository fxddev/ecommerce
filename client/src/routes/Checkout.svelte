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

    async function getOngkir() {
        console.log("destination");
        console.log(destination);
        
        const alamat_penjual = JSON.parse(carts[0].alamat_penjual)
        origin = alamat_penjual.origins.city_id
        console.log("origin");
        console.log(origin);        

        getOngkirJNE()

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

    async function getOngkirJNE() {
        console.log("destination");
        console.log(destination);
        
        const alamat_penjual = JSON.parse(carts[0].alamat_penjual)
        origin = alamat_penjual.origins.city_id
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
 
    let weight
    async function handleKurir(value) {

        weight = value.berat
        console.log("weight");
        console.log(weight);
        // console.log("value");
        // console.log(value);

        getOngkir();
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
                            >
                                <option disabled selected>Pengiriman</option>
                                <option>Homer</option>
                                <option>Marge</option>
                                <option>Bart</option>
                                <option>Lisa</option>
                                <option>Maggie</option>
                            </select>
                        </div>
                    </div>
                </div>
            {/each}
        {:catch error}
            <p style="color: red">{error.message}</p>
        {/await}
    </div>
</div>
