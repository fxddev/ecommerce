<script>
    import axios from "axios";
    import { navigate } from "svelte-navigator";
    // import { each } from "svelte/internal";

    import Navbar from "../components/pembeli/Navbar.svelte";

    const api_url = localStorage.getItem("api_url");

    const get_cred = localStorage.getItem("cred");
    console.log(get_cred);
    const cred = JSON.parse(get_cred);

    let user_data = [];
    let alamat_lengkap_tampil = {};
    async function getUser() {
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
                }
            } catch (error) {
                console.error(`Axios error..: ${error}`);
            }
        }
    }
    getUser();

    let value_update, update_selected;
    async function handleValueUpdate(value, status) {
        console.log(`mau update ${status}`);

        update_selected = status;
        if (status === "alamat") {
            getProvince();

            console.log(value);
            nama_penerima = value.nama_penerima;
            no_hp = value.nomor_hp;
            if (value.origins != undefined) {
                origins = `${value.origins.type} ${value.origins.city_name}`;
            }
            alamat_lengkap = value.alamat_lengkap;
        } else {
            value_update = value;
        }
    }

    let nama_penerima, no_hp, origins, alamat_lengkap;
    async function handleUpdateUser() {
        const cred = JSON.parse(get_cred);
        const data = cred.data;
        const id = data.id;
        const role_id = data.role_id;
        const nama = data.nama;
        const email = data.email;
        const alamat = data.alamat;

        console.log("update_selected");
        console.log(update_selected);

        console.log("value_update");
        console.log(value_update);

        let arr = {};
        if (update_selected === "nama") {
            arr = {
                id: parseInt(id),
                role_id: parseInt(role_id),
                nama: value_update,
                email: email,
                alamat: alamat,
            };
        } else if (update_selected === "email") {
            arr = {
                id: parseInt(id),
                role_id: parseInt(role_id),
                nama: nama,
                email: value_update,
                alamat: alamat,
            };
        } else if (update_selected === "alamat") {
            let origins_item = {};
            if (origins_selected.city_id === undefined) {
                origins_item = alamat_lengkap_tampil.origins;
            } else {
                origins_item = origins_selected;
            }

            let arr_alamat = {};
            if (cred.data.role_id === 2) {
                arr_alamat = {
                    nomor_hp: no_hp.toString(),
                    origins: origins_item,
                    alamat_lengkap: alamat_lengkap,
                };
            } else if (cred.data.role_id === 3) {
                arr_alamat = {
                    nama_penerima: nama_penerima,
                    nomor_hp: no_hp.toString(),
                    origins: origins_item,
                    alamat_lengkap: alamat_lengkap,
                };
            }
            // arr = {
            //     id: parseInt(id),
            //     role_id: parseInt(role_id),
            //     nama: nama,
            //     email: email,
            //     alamat: JSON.stringify(arr_alamat)
            // };
            arr = {
                id: parseInt(id),
                role_id: parseInt(role_id),
                nama: nama,
                email: email,
                alamat: arr_alamat,
            };
        }

        var payload = JSON.stringify(arr);
        console.log(payload);

        // {"id":2,"role_id":3,"nama":"Fahmi App","email":"fahmia@g.c","alamat":"[]"}

        // var data = JSON.stringify({"id":2,"role_id":3,"nama":"Fahmi App","email":"fahmia@g.c","alamat":[]});

        var config = {
            method: "put",
            url: `${api_url}/user/update`,
            headers: {
                "Content-Type": "application/json",
            },
            data: payload,
        };

        try {
            const resp = await axios(config);
            const data = await resp.data;
            console.log(data);

            getUser();
        } catch (error) {
            console.error(`Axios error..: ${error}`);
        }
    }

    let city = [];
    async function getProvince() {
        var config = {
            method: "post",
            url: `${api_url}/rajaongkir/city`,
        };

        try {
            const resp = await axios(config);
            const data = await resp.data;
            // console.log(data);

            city = data.data.rajaongkir.results;
            console.log(city);
        } catch (error) {
            console.error(`Axios error..: ${error}`);
        }
    }

    let city_search_res = [];
    async function handleSearchCity() {
        // console.log("Sedang seacrh");
        console.log(`Sedang seacrh ${origins}`);

        city_search_res = city.filter(function (c) {
            // return c.city_name.toLowerCase() == origins.toLowerCase();

            const city_name = c.city_name.toLowerCase();
            return city_name.includes(origins.toLowerCase());
            // https://svelte.dev/repl/e67e1a90ef3945ec988bf39f6a10b6b3?version=3.32.3
        });

        console.log(city_search_res);
    }

    let origins_selected = {};
    function handleOriginsUpdate(obj) {
        // console.log(obj);
        origins = `${obj.type} ${obj.city_name}`;

        origins_selected = obj;
        console.log("origins_selected");
        console.log(origins_selected);
    }
</script>

{#if cred.data.role_id === 3}
    <Navbar />
{/if}

<div class="container__">
    {#each user_data as u}
        <div class="side__left">
            <div class="avatar">
                <div class="w-24 rounded">
                    <img src="https://placeimg.com/192/192/people" />
                </div>
            </div>
            <button class="btn">Pilih Foto</button>
            <button class="btn">Ubah password</button>
        </div>
        <div class="side__right">
            <table>
                <tr>
                    <td>Nama</td>
                    <td
                        >{u.nama}
                        <label
                            for="my-modal-4"
                            class="btn modal-button"
                            on:click={() => handleValueUpdate(u.nama, "nama")}
                            >Ubah</label
                        ></td
                    >
                </tr>
                <tr>
                    <td>Email</td>
                    <td
                        >{u.email}
                        <label
                            for="my-modal-4"
                            class="btn modal-button"
                            on:click={() => handleValueUpdate(u.email, "email")}
                            >Ubah</label
                        ></td
                    >
                </tr>
                <tr>
                    <td>Alamat</td>
                    <td>
                        {#if alamat_lengkap_tampil.nomor_hp === undefined}
                            <span />
                        {:else}
                            {#if cred.data.role_id === 3}
                                <span
                                    >{alamat_lengkap_tampil.nama_penerima}</span
                                >
                            {/if}
                            <span>{alamat_lengkap_tampil.nomor_hp}</span>
                            <span>{alamat_lengkap_tampil.alamat_lengkap}</span>
                            <span
                                >{alamat_lengkap_tampil.origins.type}
                                {alamat_lengkap_tampil.origins.city_name}</span
                            >
                        {/if}
                        <label
                            for="my-modal-4"
                            class="btn modal-button"
                            on:click={() =>
                                handleValueUpdate(
                                    alamat_lengkap_tampil,
                                    "alamat"
                                )}>Ubah</label
                        ></td
                    >
                </tr>
            </table>
        </div>
    {/each}
</div>

<input type="checkbox" id="my-modal-4" class="modal-toggle" />
<label for="my-modal-4" class="modal cursor-pointer">
    <div class="modal-box relative" for="">
        <!-- <h3 class="font-bold text-lg">Congratulations random Internet user!</h3> -->
        <!-- <p class="py-4">
            You've been selected for a chance to get one year of subscription to
            use Wikipedia for free!
        </p> -->

        {#if update_selected === "alamat"}
            {#if cred.data.role_id === 3}
                <span>Nama Penerima</span>
                <input
                    type="text"
                    placeholder="Type here"
                    class="input w-full max-w-xs"
                    bind:value={nama_penerima}
                />
            {/if}
            <span>Nomor HP</span>
            <input
                type="number"
                placeholder="Type here"
                class="input w-full max-w-xs"
                bind:value={no_hp}
            />
            <div>
                <div>
                    <span>Kota/Kabupaten</span>
                    <input
                        type="text"
                        placeholder="Type here"
                        class="input w-full max-w-xs"
                        bind:value={origins}
                        on:input={() => handleSearchCity()}
                    />
                </div>
                <div>
                    {#if city_search_res.length === 0}
                        {#each city.slice(0, 6) as c}
                            <button
                                class="btn btn-outline"
                                on:click={() => handleOriginsUpdate(c)}
                                >{c.type} {c.city_name}</button
                            >
                        {/each}
                    {:else}
                        {#each city_search_res.slice(0, 6) as c}
                            <button
                                class="btn btn-outline"
                                on:click={() => handleOriginsUpdate(c)}
                                >{c.type} {c.city_name}</button
                            >
                        {/each}
                    {/if}
                </div>
            </div>

            <span>Alamat Lengkap</span>
            <input
                type="text"
                placeholder="Type here"
                class="input w-full max-w-xs"
                bind:value={alamat_lengkap}
            />
        {:else}
            <input
                type="text"
                placeholder="Type here"
                class="input w-full max-w-xs"
                bind:value={value_update}
            />
        {/if}
        <div class="modal-action">
            <label
                for="my-modal"
                class="btn"
                on:click={() => handleUpdateUser()}>Update!</label
            >
        </div>
    </div>
</label>

<style>
    .container__ {
        display: flex;
        padding-top: 80px;
    }

    .container__ .side__left {
        display: flex;
        flex-direction: column;
    }

    .container__ .side__right {
        display: flex;
    }
</style>
