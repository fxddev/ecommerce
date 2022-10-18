<script>
  import { navigate } from "svelte-navigator";

  import DrawerPenjual from "../components/penjual/Drawer.svelte";

  //   import "../styles/Chat.css";

  const get_cred = localStorage.getItem("cred");
  //   console.log(get_cred);

  let cred = [];
  if (get_cred === null) {
    navigate(`/login?seller`, { replace: true });
  } else {
    cred = JSON.parse(get_cred);
    const data = cred.data;
    const role_id = data.role_id;
    console.log(role_id);

    if (parseInt(role_id) === 3) {
      // jika bukan seller
      navigate(`/`, { replace: true });
    }
  }
</script>

<p>chat belum tersedia</p>

<!-- <div class="container__home">
  {#if role_id === 2}
    <DrawerPenjual>chat belum tersedia</DrawerPenjual>
  {:else}{/if}
</div> -->
