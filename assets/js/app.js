const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const progressBar = $(".progress-bar");
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const cd = $('.cd');
const playList = $('.playlist');
const timeSongTotal = $('.time-music-end');
const timeSongCurrent = $('.time-music-start');

const app = {
    currentIndex: 0,
    currentVolume: 1,
    isPlaying: false,
    isHoldProgressBar: false,
    isRandom: false,
    isRepeat: false,
    isFavourite: false,
    isMute: false,
    isHoldVolumeBar: false,

    songs: [{
        name: 'Có ai hẹn hò cùng em chưa',
        singer: 'Quân AP',
        path: './assets/music/coaihenhocungemchua.mp3',
        image: './assets/img/song1.jpg',

    },
    {
        name: 'Khác biệt',
        singer: 'Khắc Việt',
        path: './assets/music/KhacBiet.mp3',
        image: './assets/img/song2.jpg',

    },
    {
        name: 'Chia tay là giải pháp',
        singer: 'Ngô Quyền Linh - Cover',
        path: './assets/music/ChiaTayLaGiaiPhap.mp3',
        image: './assets/img/song3.jpg',

    },
    {
        name: 'Suýt nữa thì',
        singer: 'Andiez',
        path: './assets/music/SuytNuaThi.mp3',
        image: './assets/img/song4.jpg',

    },
    {
        name: 'Thế giới trong em',
        singer: 'Hương Ly',
        path: './assets/music/TheGioiTrongEm.mp3',
        image: './assets/img/song5.jpg',

    },
    {
        name: 'Có ai hẹn hò cùng em chưa',
        singer: 'Quân AP',
        path: './assets/music/coaihenhocungemchua.mp3',
        image: './assets/img/song1.jpg',

    },
    {
        name: 'Khác biệt',
        singer: 'Khắc Việt',
        path: './assets/music/KhacBiet.mp3',
        image: './assets/img/song2.jpg',

    },
    {
        name: 'Chia tay là giải pháp',
        singer: 'Ngô Quyền Linh - Cover',
        path: './assets/music/ChiaTayLaGiaiPhap.mp3',
        image: './assets/img/song3.jpg',

    },
    {
        name: 'Suýt nữa thì',
        singer: 'Andiez',
        path: './assets/music/SuytNuaThi.mp3',
        image: './assets/img/song4.jpg',

    },
    {
        name: 'Thế giới trong em',
        singer: 'Hương Ly',
        path: './assets/music/TheGioiTrongEm.mp3',
        image: './assets/img/song5.jpg',

    },
    ],
    render: function () {
        const html = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        $('.playlist').innerHTML = html.join('');
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        });
    },

    handleEvents: function () {
        const _this = this;
        const cd = $('.cd');
        const cdWidth = cd.offsetWidth;

        let cdThumbAnimate;

        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate = cdThumb.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], {
                duration: 10000,
                iterations: Infinity
            })
            cdThumbAnimate.play();
        }

        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = (audio.currentTime / audio.duration) * 100;
                progress.style.width = progressPercent + "%";
                //set durationTime và currentTime cho bài hát
                timeSongCurrent.textContent = _this.getMinutesSong(
                    progress.style.width
                );
                timeSongTotal.textContent = _this.setMinutesSong();
            }
        };


        progressBar.onmousedown = function (e) {
            const seekTime = (e.offsetX / this.offsetWidth) * audio.duration;
            audio.currentTime = seekTime;
            _this.isHoldProgressBar = true;
        };
        progressBar.onmouseup = function (e) {
            if (_this.isHoldProgressBar) {
                const seekTime = (e.offsetX / this.offsetWidth) * audio.duration;
                audio.currentTime = seekTime;
            }
        };
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        playList.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
            }
        }


    },

    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        }, 300)
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;

    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    setMinutesSong() {
        const time = audio.duration;
        const minutes = Math.floor(time / 60)
            .toString()
            .padStart(2, "0");
        const seconds = Math.floor(time - 60 * minutes)
            .toString()
            .padStart(2, "0");
        return (finalTime = minutes + ":" + seconds);
    },
    getMinutesSong() {
        const time = audio.currentTime;
        const minutes = Math.floor(time / 60)
            .toString()
            .padStart(2, "0");
        const seconds = Math.floor(time - 60 * minutes)
            .toString()
            .padStart(2, "0");
        return (finalTime = minutes + ":" + seconds);
    },

    start: function () {
        this.defineProperties();
        this.handleEvents();
        this.loadCurrentSong();
        this.render();
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
        progress.style.width = 0;

    }
}
app.start()