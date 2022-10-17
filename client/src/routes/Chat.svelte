<script>
  import { navigate } from "svelte-navigator";

  import DrawerPenjual from "../components/penjual/Drawer.svelte";

  //   import "../styles/Chat.css";

  const get_cred = localStorage.getItem("cred");
  //   console.log(get_cred);
  if (get_cred === null) {
    navigate(`/login`, { replace: true });
  }

  const cred = JSON.parse(get_cred);
  const role_id = cred.role_id;
  console.log(role_id);
</script>

<div class="container__home">
  {#if role_id === 2}
    <DrawerPenjual>chat belum tersedia</DrawerPenjual>
  {:else}{/if}
</div>
