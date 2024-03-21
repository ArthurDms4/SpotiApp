<template>
  <div>
    <UModal v-model="dialog" prevent-close>
        <div class="flex flex-col items-center justify-around card text-center bg-black text-white">
            <div>
                <h2 class="text-3xl">Welcome to the Blind Test !</h2>
                <p>Guess the songs from your own playlist</p>
                <p>(some songs might be missing because they don't have url listening preview :/ )</p>
            </div>
            <UButton :loading="isLoading" class="bg-spotifyGreen w-fit text-3xl" @click="getLikedSongs">Start</UButton>
        </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

let dialog = ref(true)
let likedSongs = ref([])
let token = ref("")
let isLoading = ref(false)
let isFetchFinished = ref(false)

onMounted(() => {
    token.value = localStorage.getItem("access_token") as string
})

watch([isFetchFinished], () => {
    likedSongs.value = likedSongs.value.filter((track: any) => {
        if(track.track.preview_url !== null) {
            return track
        }
    })
    console.log(likedSongs.value)
    dialog.value = false
})

async function getLikedSongs() {
    isLoading.value = true
    fetchSongs(0)
}

async function fetchSongs(offset: number) {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/me/tracks?limit=50&offset=${offset}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        }
      )
      if (response.ok) {
        const data = await response.json();
        const updatedLikedSongs : any[] = data.items.map((track: any) => track);
        likedSongs.value = likedSongs.value.concat(updatedLikedSongs)
        let songsRemaining = data.total - offset - data.items.length;
        if (songsRemaining > 0) {
          fetchSongs(offset + 50); // Appel récursif avec le prochain offset
        } else {
          isFetchFinished.value = true
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
}

</script>


<style scoped>

.card{
    height: 300px;
}

</style>

