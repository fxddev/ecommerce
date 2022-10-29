<script>
    import axios from "axios";
    import { navigate } from "svelte-navigator";
    import { each } from "svelte/internal";

    import Navbar from "../components/pembeli/Navbar.svelte";

    const api_url = localStorage.getItem("api_url");

    const get_cred = localStorage.getItem("cred");
    console.log(get_cred);

    let user_data = [];
    async function getUser() {
        if (get_cred === null) {
            navigate(`/login?customer`, { replace: true });
        } else {
            const cred = JSON.parse(get_cred);
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
                // console.log(JSON.parse(user_data.alamat));
            } catch (error) {
                console.error(`Axios error..: ${error}`);
            }
        }
    }
    getUser();

    let value_update, update_selected;
    async function handleValueUpdate(value, status) {
        console.log(`mau update ${status}`);
        value_update = value;
        update_selected = status;
    }

    let nama_penerima, no_hp, origins, alamat_lengkap
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
                alamat: alamat
            };
        } else if (update_selected === "email") {
            arr = {
                id: parseInt(id),
                role_id: parseInt(role_id),
                nama: nama,
                email: value_update,
                alamat: alamat
            };
        } else if (update_selected === "alamat") {
            const arr_alamat = {
                nama_penerima: nama_penerima,
                nomor_hp: no_hp,
                origins: origins,
                alamat_lengkap: alamat_lengkap
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
                alamat: arr_alamat
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
</script>

<Navbar />
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
                            for="my-modal"
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
                            for="my-modal"
                            class="btn modal-button"
                            on:click={() => handleValueUpdate(u.email, "email")}
                            >Ubah</label
                        ></td
                    >
                </tr>
                <tr>
                    <td>Alamat</td>
                    <td>
                        {#if u.alamat.no_hp === undefined}
                            <span />
                        {/if}
                        <label
                            for="my-modal"
                            class="btn modal-button"
                            on:click={() =>
                                handleValueUpdate(u.alamat, "alamat")}
                            >Ubah</label
                        ></td
                    >
                </tr>
            </table>
        </div>
    {/each}
</div>

<input type="checkbox" id="my-modal" class="modal-toggle" />
<div class="modal">
    <div class="modal-box">
        <!-- <h3 class="font-bold text-lg">Congratulations random Internet user!</h3> -->
        <!-- <p class="py-4">
            You've been selected for a chance to get one year of subscription to
            use Wikipedia for free!
        </p> -->

        {#if update_selected === "alamat"}
            <span>Nama Penerima</span>
            <input
                type="text"
                placeholder="Type here"
                class="input w-full max-w-xs"
                bind:value={nama_penerima}
            />
            <span>Nomor HP</span>
            <input
                type="number"
                placeholder="Type here"
                class="input w-full max-w-xs"
                bind:value={no_hp}
            />
            <span>Kota/Kabupaten</span>
            <input
                type="text"
                placeholder="Type here"
                class="input w-full max-w-xs"
                bind:value={origins}
            />
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
</div>

<style>
    .container__ {
        display: flex;
    }

    .container__ .side__left {
        display: flex;
        flex-direction: column;
    }

    .container__ .side__right {
        display: flex;
    }
</style>
