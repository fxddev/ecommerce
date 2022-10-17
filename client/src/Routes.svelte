<script>
  import { Router, Route } from "svelte-navigator";

  // const get_cred = localStorage.getItem("cred");
  //   console.log(get_cred);

  import Login from "./routes/Login.svelte";
  import Signup from "./routes/Signup.svelte";

  import Drawer from "./components/penjual/Drawer.svelte";

  import Home from "./routes/Home.svelte";
  import Chat from "./routes/Chat.svelte";
  import Produk from "./routes/Produk.svelte";
  import Pesanan from "./routes/Pesanan.svelte";

  import HomePembeli from "./routes/HomePembeli.svelte";
  import ProductDetails from "./routes/ProductDetails.svelte";
</script>

<Router>
  <!-- <Drawer> -->
  <!-- 
    <Route path="signup" component={Signup} /> -->

  <!-- <Route path="/"> -->
  <!-- <Home /> -->
  <!-- </Route> -->
  <!-- <Route path="chat" component={Chat} />
    <Route path="produk" component={Produk} />
    <Route path="pesanan" component={Pesanan} /> -->
  <!-- </Drawer> -->

  <!-- Pembeli -->
  <!-- <Route path="/">
    <HomePembeli />
  </Route> -->
  <Route path="/*">
    <Route path="/">
      <HomePembeli />
    </Route>
    <Route path=":id" component={ProductDetails} />
  </Route>

  <Route path="login" component={Login} />
  <Route path="signup" component={Signup} />
</Router>
