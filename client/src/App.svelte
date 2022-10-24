<script>
  // import outes from "./components/penjual/Drawer.svelte";

  localStorage.setItem("api_url", "https://8003-fxddev-ecommerce-shq177a5tts.ws-us72.gitpod.io");

  import Routes from "./Routes.svelte";
</script>

<main>
  <Routes />
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
