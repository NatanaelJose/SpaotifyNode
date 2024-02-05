document.addEventListener('DOMContentLoaded', function() {
    const songName = document.getElementById('song-name');
    const bandName = document.getElementById('band-name');
    const cover = document.getElementById('cover');
    const song = document.getElementById('audio');
    const play = document.getElementById('play');
    const next = document.getElementById('skip');
    const previous = document.getElementById('back');
    const currentProgress = document.getElementById('current-progress');
    const progressContainer = document.getElementById('progress-container');
    const shuffleButton = document.getElementById('shuffle');
    const repeatButton = document.getElementById('repeat');
    const songTime = document.getElementById('song-time');
    const totalTime = document.getElementById('total-time');
    const likeButton = document.getElementById('like');
    const usrButton = document.getElementById('user-enter');

    const api = fetch("https://paotify.vercel.app/api")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Erro HTTP! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            if (!data || typeof data !== "object") {
                throw new Error("Conteúdo da API não é um JSON válido");
            }
            const dataMusic = data;

            let isShuffled = false;
            let isPlaying = false;
            let repeatOn = false;

            const OriginalPlaylist =
                JSON.parse(localStorage.getItem("playlist")) ?? dataMusic;
            let sortedPlaylist = [...OriginalPlaylist]; //spread
            let index = 0;

            function nextSong() {
                if (index === sortedPlaylist.length - 1) {
                    index = 0;
                } else {
                    index += 1;
                }
                initializeSong();
                playSong();
            }

            function previousSong() {
                if (index === 0) {
                    index = sortedPlaylist.length - 1;
                } else {
                    index -= 1;
                }
                initializeSong();
                playSong();
            }

            async function playPauseDecider() {
                if (isPlaying === true) {
                    await pauseSong();
                } else {
                    await playSong();
                }
            }

            async function playSong() {
                try {
                    play.querySelector('.bi').classList.remove('bi-play-circle-fill');
                    play.querySelector('.bi').classList.add('bi-pause-circle-fill');
                    await song.play();
                    isPlaying = true;
                } catch (error) {
                    console.error('Erro ao tentar reproduzir a música:', error);
                }
            }

            async function pauseSong() {
                try {
                    play.querySelector(".bi").classList.remove("bi-pause-circle-fill");
                    play.querySelector(".bi").classList.add("bi-play-circle-fill");
                    await song.pause();
                    isPlaying = false;
                } catch (error) {
                    console.error('Erro ao tentar pausar a música:', error);
                }
            }

            function initializeSong() {
                cover.onload = function () {
                    song.src = sortedPlaylist[index].file;
                    bandName.innerHTML = sortedPlaylist[index].artist;
                    songName.innerHTML = sortedPlaylist[index].name;
                };
                cover.src = sortedPlaylist[index].image;
            }

            function updateProgress() {
                let currentTimer = Math.floor(song.currentTime);
                let songTimer = Math.floor(song.duration);
                const barWidth = (currentTimer / songTimer) * 100;
                songTime.innerHTML = toHHMMSS(song.currentTime);
                currentProgress.style.setProperty("--progress", `${barWidth}%`);
            }

            function jumpTo(event) {
                const width = progressContainer.clientWidth;
                const clickPosition = event.offsetX;
                const jumpToTime = (clickPosition / width) * song.duration;
                song.currentTime = jumpToTime;
                if (isPlaying == true) {
                    pauseSong();
                    currentProgress.style.setProperty("--transition", "0.3s");
                    setTimeout(() => {
                        playSong();
                    }, 1000);
                }
            }

            function shuffleArray(preShuffleArray) {
                let size = preShuffleArray.length;
                let currentIndex = size - 1;
                for (let c = currentIndex; c > 0; c--) {
                    let randomIndex = Math.floor(Math.random() * size);
                    let aux = preShuffleArray[currentIndex];
                    preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
                    preShuffleArray[randomIndex] = aux;
                }
            }

            function shuffleButtonClicked() {
                if (isShuffled == false) {
                    isShuffled = true;
                    shuffleArray(sortedPlaylist);
                    shuffleButton.classList.add("button-active");
                } else {
                    isShuffled = false;
                    sortedPlaylist = [...OriginalPlaylist];
                    shuffleButton.classList.remove("button-active");
                }
            }

            function repeatButtonClicked() {
                if (repeatOn == false) {
                    repeatOn = true;
                    repeatButton.classList.add("button-active");
                    repeatButton.classList.remove("unrotate");
                    repeatButton.classList.add("rotate");
                } else {
                    repeatOn = false;
                    repeatButton.classList.remove("button-active");
                    repeatButton.classList.add("unrotate");
                    repeatButton.classList.remove("rotate");
                }
            }

            function nextOrRepeat() {
                if (repeatOn == false) {
                    setTimeout(() => {
                        nextSong();
                    }, 1000);
                } else {
                    setTimeout(() => {
                        playSong();
                    }, 500);
                }
            }

            function toHHMMSS(originalNumber) {
                let hours = Math.floor(originalNumber / 3600);
                let min = Math.floor((originalNumber - hours * 3600) / 60);
                let sec = Math.floor(originalNumber - hours * 3600 - min * 60);
                return `${hours.toString().padStart(2, "0")}:${min
                    .toString()
                    .padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
            }

            function updateTotalTime() {
                totalTime.innerHTML = toHHMMSS(song.duration);
            }

            function usrButtonClicked() {
                usrButton.classList.add("button-active");
                usrButton.classList.add("button-active");
            }

            initializeSong();
            play.addEventListener("click", playPauseDecider);
            next.addEventListener("click", nextSong);
            usrButton.addEventListener("click", usrButtonClicked);
            shuffleButton.addEventListener("click", shuffleButtonClicked);
            previous.addEventListener("click", previousSong);
            repeatButton.addEventListener("click", repeatButtonClicked);
            song.addEventListener("loadedmetadata", updateTotalTime);
            song.addEventListener("timeupdate", updateProgress);
            song.addEventListener("ended", nextOrRepeat);
            progressContainer.addEventListener("click", jumpTo);
        })
        .catch((error) => console.error("Erro ao buscar dados:", error));
});
