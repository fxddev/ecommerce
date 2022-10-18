<script>
    import axios from "axios";
    import { navigate } from "svelte-navigator";

    const get_cred = localStorage.getItem("cred");
    console.log(get_cred);

    let cred = [];
    if (get_cred !== null) {
        cred = JSON.parse(get_cred);
    }

    let product = [];
    async function getProduct() {
        var data = JSON.stringify({
            id_penjual: cred.data.id,
        });

        var config = {
            method: "post",
            url: "http://localhost:8003/product",
            headers: {
                "Content-Type": "application/json",
            },
            data: data,
        };

        try {
            const resp = await axios(config);
            const data = await resp.data;
            console.log(data);

            product = data.data;
            console.log("product.length");
            console.log(product.length);
        } catch (error) {
            console.error(`Axios error..: ${error}`);
        }
    }

    getProduct();

    async function addProductForm() {
        navigate(`/seller/produk/tambah`, { replace: true });
    }
</script>

<button class="btn" on:click={() => addProductForm()}>Tambah</button>

{#if product.length === 0}
    Tidak ada produk
{:else}
    produknya
{/if}
