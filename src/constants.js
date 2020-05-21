export const HLS_SDK = 'https://cdn.jsdelivr.net/npm/hls.js@latest'

export const LOAD_SDK_TIMEOUT = 60 * 1000

export const DEFAULT_HLS_RESOLUTION = 1080

export const HLS_DEFAULT_CONFIG = {
  maxBufferLength: 10,
  startPosition: -1,
  nudgeMaxRetry: 8,
  enableSoftwareAES: false,
  autoStartLoad: false,
  nextAutoLevel: -1,
  capLevelToPlayerSize: false,
  maxSeekHole: 0,
  abrBandWidthUpFactor: 1
}

export const ERROR_TYPE = {
  bufferAppendingError: 1,
  levelLoadTimeOut: 1,
  manifestLoadError: 1,
  audioTrackLoadError: 1,
  fragLoadError: 3,
};

// some hls error is not hight level for UI to response
export const HLS_ERROR_WHITE = {
  bufferStalledError: 1
}

export const HLS_EVENTS = {
  MANIFEST_PARSED: 'hlsManifestParsed',
  LEVEL_SWITCHED: 'hlsLevelSwitched',
  FRAG_LOADED: 'hlsFragLoaded',
  FRAG_BUFFERED: 'hlsFragBuffered',
  ERROR: 'hlsError',
  LEVEL_LOADED: 'hlsLevelLoaded',
  BUFFER_APPENDED: 'hlsBufferAppended',
};
