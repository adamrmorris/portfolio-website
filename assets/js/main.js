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
});
