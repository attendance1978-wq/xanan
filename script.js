const base = "https://raw.githubusercontent.com/attendance1978-wq/xanan/main/";

const audio = document.getElementById("audio");
const title = document.getElementById("title");
const art = document.getElementById("art");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const volume = document.getElementById("volume");
const progress = document.getElementById("progress");
const download = document.getElementById("download");
const playlistUI = document.getElementById("playlist");
const currentTimeEl = document.getElementById("current");
const durationEl = document.getElementById("duration");

let playlist = [];
let index = 0;

// Load playlist from JSON
fetch("playlist.json")
  .then(res => res.json())
  .then(data => {
    playlist = data.songs;
    playlist.forEach((song, i) => {
      const li = document.createElement("li");
      li.classList.add("list-group-item");
      li.textContent = song.title;
      li.onclick = () => loadSong(i, true);
      playlistUI.appendChild(li);
    });
    loadSong(0);
  })
  .catch(err => console.error("Failed to load playlist:", err));

// Format time
function formatTime(seconds){
  if(isNaN(seconds)) return "0:00";
  const min = Math.floor(seconds/60);
  const sec = Math.floor(seconds%60);
  return `${min}:${sec.toString().padStart(2,"0")}`;
}

// Load song
function loadSong(i, auto=false){
  index = i;
  const song = playlist[i];
  audio.src = base + song.file;
  art.src = base + song.art;
  title.textContent = song.title;
  download.href = audio.src;

  [...playlistUI.children].forEach(li=>li.classList.remove("active"));
  playlistUI.children[i].classList.add("active");

  // Reset progress
  progress.value = 0;
  currentTimeEl.textContent = "0:00";
  durationEl.textContent = "0:00";

  if(auto){
    // Play after canplay event, required for browser autoplay rules
    audio.pause();
    audio.currentTime = 0;
    audio.oncanplay = () => {
      audio.play().catch(err => console.log("Autoplay blocked, click play.", err));
    };
  }
}

// Controls
playBtn.onclick = () => {
  if(audio.paused) audio.play();
  else audio.pause();
};

nextBtn.onclick = () => loadSong((index+1) % playlist.length, true);
prevBtn.onclick = () => loadSong((index-1 + playlist.length) % playlist.length, true);

volume.oninput = e => audio.volume = e.target.value;

audio.onplay = () => playBtn.textContent = "⏸";
audio.onpause = () => playBtn.textContent = "▶";
audio.onended = () => nextBtn.click();

audio.onloadedmetadata = () => durationEl.textContent = formatTime(audio.duration);

audio.ontimeupdate = () => {
  currentTimeEl.textContent = formatTime(audio.currentTime);
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
};

progress.oninput = () => audio.currentTime = (progress.value / 100) * audio.duration;
