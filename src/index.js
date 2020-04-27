/**
 * A vue-core-video-player PlayCore for HLS Format
*/
import loadScript from 'load-script'
import { BaseVideoCore } from 'vue-core-video-player'
// import EVENTS from '../constants/EVENTS'
import { isMSESupported, isChrome, isAndroid, isApple, isUC, getFormatBandwidth } from './util'
import { LOAD_SDK_TIMEOUT, HLS_SDK, DEFAULT_HLS_RESOLUTION, HLS_DEFAULT_CONFIG, ERROR_TYPE, HLS_EVENTS } from './constants'
const EVENTS = {}


class HLSCore extends BaseVideoCore {

  install(player) {
    this.player = player;
    this.state = {
      waiting_trigger: true,
      waiting_pause: false
    }
    if (!window.Hls) {
      this.loadSDK(() => {
        this.player.pause()
        this.initHLSCore()
      })
    } else {
      this.initHLSCore()
    }
  }

  loadSDK (callback) {
    const timeout = setTimeout(() => {
      if (!window.Hls) {
        this.player.emit(EVENTS.CORE_TO_MP4, true)
      }
    }, LOAD_SDK_TIMEOUT)
    loadScript(HLS_SDK, (err, script) => {
      if (err) {
        clearTimeout(timeout);
        this.player.emit(EVENTS.CORE_TO_MP4, true)
        this.player.emit(EVENTS.ERROR, {
          code: 601,
          message: JSON.stringify(err)
        });
        return
      }
      if (script) {
        callback();
      }
    })
  }

  initHLSCore() {
    const player = this.player;
    const config = Object.assign({}, HLS_DEFAULT_CONFIG, player.options)
    this.setXhrSetup(config);
    const hls = new Hls(config);
    player.source.cdn = player.source.hls;
    hls.loadSource(player.source.hls);
    hls.attachMedia(player.video);
    player.video.pause();
    this.hlsErrorCount = 0;
    hls.on(HLS_EVENTS.MANIFEST_PARSED, (event, result) => {
      if (result.levels.length <= 1) {
        hls.abrController.nextAutoLevel = -1;
        hls.autoLevelEnabled = false
        hls.currentLevel = this.parse(result)
      } else {
        hls.startLevel = this.parse(result)
        this.player.setAutoResolution()
      }
      this.player.updateState('frag', {})
      hls.startLoad();
    });
    this.hlsCore = this.hls = hls;
    this.bindEvents()
  }

  setXhrSetup(config) {
    const { source } = this.player;
    config.xhrSetup = (xhr, url, ctx) => {
      if (/\.mp4/.test(url)) {
        let range;
        if (ctx) {
          range = `${ctx.rangeStart}-${(ctx.rangeEnd - 1)}`;
        }
        url = this.player.setFormatCDN({
          ...source,
          url,
          range,
        });
        ctx.url = url;
        xhr.open('GET', url, true)
      }
    };
  }

  // proxy some hls events
  bindEvents() {
    this.hlsCore.on(HLS_EVENTS.LEVEL_SWITCHED, (event, result) => {
      const { resolution } = this.player.source;
      const index = result.level;
      const data = this._findLevel(index);
      if (resolution === 'auto') {
        this.player.source.height = data.height;
        this.player.source.width = data.width;
        this.player.source.video_bitrate = data.video_bitrate;
        this.player.emit(EVENTS.RESOLUTION_UPDATE, data);
      }
    })
    this.hlsCore.on(HLS_EVENTS.FRAG_LOADED, (event, result) => {
      if (result.frag.type === 'audio') {
        return;
      }
      if (result.stats) {
        // logger.log(result);
        const { loaded, tfirst, tload } = result.stats;
        this.player.updateState('frag', result.stats);
        const bandwidth = this.hlsCore.bandwidthEstimate || (loaded / (tload - tfirst) * 1000);
        const bw = getFormatBandwidth(bandwidth);
        result.frag.request = result.networkDetails;
        this.player.updateState({
          bw,
          bandwidth,
          frag: result.frag,
        });
      }
    })
    this.hlsCore.on(HLS_EVENTS.ERROR, (e, result) => {
      if (ERROR_TYPE[result.details]) {
        this.hlsErrorCount++;
        if (this.hlsErrorCount >= ERROR_TYPE[result.details]) {
          this.hlsCore.detachMedia();
          this.player.emit(EVENTS.CORE_TO_MP4, true);
        }
      }
      this.player.emit(EVENTS.ERROR, {
        code: 601,
        message: JSON.stringify({
          type: result.type,
          details: result.details,
        }),
      });
    })
  }

  _findLevel(index) {
    return this.medias[index]
  }

  // parse m3u8 manifest and set medias
  parse(mainfest) {
    if (Array.isArray(mainfest.levels)) {
      const medias = [];
      mainfest.levels.forEach((item) => {
        const resolution = item.height;
        if (Array.isArray(item.url)) {
          item.url = item.url.map((url) => {
            return this.player.setFormatCDN({
              url,
              resolution,
            });
          });
        }
        medias.push({
          url: item.url,
          width: item.width,
          height: item.height,
          video_bitrate: item.bitrate,
          resolution,
        });
      });
      return this.initResolution(medias)
    }

    if (Array.isArray(mainfest.audioTracks)) {
      const audios = [];
      mainfest.audioTracks.forEach((item, index) => {
        audios.push({
          url: item.url,
          name: item.name + index,
          lang: item.lang,
          codec: item.audioCodec,
          id: item.urlId,
        });
      });
      // this.player.initAudios(audios);
    }
  }

  initResolution(medias) {
    const length = medias.length;
    this.medias = medias;
    this.player.initResolution(null, medias);
    for (let i = 0; i < length; i++) {
      if (medias[i].resolution === DEFAULT_HLS_RESOLUTION) {
        return i;
      }
    }
    return 0
  }


  setResolution(resolution) {
    const medias = this.medias;
    if (resolution === 'auto') {
      this.player.source.resolution = resolution;
      return hls.hls.currentLevel = -1;
    }
    if (medias && medias.length > 1) {
      for (let i = 0; i < medias.length; i++) {
        if (medias[i].resolution === resolution * 1) {
          hls.hls.currentLevel = i;
          Object.assign(this.player.source, medias[i]);
        }
      }
    }
  }

  setAudio (audio) {
    const audios = this.player.audios;
    if (audios && audios.length > 1) {
      for (let i = 0; i < audios.length; i++) {
        if (audios[i].name === audio) {
          this.player.source.audio = audios[i].name;
          hls.hls.audioTrack = 1 - i;
        }
      }
    }
  }

  checkHLSSupport () {
    if (isMSESupported()) {
      // in android we only support chrome
      if (isAndroid && isChrome) {
        return true
      }
      // in iOS  docs: https://github.com/vcamvr/vr-player/blob/core/hls/docs/core.md#%E6%B5%8F%E8%A7%88%E5%99%A8%E7%99%BD%E5%90%8D%E5%8D%95
      if (isApple && isUC) {
        return false
      }
      return true
    }
    return false
  }

  uninstall() {
    this.hlsCore.detachMedia()
  }
}


export default HLSCore;
