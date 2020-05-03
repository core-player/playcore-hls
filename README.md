## playcore-hls

A [vue-core-video-player](https://github.com/core-player/vue-core-video-player) plugin for HLS Decoding.


### Get Started

``` bash
$ npm install vue-core-video-player --save
$ npm install @core-player/playcore-hls --save
```

``` vue
<template>
  <div id="app">
    <div class="player-container">
      <vue-core-video-player :core="HLSCore" src="your_file.m3u8"></vue-core-video-player>
    </div>
  </div>
</template>
<script>
import VueCoreVideoPlayer from 'vue-core-video-player'
import HLSCore from '@core-player/playcore-hls

Vue.use(VueCoreVideoPlayer)

export default {
  name: 'App',
  data () {
    return {
      HLSCore
    }
  }
}

</script>

```

[example](./example/src/App.vue)

[View More]()