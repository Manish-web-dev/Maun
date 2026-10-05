const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 4, 3) * 90}ms`;
  observer.observe(item);
});

// Use only the supplied MP3 tracks. Attempt audible autoplay; browsers that
// block it can start playback from the visible sound button.
const musicButton = document.querySelector('.music-toggle');
if (musicButton) {
  const birthdayPage = document.body.classList.contains('page-intro');
  const audio = new Audio(birthdayPage ? 'birthday%20wish%20tune.mp3' : '2nd.mp3');
  audio.loop = true;
  audio.preload = 'auto';
  audio.autoplay = true;
  audio.volume = 1;
  const label = musicButton.querySelector('.music-label');

  function syncMusicButton(isMuted) {
    musicButton.classList.toggle('is-playing', !isMuted);
    musicButton.setAttribute('aria-pressed', String(!isMuted));
    label.textContent = isMuted ? 'धुन सुन्नुहोस्' : 'ध्वनि बन्द गर्नुहोस्';
  }

  musicButton.addEventListener('click', async () => {
    if (audio.paused) {
      audio.muted = false;
      try {
        await audio.play();
        syncMusicButton(false);
      } catch {
        label.textContent = 'धुन सुरु भएन — फेरि थिच्नुहोस्';
      }
      return;
    }
    audio.muted = !audio.muted;
    syncMusicButton(audio.muted);
  });

  audio.addEventListener('playing', () => syncMusicButton(audio.muted));
  audio.addEventListener('pause', () => syncMusicButton(true));
  label.textContent = 'धुन सुरु हुँदैछ…';
  audio.play().then(() => syncMusicButton(false)).catch(() => {
    audio.pause();
    label.textContent = 'धुन सुरु गर्न यहाँ थिच्नुहोस्';
    musicButton.setAttribute('aria-label', birthdayPage
      ? 'जन्मदिनको धुन सुरु गर्नुहोस्' : 'मधुर धुन सुरु गर्नुहोस्');
  });
}
