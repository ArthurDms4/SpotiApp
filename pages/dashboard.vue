<template>
  <div>
    <Myheader></Myheader>
    <main class="flex justify-center">
      <div class="w-2/3">
        <div @click="() => navigateTo(act.link)" class="flex justify-center cursor-pointer" v-for="act in filteredActivities">
          <UIcon class="icon" :name="getIconName(act)" dynamic/>
          <div class="flex flex-col text-center justify-around h-auto w-3/5">
            <span class="text-spotifyGreen text-2xl">{{ act.label }}</span>
            <p class="text-white">{{ act.description }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">

import activites from "@/enum/activities.json"

let filteredActivities = activites.slice(1,activites.length - 1)

const config = useRuntimeConfig()

let code : string = "";
let accessToken : string = "";
let refreshToken : string = "";

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  let code = urlParams.get("code");
  accessToken = localStorage.getItem("access_token") as string
  if(code && (accessToken == "undefined" || !accessToken)) {
    getToken(code)
  } else {
    checkIfTokenIsValid(accessToken)
  }
})

function checkIfTokenIsValid(accessToken: string) {
  if(accessToken == "undefined" || accessToken == null) {
    navigateTo("/login")
  } else {
    getRefreshedToken()
  }
}

async function getRefreshedToken() {
  refreshToken = localStorage.getItem('refresh_token') as string
  if(refreshToken !== 'undefined' && refreshToken) {
    const body = await fetch(`https://accounts.spotify.com/api/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
            client_id: config.public.clientId,
          }),
        });
        const response = await body.json();
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);
      }
  }

async function getToken(code: string) {
  const payload = {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_id: config.public.clientId,
            grant_type: "authorization_code",
            code: code,
            redirect_uri: `${window.location.origin}/dashboard`,
            code_verifier: localStorage.getItem("code_verifier") as string
          }),
        };

        try {
          const body = await fetch("https://accounts.spotify.com/api/token", payload);
          const response = await body.json();
          localStorage.setItem("access_token", response.access_token);
          localStorage.setItem("refresh_token", response.refresh_token);
          return response.access_token;
        } catch (error) {
          console.error("Error:", error);
          return '';
        }
}

function getIconName(act: any) {
   return `i-${act.icon.collection}-${act.icon.name}`
}

</script>

<style scoped>

.icon{
  color: white;
  width: 30%;
  height: 30%;
}

</style>
