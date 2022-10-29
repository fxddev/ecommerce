<script>
    import axios from "axios";
    import { navigate } from "svelte-navigator";
    import { each } from "svelte/internal";

    import Navbar from "../components/pembeli/Navbar.svelte";

    const api_url = localStorage.getItem("api_url");

    let user_data = [];
    async function getUser() {
        const get_cred = localStorage.getItem("cred");
        console.log(get_cred);

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
            } catch (error) {
                console.error(`Axios error..: ${error}`);
            }
        }
    }
    getUser();

    let value_update
    function handleValueUpdate(value, status) {
        console.log(`mau update ${status}`);
        value_update = value

        if (status === "nama") {
            
        } else if (status === "email") {
            
        } else if (status === "alamat") {
            
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
                        <label for="my-modal" class="btn modal-button" on:click={() => handleValueUpdate(u.nama, "nama")}
                            >Ubah</label
                        ></td
                    >
                </tr>
                <tr>
                    <td>Email</td>
                    <td
                        >{u.email}
                        <label for="my-modal" class="btn modal-button" on:click={() => handleValueUpdate(u.email, "email")}
                            >Ubah</label
                        ></td
                    >
                </tr>
                <tr>
                    <td>Alamat</td>
                    <td
                        >{u.alamat}
                        <label for="my-modal" class="btn modal-button" on:click={() => handleValueUpdate(u.alamat, "alamat")}
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
        <input type="text" placeholder="Type here" class="input w-full max-w-xs" value={value_update} />
        <div class="modal-action">
            <label for="my-modal" class="btn">Yay!</label>
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
