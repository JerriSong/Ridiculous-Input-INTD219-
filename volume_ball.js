
// page transition
const projectBtn = document.getElementById('projectBtn');
const projectCardContainer = document.getElementById('projectCardContainer');
const projectDescription = document.querySelector('.project-description');

projectBtn.addEventListener('click', () => {
    projectBtn.classList.add('slide-left');
    projectDescription.classList.add('slide-left');
    projectCardContainer.classList.add('center');
});

// loading YouTube API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

// api filled
function onYouTubeIframeAPIReady() {
    player = new YT.Player('videoFrame', {
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    
    player.setVolume(0);
    console.log("video ready");
}

const handle = document.getElementById('sliderHandle');
const fill = document.getElementById('sliderFill');
const volumeDisplay = document.getElementById('volumeDisplay');
const instructions = document.getElementById('instructions');
const sliderContainer = document.querySelector('.slider-container');
const playButton = document.getElementById('playButton');
const volumeIcon = document.getElementById('volumeIcon');

let isDragging = false;
let lastX = 0;
let lastTime = 0;
let startDragX = 0;
let isPlaying = false;

instructions.classList.remove('visible');

function onMouseDown(e) {
    isDragging = true;
    lastX = e.clientX;
    lastTime = Date.now();
    startDragX = handle.getBoundingClientRect().left;
    

    if (handle.classList.contains('flying')) {
        resetHandle();
    }

    volumeDisplay.classList.add('visible');
    e.preventDefault();
}

function resetHandle() {
    handle.classList.remove('flying');
    handle.style.position = 'absolute';
    handle.style.left = '0';
    handle.style.top = '50%';
    handle.style.transform = 'translate(-50%, -50%)';
    fill.style.width = '0%';
    volumeDisplay.textContent = 'Volume: 0%';
    
 
    instructions.classList.remove('visible');
    
    if (player && player.setVolume) {
        player.setVolume(0);
    }
    
    volumeIcon.innerHTML = '<span class="material-symbols-outlined">volume_off</span>';
}

handle.addEventListener('mousedown', onMouseDown);

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const currentX = e.clientX;
    const currentTime = Date.now();
    const deltaX = currentX - lastX;
    const deltaTime = currentTime - lastTime;
    const speed = Math.abs(deltaX / deltaTime);

    // if speed is too fast, trigger flying effect
    if (speed > 0.5) {
        isDragging = false;
        handle.style.position = 'fixed';
        handle.classList.add('flying');
        
      
        fill.style.width = '0%';
        volumeDisplay.textContent = 'Volume: 0%';
        
    
        if (player && player.setVolume) {
            player.setVolume(0);
        }

        volumeIcon.innerHTML = '<span class="material-symbols-outlined">volume_off</span>';

        instructions.classList.add('visible');
        
        return;
    }

    const containerRect = sliderContainer.getBoundingClientRect();
    const relativeX = e.clientX - containerRect.left;
    const percentage = Math.max(0, Math.min(100, (relativeX / containerRect.width) * 100));


    if (percentage >= 0 && percentage <= 100 && e.clientX >= startDragX) {
        handle.style.left = `${percentage}%`;
        fill.style.width = `${percentage}%`;
        volumeDisplay.textContent = `Volume: ${Math.round(percentage)}%`;
        
        if (player && player.setVolume) {
            player.setVolume(percentage);
        }
        updateVolumeIcon(percentage);
    }

    lastX = currentX;
    lastTime = currentTime;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    

    if (!handle.classList.contains('flying')) {
        setTimeout(() => {
            volumeDisplay.classList.remove('visible');
        }, 3000);
    }
});

// click on flying handle
document.addEventListener('click', (e) => {
    if (handle.classList.contains('flying')) {
        const rect = handle.getBoundingClientRect();
        
        // check if click is in handle
        if (
            e.clientX >= rect.left && 
            e.clientX <= rect.right && 
            e.clientY >= rect.top && 
            e.clientY <= rect.bottom
        ) {
            resetHandle();
  
            sliderContainer.appendChild(handle);
            volumeDisplay.classList.add('visible');
            
           
            setTimeout(() => {
                volumeDisplay.classList.remove('visible');
            }, 3000);
        }
    }
});

// play button
playButton.addEventListener('click', () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
        playButton.textContent = '⏸';
        if (player && player.playVideo) {
            player.playVideo();
        }
    } else {
        playButton.textContent = '▶';
        if (player && player.pauseVideo) {
            player.pauseVideo();
        }
    }
});

// volume control
function updateVolumeIcon(volume) {
    if (volume === 0) {
        volumeIcon.innerHTML = '<span class="material-symbols-outlined">volume_off</span>';
    } else {
        volumeIcon.innerHTML = '<span class="material-symbols-outlined">volume_up</span>';
    }
}
