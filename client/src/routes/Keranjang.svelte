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
</script>

<Navbar />

<div class="container__">
    {#each carts as c}
        <div class="content__">
            <div class="side__left">
                <input type="checkbox" checked="checked" class="checkbox" />
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
