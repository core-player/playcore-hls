<template>
  <div id="app">
    <div class="player-container">
      <vue-core-video-player core={Core} src="/videos/hls/the_garden_of_words_trailer_english__1080p.m3u8"></vue-core-video-player>
    </div>
  </div>
</template>
<script>

import Core from '../../src/index'

export default {
  name: 'App',
  data () {
    return {
      Core,
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
