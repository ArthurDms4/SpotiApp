<template>
  <div class="flex justify-center items-center h-full">
    <UButton @click="redirectToSpotifyLogin" class="rounded-full text-3xl px-5">Login</UButton>
  </div>
</template>

<script setup lang="ts">

const config = useRuntimeConfig()

onMounted(() => {
  redirectToDashBoardIfTokenExist()
})

function redirectToDashBoardIfTokenExist() {
  let accessToken = localStorage.getItem("access_token")
  if(accessToken && accessToken !== "undefined") {
    navigateTo('dashboard')
  }
}

async function redirectToSpotifyLogin() {
    const codeVerifier = generateRandomString(64);
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);
    const scope = "user-read-private user-read-email user-top-read user-library-read";
    const authUrl = new URL("https://accounts.spotify.com/authorize");
    window.localStorage.setItem("code_verifier", codeVerifier);
    const params = {
      response_type: "code",
      client_id: config.public.clientId,
      scope,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      redirect_uri: `${window.location.origin}/dashboard`
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();

    const urlParams = new URLSearchParams(window.location.search);
}

function generateRandomString(length: number) {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  };

async function sha256(plain: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest("SHA-256", data);
}

function base64encode(input: ArrayBuffer) {
    const bytes = new Uint8Array(input);
    let encodedString = "";
    for (let i = 0; i < bytes.length; i++) {
      encodedString += String.fromCharCode(bytes[i]);
    }
    encodedString = btoa(encodedString)
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
    return encodedString;
}

</script>

<style scoped>
</style>
