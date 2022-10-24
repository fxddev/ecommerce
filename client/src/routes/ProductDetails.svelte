<script>
  import axios from "axios";
  import { navigate } from "svelte-navigator";

  import { productData } from "../store/MyWritableStore";

  export let id;

  const api_url = localStorage.getItem("api_url");

  let product_details = {};
  productData.subscribe((value) => {
    console.log(value);
    product_details = value;
  });

  async function buyHandle() {
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
        id_product: parseInt(product_details.id),
        id_pembeli: parseInt(id_pembeli),
        jumlah: "1",
      };
      var payload = JSON.stringify(obj);

      var config = {
        method: "post",
        url: `${api_url}/keranjang/tambah`,
        headers: {
          "Content-Type": "application/json",
        },
        data: payload,
      };
      try {
        const resp = await axios(config);
        const data = await resp.data;
        console.log(data);

        navigate(`/keranjang`, { replace: true });
      } catch (error) {
        console.error(`Axios error..: ${error}`);
      }
    }
  }
</script>

<div>
  {product_details.img}
  {product_details.nama}
  Rp.{product_details.harga}
  {product_details.deskripsi}

  <button class="btn" on:click={() => buyHandle()}>buy</button>
</div>
