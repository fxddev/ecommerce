<script>
    import axios from "axios";
    import { navigate } from "svelte-navigator";

    import { cartSelected } from "../store/MyWritableStore";

    const api_url = localStorage.getItem("api_url");

    const get_cred = localStorage.getItem("cred");
    console.log(get_cred);
    const cred = JSON.parse(get_cred);

    let carts = [];
    cartSelected.subscribe((value) => {
        if (parseInt(value) != 0) {
            carts = value;
            console.log("carts");
            console.log(carts);
        }
    });

    let user_data = [];
    let alamat_lengkap_tampil = {};
    let origin = "0", destination;
    async function getAlammat() {
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

                    destination = alamat_lengkap_tampil.origins.city_id
                }
            } catch (error) {
                console.error(`Axios error..: ${error}`);
            }
        }
    }
    getAlammat();

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
                console.log(data);

                carts = data.data;
            } catch (error) {
                console.error(`Axios error..: ${error}`);
            }
        }
    }

    if (carts.length === 0) {
        getCarts();
    }

    
    async function getOngkir() {
        console.log("destination");
        console.log(destination);

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

    getOngkir();
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
        {#each carts as c}
            <div class="card card-side bg-base-100 shadow-xl">
                <figure>
                    <img src="https://placeimg.com/200/280/arch" alt="Movie" />
                </figure>
                <div class="card-body">
                    <h2 class="card-title">{c.nama_product}</h2>
                    <p>{c.jumlah} barang</p>
                    <p>Rp. {c.harga}</p>
                    <div class="card-actions justify-end">
                        <select class="select w-full max-w-xs">
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
    </div>
</div>
