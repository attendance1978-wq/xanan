const audio = document.getElementById("audio");
const title = document.getElementById("title");
const art = document.getElementById("art");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const volume = document.getElementById("volume");
const progress = document.getElementById("progress");
const download = document.getElementById("download");
const playlistUI = document.getElementById("playlist");

const base = "https://github.com/attendance1978-wq/xanan/";

const playlist = [
  {
    title: "Kung Pwede Lang",
    file: "Kung Pwede Lang.mp3",
    art: "Kung Pwede Lang.jpeg"
  },
  {
    title: "Tahimik na Pagod",
    file: "Tahimik na Pagod.mp3",
    art: "Tahimik na Pagod.jpeg"
  },
  {
    title: "Fading Light",
    file: "Title_ Fading Light.mp3",
    art: "Title_ Fading Light.jpeg"
  }
];

let index = 0;
let playing = false;

playlist.forEach((s, i) => {
  const li = document.createElement("li");
  li.textContent = s.title;
  li.onclick = () => loadSong(i, true);
  playlistUI.appendChild(li);
});

function loadSong(i, auto = false) {
  index = i;
  audio.src = base + playlist[i].file;
  art.src = base + playlist[i].art;
  title.textContent = playlist[i].title;
  download.href = audio.src;

  [...playlistUI.children].forEach((li) => li.classList.remove("active"));
  playlistUI.children[i].classList.add("active");

  if (auto) play();
}

function play() {
  audio.play();
  playBtn.textContent = "⏸";
  playing = true;
}

playBtn.onclick = () => {
  playing ? audio.pause() : play();
  playBtn.textContent = playing ? "▶" : "⏸";
  playing = !playing;
};

nextBtn.onclick = () => loadSong((index + 1) % playlist.length, true);
prevBtn.onclick = () =>
  loadSong((index - 1 + playlist.length) % playlist.length, true);

volume.oninput = (e) => (audio.volume = e.target.value);

audio.ontimeupdate = () => {
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
};

progress.oninput = () =>
  (audio.currentTime = (progress.value / 100) * audio.duration);

audio.onended = () => nextBtn.click();

loadSong(0);
