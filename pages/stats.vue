<template>
  <div>
    <myheader></myHeader>
    <div class="flex justify-center">
        <div class="flex justify-around w-2/4">
            <UTabs :items="items" class="w-5/12">
                <template #default="{item}">
                    <UIcon dynamic :name="item.icon"></UIcon>
                    <span>{{ item.label }}</span>
                </template>
                <template #item="{item}">
                    <div v-for="elem in item.data">
                        {{ elem.name }} 
                        <div v-if="item.value == 'artists'">
                            <img :src="elem.images[0].url" alt="">
                        </div>
                        <div v-if="item.value == 'tracks'">
                            <img :src="elem.album.images[0].url" alt="">
                        </div>
                    </div>
                </template>
            </UTabs>
            <USelect class="" v-model="itemPerPage" :options="[3,6,12,36]"></USelect>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

let token = ref('')
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
    top32Artists.value = await getTop32Items("artists")
    top32Tracks.value = await getTop32Items("tracks")
    console.log(top32Artists.value)
    console.log(top32Tracks.value)
})

async function getTop32Items(type: string) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/me/top/${type}?limit=32`, {
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



</style>

