<template>
  <div>
    <header class="flex flex-col items-center">
        <h1 class="text-spotifyGreen text-5xl m-4">SpotiApp</h1>
        <nav class="flex justify-between w-1/3 text-spotifyGreen">
            <RouterLink v-for="link in navLinks" :to="link.link" @click="handleLinkClick(link)">{{ link.label }}</RouterLink>
        </nav>
    </header>
  </div>
</template>

<script setup lang="ts">
import activities from "@/enum/activities.json"

const navLinks : any[] = activities

function handleLinkClick(link: any) {
    switch(link.label) {
        case "Logout": localStorage.clear()
        break
    }
}

</script>

<style scoped>



</style>

