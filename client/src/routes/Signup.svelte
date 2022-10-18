<script>
  import axios from "axios";
  import { navigate } from "svelte-navigator";

  const api_url = localStorage.getItem("api_url");

  let role_selected = "";
  const get_current_url = window.location.href;
  console.log(get_current_url);

  //   https://www.geeksforgeeks.org/how-to-get-url-parameters-using-javascript/
  let paramString = get_current_url.split("?")[1];
  console.log("paramString");
  console.log(paramString);
  let queryString = new URLSearchParams(paramString);
  console.log("queryString");
  console.log(queryString);
  for (let pair of queryString.entries()) {
    // console.log("Key is:" + pair[0]);
    role_selected = pair[0];
    console.log("role_selected");
    console.log(role_selected);
  }

  const get_cred = localStorage.getItem("cred");
  //   console.log(get_cred);
  if (get_cred !== null) {
    navigate(`/`, { replace: true });
  }

  async function handleRole(role) {
    role_selected = role;
    navigate(`/signup?${role}`, { replace: true });
  }

  let nama, email, password;

  async function handleSignUp() {
    let role_id;
    if (role_selected === "seller") {
      role_id = 2;
    } else {
      role_id = 3;
    }

    const payload = {
      nama: nama,
      email: email,
      password: password,
      alamat: "",
      role_id: role_id,
      created_at: "",
      update_at: "",
    };

    var data = JSON.stringify(payload);

    var config = {
      method: "post",
      url: `${api_url}/auth/signup`, 
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      const resp = await axios(config);
      const data = await resp.data;
      console.log(data);

      navigate(`/login?${role_selected}`, { replace: true });
    } catch (error) {
      console.error(`Axios error..: ${error}`);
    }
  }
</script>

{#if role_selected === ""}
  <button class="btn" on:click={() => handleRole("seller")}
    >Signup Sebagai Seller</button
  >
  <button class="btn" on:click={() => handleRole("customer")}
    >Signup Sebagai Customer</button
  >
{:else}
  <div>
    <input
      type="text"
      placeholder="nama"
      class="input w-full max-w-xs"
      bind:value={nama}
    />
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
    <button class="btn" on:click={() => handleSignUp()}>Signup</button>
  </div>
{/if}
