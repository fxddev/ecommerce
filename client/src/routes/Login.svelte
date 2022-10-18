<script>
  import axios from "axios";
  import { navigate } from "svelte-navigator";

  //   import { Drawer } from "../store/MyWritableStore";

  const api_url = localStorage.getItem("api_url");

  let role_selected = "";
  const get_current_url = window.location.href;
  console.log(get_current_url);

  //   https://www.geeksforgeeks.org/how-to-get-url-parameters-using-javascript/
  let paramString = get_current_url.split("?")[1];
  let queryString = new URLSearchParams(paramString);
  for (let pair of queryString.entries()) {
    // console.log("Key is:" + pair[0]);
    role_selected = pair[0];
  }

  const get_cred = localStorage.getItem("cred");
  //   console.log(get_cred);
  if (get_cred !== null) {
    navigate(`/`, { replace: true });
  }

  async function handleRole(role) {
    role_selected = role;
    navigate(`/login?${role}`, { replace: true });
  }

  let email, password;

  async function handleLogin() {
    // Drawer.update((sendValue) => true);

    let role_id;
    if (role_selected === "seller") {
      role_id = 2;
    } else {
      role_id = 3;
    }

    const payload = { email: email, password: password, role_id: role_id };

    var data = JSON.stringify(payload);

    var config = {
      method: "post",
      url: `${api_url}/auth/login`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      const resp = await axios(config);
      const data = await resp.data;
      console.log(data);

      const array = {
        data: data.data,
        token: data.token,
      };

      localStorage.setItem("cred", JSON.stringify(array));

      if (parseInt(role_id) === 2) {
        navigate(`/seller`, { replace: true });
      } else if (parseInt(role_id) === 3) {
        navigate(`/`, { replace: true });
      }
    } catch (error) {
      console.error(`Axios error..: ${error}`);
    }
  }

  function handleSignup() {
    navigate(`/signup`, { replace: true });
  }
</script>

{#if role_selected === ""}
  <button class="btn" on:click={() => handleRole("seller")}
    >Login Sebagai Seller</button
  >
  <button class="btn" on:click={() => handleRole("customer")}
    >Login Sebagai Customer</button
  >
{:else}
  <div>
    <input
      type="email"
      placeholder="email here"
      class="input w-full max-w-xs"
      bind:value={email}
    />
    <input
      type="password"
      placeholder="password here"
      class="input w-full max-w-xs"
      bind:value={password}
    />
    <button class="btn" on:click={() => handleLogin()}>Login</button>
    <button class="btn" on:click={() => handleSignup()}>Signup</button>
  </div>
{/if}
