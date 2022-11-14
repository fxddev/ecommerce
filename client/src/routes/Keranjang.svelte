<script>
    import axios from "axios";
    import { navigate } from "svelte-navigator";

    import { cartSelected } from "../store/MyWritableStore";

    import Navbar from "../components/pembeli/Navbar.svelte";

    const api_url = localStorage.getItem("api_url");

    const get_cred = localStorage.getItem("cred");
    console.log(get_cred);

    let carts = [];
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

                for (let index = 0; index < carts.length; index++) {
                    if (parseInt(carts[index].is_selected) === 1) {
                        cart_selected.push(carts[index]);
                    }
                }
            } catch (error) {
                console.error(`Axios error..: ${error}`);
            }
        }
    }
    getCarts();

    let cart_selected = [];

    let array_harga = [];
    let total_harga = 0;
    $: {
        // console.log(cart_selected);
        array_harga = [];

        for (let i = 0; i < cart_selected.length; i++) {
            console.log("cart_selected[i]");
            console.log(cart_selected[i]);

            if (carts.length !== 0) {
                for (let y = 0; y < carts.length; y++) {
                    if (
                        parseInt(carts[y].id_keranjang) ===
                        parseInt(cart_selected[i].id_keranjang)
                    ) {
                        array_harga.push(parseInt(carts[y].harga));
                    }
                }
            }
        }

        console.log(array_harga);
        total_harga = array_harga.reduce((accumulator, value) => {
            return accumulator + value;
        }, 0);

        console.log("total_harga");
        console.log(total_harga);
        console.log("cart_selected");
        console.log(cart_selected);
    }

    async function updateCartSelected(item) {
        console.log("item");
        console.log(item);
        console.log("end item");

        let new_is_selected = 0;
        if (parseInt(item.is_selected) === 0) {
            new_is_selected = 1;
        } else {
            new_is_selected = 0;
        }

        const cred = JSON.parse(get_cred);
        const data = cred.data;
        const id_pembeli = data.id;
        console.log("id_pembeli");
        console.log(id_pembeli);
        var payload = JSON.stringify({
            id_product: item.id_product,
            id_pembeli: id_pembeli,
            is_selected: new_is_selected,
        });

        var config = {
            method: "put",
            url: `${api_url}/keranjang/update`,
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

    function handleCheckout() {
        navigate(`/checkout`, { replace: true });
        // cartSelected.update((sendValue) => cart_selected);
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
                    bind:group={cart_selected}
                    value={c}
                    on:click={() => updateCartSelected(c)}
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

<div>
    <div>
        <span>Total Harga:</span>
        <span>{total_harga}</span>
    </div>
    <div>
        <button class="btn" on:click={() => handleCheckout()}>Beli</button>
    </div>
</div>

<style>
    .container__ .content__ {
        display: flex;
        padding-top: 80px;
    }
</style>
