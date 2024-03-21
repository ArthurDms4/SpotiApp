<template>
  <div>
    <UModal v-model="dialog" prevent-close>
        <Ucard class="flex flex-col items-center justify-around card text-center bg-black text-white">
            <div>
                <h2 class="text-3xl">Welcome to the Blind Test !</h2>
                <p>Guess the songs from your own playlist</p>
            </div>
            <UButton :loading="isLoading" class="bg-spotifyGreen w-fit text-3xl" @click="getLikedSongs">Start</UButton>
        </Ucard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

let dialog = ref(true)
let likedSongs = ref([])
let token = ref("")
let isLoading = ref(false)

onMounted(() => {
    token.value = localStorage.getItem("access_token") as string
})

async function getLikedSongs() {
    isLoading.value = true
}

</script>


<style scoped>

.card{
    height: 300px;
}

</style>

