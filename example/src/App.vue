<template>
  <div id="app">
    <div class="player-container">
      <vue-core-video-player :core="Core" :src="source"></vue-core-video-player>
    </div>
  </div>
</template>
<script>

import Core from '../../src/index'

const multiResolution = 'https://bitmovin-a.akamaihd.net/content/MI201109210084_1/m3u8s-fmp4/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8';
// const singleResolution = 'https://media.wxzxzj.com/the_garden_of_words_trailer_english__1080p.m3u8'

export default {
  name: 'App',
  data () {
    return {
      Core,
      source: multiResolution,
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#app .player-container {
  width: 640px;
  height: 320px;
}
</style>
