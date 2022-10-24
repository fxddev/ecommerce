<script>
    import axios from "axios";
    import { navigate } from "svelte-navigator";

    import Navbar from "../components/pembeli/Navbar.svelte";

    const api_url = localStorage.getItem("api_url");

    let carts = [];
    async function getCarts() {
        const get_cred = localStorage.getItem("cred");
        console.log(get_cred);

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
    getCarts();

    let selection = [];
    // async function cartSelected() {
    //     // console.log(cart);
    //     // on:click={() => cartSelected()}

    //     // console.log(selection);

    //     for (let index = 0; index < selection.length; index++) {
    //         console.log("selection[index]");
    //         console.log(selection[index]);

    //     }
    // }
    // $: console.log(selection);

    let total_harga = 0
    $: {
        // console.log(selection);
        for (let i = 0; i < selection.length; i++) {
            console.log("selection[i]");
            console.log(selection[i]);

            if (carts.length !== 0) {
                for (let y = 0; y < carts.length; y++) {
                    if (
                        parseInt(carts[y].id_keranjang) ===
                        parseInt(selection[i])
                    ) {
                        if (selection.length === 1) {
                            total_harga = parseInt(carts[y].harga)}
                        } else if (selection.length > 1) {
                        const tambah = total_harga + parseInt(carts[y].harga)
                    }
                        // console.log("carts[y");
                        // console.log(carts[y]);
                    }
                }
            }

        }
    }
</script>

<Navbar />

<div class="container__">
    {#each carts as c}
        <div class="content__">
            <div class="side__left">
                <input
                    type="checkbox"
                    class="checkbox"
                    bind:group={selection}
                    value={c.id_keranjang}
                />
            </div>
            <div class="side__right">
                <div class="card card-side bg-base-100 shadow-xl">
                    <figure>
                        <img
                            src="https://placeimg.com/200/280/arch"
                            alt="Movie"
                        />
                    </figure>
                    <div class="card-body">
                        <h2 class="card-title">{c.nama_product}</h2>
                        <p>{c.harga}</p>
                        <div class="card-actions justify-end">
                            <button class="btn btn-primary">{c.jumlah}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/each}
</div>

<style>
    .container__ .content__ {
        display: flex;
    }
</style>
