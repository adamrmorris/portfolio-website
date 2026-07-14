document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const slides = carousel.querySelectorAll('.teaser__img--slide');
  const prevBtn = carousel.querySelector('[data-carousel-prev]');
  const nextBtn = carousel.querySelector('[data-carousel-next]');
  let index = Math.max(0, [...slides].findIndex((slide) => slide.classList.contains('is-active')));

  const show = (newIndex) => {
    slides[index].classList.remove('is-active');
    index = (newIndex + slides.length) % slides.length;
    slides[index].classList.add('is-active');
  };

  prevBtn.addEventListener('click', () => show(index - 1));
  nextBtn.addEventListener('click', () => show(index + 1));

  const SWIPE_THRESHOLD = 40;
  let touchStartX = 0;
  let touchStartY = 0;
  let isSwiping = false;

  carousel.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    isSwiping = true;
  }, { passive: true });

  carousel.addEventListener('touchmove', (event) => {
    if (!isSwiping) return;
    const touch = event.touches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      event.preventDefault();
    }
  }, { passive: false });

  carousel.addEventListener('touchend', (event) => {
    if (!isSwiping) return;
    isSwiping = false;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY)) return;
    show(deltaX < 0 ? index + 1 : index - 1);
  });
});

const VIDEO_GLYPH_PLAY =
  'M15.5 11.2C15.5 10.42 16.36 9.95 17.02 10.37L25.6 15.77C26.22 16.16 26.22 17.06 25.6 17.45L17.02 22.85C16.36 23.27 15.5 22.8 15.5 22.02V11.2Z';
const VIDEO_GLYPH_PAUSE =
  'M15.0898 25.3633C14.7852 25.3633 14.5273 25.2578 14.3164 25.0469C14.1055 24.8418 14 24.5869 14 24.2822V11.0723C14 10.7617 14.1025 10.5068 14.3076 10.3076C14.5186 10.1025 14.7793 10 15.0898 10C15.4004 10 15.6582 10.1025 15.8633 10.3076C16.0742 10.5068 16.1797 10.7617 16.1797 11.0723V24.2822C16.1797 24.5869 16.0742 24.8418 15.8633 25.0469C15.6523 25.2578 15.3945 25.3633 15.0898 25.3633ZM21.2949 25.3633C20.9902 25.3633 20.7324 25.2578 20.5215 25.0469C20.3105 24.8418 20.2051 24.5869 20.2051 24.2822V11.0723C20.2051 10.7617 20.3076 10.5068 20.5127 10.3076C20.7236 10.1025 20.9844 10 21.2949 10C21.6055 10 21.8662 10.1025 22.0771 10.3076C22.2881 10.5068 22.3936 10.7617 22.3936 11.0723V24.2822C22.3936 24.5869 22.2852 24.8418 22.0684 25.0469C21.8574 25.2578 21.5996 25.3633 21.2949 25.3633Z';

document.querySelectorAll('[data-video-teaser]').forEach((wrapper) => {
  const video = wrapper.querySelector('[data-video]');
  const toggleBtn = wrapper.querySelector('[data-video-toggle]');
  const glyph = toggleBtn.querySelector('[data-glyph]');
  let userPaused = false;

  const setIcon = (playing) => {
    glyph.setAttribute('d', playing ? VIDEO_GLYPH_PAUSE : VIDEO_GLYPH_PLAY);
    toggleBtn.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
  };

  video.addEventListener('play', () => setIcon(true));
  video.addEventListener('pause', () => setIcon(false));

  toggleBtn.addEventListener('click', () => {
    if (video.paused) {
      userPaused = false;
      video.play();
    } else {
      userPaused = true;
      video.pause();
    }
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (userPaused) return;
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.5 });

  observer.observe(video);
});
