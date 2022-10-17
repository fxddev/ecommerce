<script>
  import axios from "axios";
  import { Link } from "svelte-navigator";

  import { productData } from "../store/MyWritableStore";

  import ProductDetails from "./ProductDetails.svelte";

//   import dotenv from 'dotenv';

// dotenv.config();
  console.log(process.env.JWT_SECRET);

  let products = [];
  async function getProducts() {
    // Drawer.update((sendValue) => true);

    const urlnya = "https://8003-fxddev-ecommerce-ap36jylnyck.ws-us71.gitpod.io/products"
    var config = {
      method: "get",
      url: urlnya,
    };

    try {
      const resp = await axios(config);
      const data = await resp.data;
      console.log(data);

      products = data.data;
      console.log(urlnya);
    } catch (error) {
      console.error(`Axios error..: ${error}`);
    }
  }

  getProducts();

  function passingProductDataHandle(index) {
    productData.update((sendValue) => products[index]);
  }
</script>

<div>
  {#each products as p, i}
    <div class="card card-compact w-96 bg-base-100 shadow-xl">
      <figure>
        <img src="https://placeimg.com/400/225/arch" alt="Shoes" />
      </figure>
      <div class="card-body">
        <h2 class="card-title">{p.nama}</h2>
        <p>{p.harga}</p>
        <div class="card-actions justify-end">
          <Link to={p.nama} on:click={() => passingProductDataHandle(i)}
            >Buy Now</Link
          >
        </div>
      </div>
    </div>
  {/each}
</div>
