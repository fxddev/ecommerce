<script>
    import axios from "axios";
    import { navigate } from "svelte-navigator";

    import { cartSelected } from "../store/MyWritableStore";

    const api_url = localStorage.getItem("api_url");

    const get_cred = localStorage.getItem("cred");
    console.log(get_cred);

    let carts = [];
    cartSelected.subscribe((value) => {
        if (parseInt(value) != 0) {
            carts = value;
            console.log("carts");
            console.log(carts);
        }
    });

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
</script>

<div>
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
