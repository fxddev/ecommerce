<script>
  import { Link } from "svelte-navigator";

  import "../../styles/components/Penjual/Drawer.css";
  import Navbar from "../pembeli/Navbar.svelte";

  // import { Drawer } from "../../store/MyWritableStore";

  const get_cred = localStorage.getItem("cred");
  //   console.log(get_cred);

  // Drawer.subscribe((getValue) => {
  //   console.log("trigger reload " + getValue);
  // });

  function handleLogOut() {
    localStorage.removeItem("cred");
    location.reload();
  }
</script>

<Navbar />

<div class="drawer drawer-mobile">
  <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col items-center justify-center">
    <!-- Page content here -->
    <label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden"
      >Open drawer</label
    >
    <div>
      <slot />
    </div>
  </div>
  <div class="drawer-side">
    <label for="my-drawer-2" class="drawer-overlay" />
    <ul
      class="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content menu__left"
    >
      <!-- Sidebar content here -->
      <li><Link to="/seller">Home</Link></li>
      <li><Link to="/seller/chat">Chat</Link></li>
      <li><Link to="/seller/produk">Produk</Link></li>
      <li><Link to="/seller/pesanan">Pesanan</Link></li>
      <li><a href="#" on:click={() => handleLogOut()}>Logout</a></li>
    </ul>
  </div>
</div>

<!-- <div class="drawer">
  <input id="my-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
    {#if get_cred != null}
      <div class="header__sticky">
        <label for="my-drawer" class="btn btn-primary drawer-button"
          >Open drawer</label
        >
      </div>
    {/if}

    <div class="content__result">
      <slot />
    </div>
  </div>
  <div class="drawer-side">
    <label for="my-drawer" class="drawer-overlay" />
    <ul class="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
      <li><Link to="/seller">Home</Link></li>
      <li><Link to="/seller/chat">Chat</Link></li>
      <li><Link to="/seller/produk">Produk</Link></li>
      <li><Link to="/seller/pesanan">Pesanan</Link></li>
    </ul>
  </div>
</div> -->
<style>
  .menu__left {
    padding-top: 80px;
  }
</style>
