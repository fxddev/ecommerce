<script>
  import { navigate } from "svelte-navigator";

  import DrawerPenjual from "../components/penjual/Drawer.svelte";

  import "../styles/Home.css";

  let role_id;

  const get_cred = localStorage.getItem("cred");
  //   console.log(get_cred);
  if (get_cred === null) {
    navigate(`/login`, { replace: true });
  } else {
    const cred = JSON.parse(get_cred);
    role_id = cred.role_id;
    console.log(role_id);
  }
</script>

<div class="container__home">
  {#if role_id === 2}
    <DrawerPenjual>
      <div class="card w-96 bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">0</h2>
          <p>Pesanan baru!</p>
        </div>
      </div>
      <div class="card w-96 bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">0</h2>
          <p>Siap dikirim!</p>
        </div>
      </div>
      <div class="card w-96 bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">0</h2>
          <p>Pesanan dikirim!</p>
        </div>
      </div>
      <div class="card w-96 bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">0</h2>
          <p>Chat baru!</p>
        </div>
      </div>
      <div class="card w-96 bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">0</h2>
          <p>Ulasan baru!</p>
        </div>
      </div>
    </DrawerPenjual>
  {:else}{/if}
</div>
