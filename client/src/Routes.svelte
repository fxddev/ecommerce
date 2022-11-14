<script>
  import { Router, Route } from "svelte-navigator";

  import Login from "./routes/Login.svelte";
  import Signup from "./routes/Signup.svelte";

  // import Home from "./routes/Home.svelte";

  import HomePenjual from "./routes/HomePenjual.svelte";
  import Chat from "./routes/Chat.svelte";
  import Produk from "./routes/Produk.svelte";
  import TambahProduct from "./routes/TambahProduct.svelte";
  import Pesanan from "./routes/Pesanan.svelte";

  import DrawerPenjual from "./components/penjual/Drawer.svelte";

  import HomePembeli from "./routes/HomePembeli.svelte";
  import ProductDetails from "./routes/ProductDetails.svelte";
  import Profile from "./routes/Profile.svelte";
  import Keranjang from "./routes/Keranjang.svelte";
  import Checkout from "./routes/Checkout.svelte";
  import DaftarTransaksi from "./routes/DaftarTransaksi.svelte";

  const get_cred = localStorage.getItem("cred");
  console.log(get_cred);

  let cred = [];
  if (get_cred !== null) {
    cred = JSON.parse(get_cred);
  }
</script>

<Router>
  <Route path="login" component={Login} />
  <Route path="signup" component={Signup} />

  <Route path="seller">
    <DrawerPenjual>
      <HomePenjual />
    </DrawerPenjual>
  </Route>
  <Route path="seller/chat">
    <DrawerPenjual>
      <Chat />
    </DrawerPenjual>
  </Route>
  <Route path="seller/produk">
    <DrawerPenjual>
      <Produk />
    </DrawerPenjual>
  </Route>
  <Route path="seller/produk/tambah">
    <DrawerPenjual>
      <TambahProduct />
    </DrawerPenjual>
  </Route>
  <Route path="seller/pesanan">
    <DrawerPenjual>
      <Pesanan />
    </DrawerPenjual>
  </Route>
  <Route path="seller/profile">
    <DrawerPenjual>
      <Profile />
    </DrawerPenjual>
  </Route>

  <!-- {#if get_cred === null || cred.data.role_id === 3} -->
  <Route path="/*">
    <Route path="/">
      <HomePembeli />
    </Route>
    <Route path=":id" component={ProductDetails} />
  </Route>
  <Route path="keranjang" component={Keranjang} />
  <!-- {/if} -->

  <Route path="profile" component={Profile} />
  <Route path="checkout" component={Checkout} />
  <Route path="transaksi-list" component={DaftarTransaksi} />
</Router>
