const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const audio = $("#audio");
const _this = this;
const progress = $('#progress');
const thumb = $(".cd-thumb");
const next = $('.btn-next');
const prev = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playList = $('.playlist');

const PLAYER_STORAGE_KEY = "F8_PLAYER";

const app = {
  isRepeat: false,
  isRandom: false,
  isPlaying: false,
  currentIndex: 0,
  settings: {

  },
  songs: [
    {
      name: "Pink Venom",
      singer: "BlackPink",
      path: "./assets/music/PinkVenom-BLACKPINK.mp3",
      image: "./assets/img/blackpink1.jpg",
    },

    {
      name: "How You Like That",
      singer: "BlackPink",
      path: "./assets/music/HowYouLikeThat-BLACKPINK.mp3",
      image: "./assets/img/blackpink2.jpg",
    },

    {
      name: "Solo",
      singer: "Jennie BlackPink",
      path: "./assets/music/Solo-JennieBlackPink.mp3",
      image: "./assets/img/jennie.jpg",
    },

    {
      name: "On the ground",
      singer: "Rose BlackPink",
      path: "./assets/music/OnTheGround-ROSE.mp3",
      image: "./assets/img/rose.jpg",
    },

    {
      name: "Chắc ai đó sẽ về",
      singer: "Sơn Tùng MTP",
      path: "./assets/music/ChacAiDoSeVeNewVersion-SonTungMTP.mp3",
      image: "./assets/img/sontung.jpg",
    },
  ],

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
    <div class="song ${index === this.currentIndex ? "active" : ""}" data-index=${index}>
        <div
            class="thumb"
            style="
            background-image: url('${song.image}');
            "
        ></div>

        <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
        </div>

        <div class="option">
            <i class="fas fa-ellipsis-h"></i>
        </div>
    </div>`;
    });

    playList.innerHTML = htmls.join("");
  },
  definedProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvent: function () {
    const cd = $(".cd");
    const cdWidth = cd.offsetWidth;
    const _this = this;

    //scroll
    document.onscroll = function () {
      const crollTop = window.scrollY || document.documentElement.crollTop;
      const newCDWidth = cdWidth - crollTop;

      cd.style.width = newCDWidth + "px";
    };

    //Play
    playBtn.onclick = function () {
        _this.isPlaying ? audio.pause() : audio.play();
    };

    audio.onplay = function () {
        _this.isPlaying = true;
        player.classList.add("playing");
        cdThumbAnimate.play();
    };
   
    audio.onpause = function () {
        _this.isPlaying = false;
        player.classList.remove("playing");
        cdThumbAnimate.pause();
    };

    audio.ontimeupdate = function () {
        if(audio.duration) {
            const processPercent = Math.floor(audio.currentTime / audio.duration * 100);
            progress.value = processPercent;
        }
    }

    audio.onended = function () {
      _this.isRepeat ? audio.play() : next.onclick();
    }

    //click vào bài hát sẽ active

    playList.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if(songNode ||  e.target.closest(".option")) {
        console.log(e.target);

        if (songNode) {
          console.log(songNode.getAttribute('data-index')) // (hoac dung songNode.dataset.index)
          _this.currentIndex =Number(songNode.getAttribute('data-index'));
          _this.loadCurrentSong();
          _this.render()
          audio.play();
        }
      }
    }

    // tua
     progress.onchange = function (e) {
        const seekTime = audio.duration / 100 * e.target.value;
        audio.currentTime = seekTime;
     }

     //quay CD
     const cdThumbAnimate = thumb.animate([{ transform: "rotate(360deg)" }], {
        duration: 10000,
        iterations: Infinity
      });
    cdThumbAnimate.pause();

    next.onclick = function () {
      if(_this.isRandom) {
        _this.playRandomSong();
      } else{
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    }

    prev.onclick = function () {
        _this.prevSong();
        audio.play();
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
  },

  nextSong: function () {
    this.currentIndex++ 
    if (this.currentIndex >= (this.songs.length)){
        this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong: function () {
    this.currentIndex--
    if (this.currentIndex < 0){
        this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  scrollToActiveSong: function () {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 500)
  },

  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while ( newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  loadCurrentSong: function () {
    const heading = $("header h2");
    const thumb = $(".cd-thumb");
    const audio = $("#audio");

    heading.textContent = this.currentSong.name;
    thumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  start: function () {
    this.definedProperties();
    this.handleEvent();
    this.loadCurrentSong();
    this.render();
  },
};

app.start();
