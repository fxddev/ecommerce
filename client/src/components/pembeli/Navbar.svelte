<script>
  import { navigate } from "svelte-navigator";

  const get_cred = localStorage.getItem("cred");
  console.log("get_cred");
  console.log(get_cred);

  let cred;
  if (get_cred !== null) {
    cred = JSON.parse(get_cred);
  }

  function handleKeranjang() {
    navigate(`/keranjang`, { replace: true });
  }

  function handleLogin() {
    navigate(`/login`, { replace: true });
  }
  function handleSignup() {
    navigate(`/signup`, { replace: true });
  }

  function handleLogOut() {
    localStorage.removeItem("cred");
    location.reload();
  }

  function handleProfile() {
    if (parseInt(cred.data.role_id) === 2) {
      navigate(`/seller/profile`, { replace: true });
    } else if (parseInt(cred.data.role_id) === 3) {
      navigate(`/profile`, { replace: true });
    }
  }

  function handleDaftarTransaksi() {
    navigate(`/transaksi-list`, { replace: true });
  }
</script>

<div class="navbar bg-base-100">
  <div class="flex-1">
    <a class="btn btn-ghost normal-case text-xl">daisyUI</a>
  </div>
  <div class="flex-none">
    {#if get_cred !== null}
      {#if cred.data.role_id === 3}
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle">
            <div class="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                /></svg
              >
              <span class="badge badge-sm indicator-item">8</span>
            </div>
          </label>
          <div
            tabindex="0"
            class="mt-3 card card-compact dropdown-content w-52 bg-base-100 shadow"
          >
            <div class="card-body">
              <span class="font-bold text-lg">8 Items</span>
              <span class="text-info">Subtotal: $999</span>
              <div class="card-actions">
                <button
                  class="btn btn-primary btn-block"
                  on:click={() => handleKeranjang()}>View cart</button
                >
              </div>
            </div>
          </div>
        </div>
      {/if}
    {/if}
    <div class="dropdown dropdown-end">
      <label tabindex="0" class="btn btn-ghost btn-circle avatar">
        <div class="w-10 rounded-full">
          <img src="https://placeimg.com/80/80/people" />
        </div>
      </label>
      <ul
        tabindex="0"
        class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
      >
        {#if get_cred === null}
          <li><a on:click={() => handleLogin()}>Login</a></li>
          <li><a on:click={() => handleSignup()}>Signup</a></li>
        {:else}
          <li>
            <a class="justify-between" on:click={() => handleProfile()}>
              Profile
            </a>
          </li>
          <li>
            <a class="justify-between" on:click={() => handleDaftarTransaksi()}>
              Daftar Transaksi
            </a>
          </li>
          <li><a>Settings</a></li>
          <li><a on:click={() => handleLogOut()}>Logout</a></li>
        {/if}
      </ul>
    </div>
  </div>
</div>

<style>
  .navbar {
    position: fixed;
    z-index: 999;
  }
</style>
