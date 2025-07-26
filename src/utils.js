import selectSoundUrl from "./assets/audio/select-sound.mp3";

export function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const pad = (num) => num < 10 ? '0' + num : num;

  return `${hrs > 0 ? pad(hrs) + ':' : ''}${pad(mins)}:${pad(secs)}`;
}

export const dragSound = {
  audio: new Audio(selectSoundUrl),
  isMuted: true,

  play() {
    if (!this.isMuted) {
      this.audio.play();
    }
  },

  setIsMuted(isMuted) {
    this.isMuted = isMuted;
  }
};
