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

    // https://svelte.dev/repl/b17c13d4f1bb40799ccf09e0841ddd90?version=3.51.0
    let avatar, fileinput;
    function onFileSelected(e) {
        let image = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = (e) => {
            avatar = e.target.result;
        };
    }

    let nama, harga, deskripsi, kondisi = "Baru", min_pem, status = true, stock, berat;
    async function addProduct() {
        // console.log("avatar");
        // console.log(avatar);
        // console.log("fileinput");
        // console.log(fileinput);

        // var file = document.getElementById("imgProduct");
        // console.log(file.files[0]);

        // console.log("kondisi");
        // console.log(kondisi);
        // console.log("status");
        // console.log(status);

        const data = cred.data;
        const id = data.id;
        var payload = JSON.stringify({
            nama: nama,
            img: "https://pma-mysql-addon-clevercloud-customers.services.clever-cloud.com/sql",
            harga: harga.toString(),
            deskripsi: deskripsi,
            kondisi: kondisi.toString(),
            minimum_pembelian: parseInt(min_pem),
            status: status.toString(),
            stok: stock.toString(),
            berat: berat.toString(),
            id_penjual: parseInt(id),
        });
        // console.log(payload);

        var config = {
            method: "post",
            url: `${api_url}/product/tambah`,
            headers: {
                "Content-Type": "application/json",
            },
            data: payload,
        };

        try {
            const resp = await axios(config);
            const data = await resp.data;
            console.log(data);

            navigate(`/seller/produk`, { replace: true });
        } catch (error) {
            console.error(`Axios error..: ${error}`);
        }
    }
</script>

<div class="container__">
    <input
        type="text"
        placeholder="Nama here"
        class="input w-full max-w-xs"
        bind:value={nama}
    />

    <div id="app">
        <h1>Upload Image</h1>

        {#if avatar}
            <img class="avatar" src={avatar} alt="d" />
        {:else}
            <img
                class="avatar"
                src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png"
                alt=""
            />
        {/if}
        <img
            class="upload"
            src="https://static.thenounproject.com/png/625182-200.png"
            alt=""
            on:click={() => {
                fileinput.click();
            }}
        />
        <div
            class="chan"
            on:click={() => {
                fileinput.click();
            }}
        >
            Choose Image
        </div>
        <input
            id="imgProduct"
            style="display:none"
            type="file"
            accept=".jpg, .jpeg, .png"
            on:change={(e) => onFileSelected(e)}
            bind:this={fileinput}
        />
    </div>

    <input
        type="number"
        placeholder="Harga here"
        class="input w-full max-w-xs"
        bind:value={harga}
    />
    <input
        type="text"
        placeholder="Desc here"
        class="input w-full max-w-xs"
        bind:value={deskripsi}
    />
    <!-- https://svelte.dev/tutorial/group-inputs -->
    <div>
        Baru<input
            type="radio"
            name="radio-1"
            class="radio"
            bind:group={kondisi}
            value="Baru"
            checked
        />
        Bekas<input
            type="radio"
            name="radio-1"
            class="radio"
            bind:group={kondisi}
            value="Bekas"
        />
    </div>
    <input
        type="number"
        placeholder="minimum_pembelian here"
        class="input w-full max-w-xs"
        bind:value={min_pem}
    />
    Status <input type="checkbox" class="toggle" bind:checked={status} />
    <input
        type="text"
        placeholder="stok here"
        class="input w-full max-w-xs"
        bind:value={stock}
    />
    <input
        type="text"
        placeholder="berat here"
        class="input w-full max-w-xs"
        bind:value={berat}
    />

    <button class="btn" on:click={() => addProduct()}>Tambah</button>
</div>

<style>
    #app {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-flow: column;
    }

    .upload {
        display: flex;
        height: 50px;
        width: 50px;
        cursor: pointer;
    }
    .avatar {
        display: flex;
        height: 200px;
        width: 200px;
    }

    .container__ {
        display: flex;
        flex-direction: column;
    }
</style>
