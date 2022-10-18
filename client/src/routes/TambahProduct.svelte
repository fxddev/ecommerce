<script>

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

    
    async function addProduct() {
        console.log("avatar");
        console.log(avatar);
        console.log("fileinput");
        console.log(fileinput);

        // var file = document.getElementById("imgProduct");
        // console.log(file.files[0]);

        
    }
</script>

<div>
    <input type="text" placeholder="Nama here" class="input w-full max-w-xs" />

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
    />
    <input type="text" placeholder="Desc here" class="input w-full max-w-xs" />
    <div>
        <input type="radio" name="radio-1" class="radio" checked />
        <input type="radio" name="radio-1" class="radio" />
    </div>
    <input
        type="number"
        placeholder="minimum_pembelian here"
        class="input w-full max-w-xs"
    />
    Status <input type="checkbox" class="toggle" checked />
    <input type="text" placeholder="stok here" class="input w-full max-w-xs" />
    <input type="text" placeholder="berat here" class="input w-full max-w-xs" />

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
</style>
