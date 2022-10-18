<script>
  import axios from "axios";
  import { Link, navigate } from "svelte-navigator";

  import { productData } from "../store/MyWritableStore";

  import Navbar from "../components/pembeli/Navbar.svelte";

  import ProductDetails from "./ProductDetails.svelte";

  const api_url = localStorage.getItem("api_url");

  const get_cred = localStorage.getItem("cred");

  let products = [];
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

      products = data.data;
      console.log("products.lengt");
      console.log(products.length);
    } catch (error) {
      console.error(`Axios error..: ${error}`);
    }
  }

  getProducts();

  function passingProductDataHandle(index) {
    productData.update((sendValue) => products[index]);
  }

</script>

<Navbar />
<div>
  {#if products.length === 0}
    tidak ada product
  {:else}
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
  {/if}
</div>
