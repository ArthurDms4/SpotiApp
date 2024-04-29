<template>
  <div>
    <myheader></myHeader>
    <div class="flex flex-col items-center">
        <div class="flex justify-around w-2/4 my-4">
            <UTabs v-model="activeSection" :items="items" class="w-5/12">
                <template #default="{item}">
                    <UIcon dynamic :name="item.icon"></UIcon>
                    <span>{{ item.label }}</span>
                </template>
            </UTabs>
            <USelect class="" v-model="itemPerPage" :options="[3,6,12,36]"></USelect>
        </div>
        <div class="my-6 w-3/4 flex justify-between flex-wrap">
            <div class="mb-4 img-container flex flex-col items-center justify-between text-spotifyGreen" v-for="item in items[activeSection].data">
                <div class="h-5/6">
                    <NuxtImg v-if="activeSection === 0" class="img"  :src="item.images[0].url" alt=""/>
                    <NuxtImg v-if="activeSection === 1"  :src="item.album.images[0].url" alt=""/>
                </div>
                <span>{{ item.name }}</span>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

let token = ref('')
let activeSection = ref(0)
let itemPerPage = ref(3)
let top32Artists = ref<any[]>([])
let artistToDisplay = computed(() => {
    return top32Artists.value.slice(0,itemPerPage.value)
})
let top32Tracks = ref<any[]>([])
let tracksToDisplay = computed(() => {
    return top32Tracks.value.slice(0,itemPerPage.value)
})
let items = ref([
    {
        label: "Artists",
        value: "artists",
        icon: "i-material-symbols-artist-outline",
        data: artistToDisplay
    },
    {
        label: "Tracks",
        value: "tracks",
        icon: 'i-ic-sharp-audiotrack',
        data: tracksToDisplay
    }
])

onMounted(async() => {
    token.value = localStorage.getItem('access_token') as string
    top32Artists.value = await getTop36Items("artists")
    top32Tracks.value = await getTop36Items("tracks")
    console.log(top32Artists.value)
    console.log(top32Tracks.value)
})

async function getTop36Items(type: string) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/me/top/${type}?limit=36`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            return data.items;
        } else {
            throw new Error('Failed to fetch data from Spotify API');
        }
    } catch (error) {
        console.log(error);
        return [];
    }
}

</script>

<style scoped>

.img-container{
    width: 30%;
}

.img{
    object-fit: cover;
    width: 100%;
    height: 100%;
}
</style>

