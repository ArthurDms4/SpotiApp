<template>
  <myheader></myheader>
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
      <div class="flex justify-center p-12">
        <div class="flex flex-col items-center w-full">
          <form class="w-3/4 flex flex-col items-center " @submit.prevent="handleFormSubmit">
            <UInputMenu class="w-3/4" :search-attributes="['artists.0.name', 'name']" placeholder="Guess the song ..." v-model="songAttempt" :options="likedSongs" option-attribute="name">
              <template  #option="{option: track}">
                <span>{{ track.name }} -</span>
                <span v-for="artist in track.artists">{{ artist.name }}</span>
              </template>
            </UInputMenu>
            <div class="flex">
              <UButton class="m-3" type="submit" :disabled="isSongFound">Submit</UButton>
              <UButton @click="skipSong" class="m-3">{{ isSongFound ? "New song" : "Skip" }}</UButton>
            </div>
            <UIcon v-if="isSongFound" class="m-3 size-7 icon-valid" dynamic name="i-streamline-interface-validation-check-circle-checkmark-addition-circle-success-check-validation-add-form"></UIcon>
            <audio controls :src="songToGuess?.preview_url">Listen</audio>
          </form>
          <div class="m-3 text-white" v-for="track in tabSongAttempt">
            <span>{{ track.name }} - </span>
            <span v-for="artist in track.artists"> {{ artist.name }} &nbsp;</span><UIcon :class="track.id === songToGuess.id ? 'icon-valid size-5' : 'icon-error size-5'" dynamic :name="track.id === songToGuess.id ? 'i-streamline-interface-validation-check-square-1-check-form-validation-checkmark-success-add-addition-box-square' : 'i-gridicons-cross-circle'"></UIcon>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

let dialog = ref(true)
let likedSongs = ref([])
let token = ref("")
let isLoading = ref(false)
let isFetchFinished = ref(false)
let songToGuess = ref()
let songAttempt = ref()
let isSongFound = ref(false)
let tabSongAttempt = ref<any[]>([])

onMounted(() => {
    token.value = localStorage.getItem("access_token") as string
})

watch([isFetchFinished], () => {
    likedSongs.value = likedSongs.value.filter((track: any) => {
        if(track.track.preview_url !== null) {
            return track
        }
    }).map((track : any) => {
      return track.track
    })
    shuffleArray(likedSongs.value)
    pickARandomSong()
    console.log(songToGuess.value)
    dialog.value = false
})

function skipSong() {
  songAttempt.value = undefined
  tabSongAttempt.value = []
  isSongFound.value = false
  pickARandomSong()
}

function handleFormSubmit() {
  if(checkFormValid()) {
      submitSong()
    }
}

function checkFormValid() : boolean {
  if(isSongFound.value) {
    return true
  } else if(songAttempt.value !== undefined){
    return true
  } else {
    return false
  }
}

function submitSong() {
  if(songAttempt.value.id === songToGuess.value.id) {
    isSongFound.value = true
  }
  tabSongAttempt.value.unshift(songAttempt.value)
  songAttempt.value = undefined
}

function shuffleArray(array : any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function pickARandomSong() {
    songToGuess.value = likedSongs.value[Math.floor(Math.random() * likedSongs.value.length)]
}

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

.icon-valid{
   color: green
}

.icon-error{
  color: red;
}


</style>

