<script>
  import axios from "axios";
  import { navigate } from "svelte-navigator";

  import { productData } from "../store/MyWritableStore";

  export let id;

  let product_details = {};
  productData.subscribe((value) => {
    console.log(value);
    product_details = value;
  });

  function buyHanlde() {
    const get_cred = localStorage.getItem("cred");
    console.log(get_cred);

    if (get_cred === null) {
      navigate(`/login?customer`, { replace: true });
    } else {
      const payload = {
        id_product: 2,
        id_pembeli: 1,
        jumlah: "1",
        created_at: "2416513757",
        update_at: "2416513757",
      };
      var data = JSON.stringify(payload);

      var config = {
        method: "post",
        url: "http://localhost:8003/keranjang/tambah",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
    }
  }
</script>

<div>
  {product_details.img}
  {product_details.nama}
  Rp.{product_details.harga}
  {product_details.deskripsi}

  <button class="btn" on:click={() => buyHanlde()}>buy</button>
</div>
