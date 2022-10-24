<script>
    import axios from "axios";

    import Navbar from "../components/pembeli/Navbar.svelte";

  const api_url = localStorage.getItem("api_url");

    async function getProducts() {
    // Drawer.update((sendValue) => true);

    var config = {
      method: "get",
      url: `${api_url}/products`, 
    };

    try {
      const resp = await axios(config);
      const data = await resp.data;
      console.log(data);
      
    } catch (error) {
      console.error(`Axios error..: ${error}`);
    }
  }
</script>

<Navbar />
<div class="container__">
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
        <div class="side__left">
            <span>Nama</span>
            <span>Email</span>
            <span>Alamat</span>
        </div>
        <div class="side__right">            
            <span>Nama</span>
            <span>Email</span>
            <span>Alamat</span>
        </div>
    </div>
</div>

<style>
    .container__{
        display: flex;
    }

    .container__ .side__left{
        display: flex;
        flex-direction: column;
    }

    .container__ .side__right{
        display: flex;
    }

    .container__ .side__right .side__left{
        display: flex;
        flex-direction: column;
    }
    
    .container__ .side__right .side__right{
        display: flex;
        flex-direction: column;
    }
</style>