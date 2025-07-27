// <a>タグを取得する変数を追加 (この行を追加)
const coverLink = document.getElementById('cover-link'), 
    image = document.getElementById('cover'),
    title = document.getElementById('music-title'),
    artist = document.getElementById('music-artist'),
    currentTimeEl = document.getElementById('current-time'),
    durationEl = document.getElementById('duration'),
    progress = document.getElementById('progress'),
    playerProgress = document.getElementById('player-progress'),
    prevBtn = document.getElementById('prev'),
    nextBtn = document.getElementById('next'),
    playBtn = document.getElementById('play');

const music = new Audio();

const songs = [
    {
        path: 'assets/1.mp3',
        displayName: 'Future',
        cover: 'assets/1.jpg',
        artist: 'NK',
        xLink: "https://x.com/NEW_web3/status/1906053707986616361"
    },
    {
        path: 'assets/2.mp3',
        displayName: 'Technology',
        cover: 'assets/2.jpg',
        artist: 'NK',
        xLink: "https://x.com/NEW_web3/status/1918213979509538901"
    },
    {
        path: 'assets/3.mp3',
        displayName: 'Sparkle',
        cover: 'assets/3.jpg',
        artist: 'NK',
        xLink: "https://x.com/NEW_web3/status/1938296210894557586"
    },
    {
        path: 'assets/4.mp3',
        displayName: 'Feeling ',
        cover: 'assets/4.jpg',
        artist: 'NK',
        xLink: "https://x.com/NEW_web3/status/1949532340289688052"
    },
];

let musicIndex = 0;
let isPlaying = false;


function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}


function rgbaToString(r, g, b, a) {
    return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
}


function getCssVariable(variableName) {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}


const gradientAlpha = 0.8;


const rawGradientPatterns = [
    { angle: 0, colors: [getCssVariable('--bg-color-1'), getCssVariable('--bg-color-2')] },
    { angle: 45, colors: [getCssVariable('--bg-color-2'), getCssVariable('--bg-color-3')] },
    { angle: 90, colors: [getCssVariable('--bg-color-3'), getCssVariable('--bg-color-4')] },
    { angle: 135, colors: [getCssVariable('--bg-color-4'), getCssVariable('--bg-color-5')] },
    { angle: 180, colors: [getCssVariable('--bg-color-5'), getCssVariable('--bg-color-6')] },
    { angle: 225, colors: [getCssVariable('--bg-color-6'), getCssVariable('--bg-color-1')] },
    { angle: 270, colors: [getCssVariable('--bg-color-1'), getCssVariable('--bg-color-3')] },
    { angle: 315, colors: [getCssVariable('--bg-color-3'), getCssVariable('--bg-color-5')] }
];

let currentGradientIndex = 0;
let gradientAnimationId;
let startTime = null;
const durationPerStep = 5000;

function togglePlay() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function playMusic() {
    isPlaying = true;
    playBtn.classList.replace('fa-play', 'fa-pause');
    playBtn.setAttribute('title', 'Pause');
    music.play();
    startGradientAnimation();
}

function pauseMusic() {
    isPlaying = false;
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play');
    music.pause();
    stopGradientAnimation();
}

function loadMusic(song) {
    music.src = song.path;
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    image.src = song.cover;
    // リンクを更新する処理 (この行を追加)
    coverLink.href = song.xLink;
}

function changeMusic(direction) {
    musicIndex = (musicIndex + direction + songs.length) % songs.length;
    loadMusic(songs[musicIndex]);
    playMusic();
}

function updateProgressBar() {
    const { duration, currentTime } = music;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    const formatTime = (time) => String(Math.floor(time)).padStart(2, '0');
    
    // durationがNaNでない場合のみ時間を表示
    if (!isNaN(duration)) {
        durationEl.textContent = `${formatTime(duration / 60)}:${formatTime(duration % 60)}`;
    }
    currentTimeEl.textContent = `${formatTime(currentTime / 60)}:${formatTime(currentTime % 60)}`;
}

function setProgressBar(e) {
    const width = playerProgress.clientWidth;
    const clickX = e.offsetX;
    music.currentTime = (clickX / width) * music.duration;
}

function startGradientAnimation() {
    if (!gradientAnimationId) {
        startTime = null;
        gradientAnimationId = requestAnimationFrame(animateGradient);
    }
}

function stopGradientAnimation() {
    if (gradientAnimationId) {
        cancelAnimationFrame(gradientAnimationId);
        gradientAnimationId = null;
    }
}

function animateGradient(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;


    const totalProgress = elapsed / durationPerStep;
    const currentStepIndex = Math.floor(totalProgress);
    const progressInCurrentStep = totalProgress - currentStepIndex;

    const currentPatternIndex = currentStepIndex % rawGradientPatterns.length;
    const nextPatternIndex = (currentStepIndex + 1) % rawGradientPatterns.length;

    const currentPattern = rawGradientPatterns[currentPatternIndex];
    const nextPattern = rawGradientPatterns[nextPatternIndex];

    const startColor1 = hexToRgb(currentPattern.colors[0]);
    const startColor2 = hexToRgb(currentPattern.colors[1]);
    const endColor1 = hexToRgb(nextPattern.colors[0]);
    const endColor2 = hexToRgb(nextPattern.colors[1]);


    const interpolatedR1 = startColor1.r + (endColor1.r - startColor1.r) * progressInCurrentStep;
    const interpolatedG1 = startColor1.g + (endColor1.g - startColor1.g) * progressInCurrentStep;
    const interpolatedB1 = startColor1.b + (endColor1.b - startColor1.b) * progressInCurrentStep;

    const interpolatedR2 = startColor2.r + (endColor2.r - startColor2.r) * progressInCurrentStep;
    const interpolatedG2 = startColor2.g + (endColor2.g - startColor2.g) * progressInCurrentStep;
    const interpolatedB2 = startColor2.b + (endColor2.b - startColor2.b) * progressInCurrentStep;



    let angleDiff = nextPattern.angle - currentPattern.angle;
    if (angleDiff > 180) angleDiff -= 360;
    if (angleDiff < -180) angleDiff += 360;
    const interpolatedAngle = currentPattern.angle + angleDiff * progressInCurrentStep;


    const finalColor1 = rgbaToString(interpolatedR1, interpolatedG1, interpolatedB1, gradientAlpha);
    const finalColor2 = rgbaToString(interpolatedR2, interpolatedG2, interpolatedB2, gradientAlpha);

    document.body.style.backgroundImage = `linear-gradient(${interpolatedAngle}deg, ${finalColor1}, ${finalColor2})`;

    if (isPlaying) {
        gradientAnimationId = requestAnimationFrame(animateGradient);
    } else {
        stopGradientAnimation();
    }
}


playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => changeMusic(-1));
nextBtn.addEventListener('click', () => changeMusic(1));
music.addEventListener('ended', () => changeMusic(1));
music.addEventListener('timeupdate', updateProgressBar);
playerProgress.addEventListener('click', setProgressBar);

loadMusic(songs[musicIndex]);

// 最初はアニメーションを再生しないように変更
stopGradientAnimation();