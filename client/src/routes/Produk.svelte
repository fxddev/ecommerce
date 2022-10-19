<script>
    import axios from "axios";
    import { navigate } from "svelte-navigator";

    const api_url = localStorage.getItem("api_url");

    const get_cred = localStorage.getItem("cred");
    //   console.log(get_cred);

    let cred = [];
    if (get_cred === null) {
        navigate(`/login?seller`, { replace: true });
    } else {
        cred = JSON.parse(get_cred);
        const data = cred.data;
        const role_id = data.role_id;
        console.log(role_id);

        if (parseInt(role_id) === 3) {
            // jika bukan seller
            navigate(`/`, { replace: true });
        }
    }

    let product = [];
    async function getProduct() {
        var data = JSON.stringify({
            id_penjual: cred.data.id,
        });

        var config = {
            method: "post",
            url: `${api_url}/product`,
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
    <div class="overflow-x-auto w-full">
        <table class="table w-full">
            <!-- head -->
            <thead>
                <tr>
                    <th>
                        <label>
                            <input type="checkbox" class="checkbox" />
                        </label>
                    </th>
                    <th>Name</th>
                    <th>Harga</th>
                    <th>Stok</th>
                    <th>Aktif</th>
                    <th />
                </tr>
            </thead>
            <tbody>
                {#each product as p}
                    <tr>
                        <th>
                            <label>
                                <input type="checkbox" class="checkbox" />
                            </label>
                        </th>
                        <td>
                            <div class="flex items-center space-x-3">
                                <div class="avatar">
                                    <div class="mask mask-squircle w-12 h-12">
                                        <img
                                            src="https://placeimg.com/80/80/people"
                                            alt="Avatar Tailwind CSS Component"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div class="font-bold">{p.nama}</div>
                                    <div class="text-sm opacity-50">SKU:-</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            {p.harga}
                            <br />
                            <span class="badge badge-ghost badge-sm"
                                >Desktop Support Technician</span
                            >
                        </td>
                        <td>{p.stok}</td>
                        <td>
                            {#if p.status === "true"}
                                <input type="checkbox" class="toggle" checked />
                            {:else}
                                <input type="checkbox" class="toggle" />
                            {/if}
                        </td>
                        <th>
                            <button class="btn btn-ghost btn-xs">details</button
                            >
                        </th>
                    </tr>
                {/each}
            </tbody>
            <tfoot>
                <tr>
                    <th />
                    <th>Name</th>
                    <th>Harga</th>
                    <th>Stok</th>
                    <th>Aktif</th>
                    <th />
                </tr>
            </tfoot>
        </table>
    </div>
{/if}
