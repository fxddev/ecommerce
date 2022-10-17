<script>
  import { Link } from "svelte-navigator";

  import "../../styles/components/Penjual/Drawer.css";

  // import { Drawer } from "../../store/MyWritableStore";

  const get_cred = localStorage.getItem("cred");
  //   console.log(get_cred);

  // Drawer.subscribe((getValue) => {
  //   console.log("trigger reload " + getValue);
  // });
</script>

<div class="drawer">
  <input id="my-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
    <!-- Page content here -->
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
      <!-- Sidebar content here -->
      <li><Link to="/">Home</Link></li>
      <li><Link to="/chat">Chat</Link></li>
      <li><Link to="/produk">Produk</Link></li>
      <li><Link to="/pesanan">Pesanan</Link></li>
    </ul>
  </div>
</div>
