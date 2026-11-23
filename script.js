// Filter projects by category (each section filters only its own cards)
document.querySelectorAll('section').forEach(section => {
  const buttons = section.querySelectorAll('.filters button');
  const cards = section.querySelectorAll('.card');
  buttons.forEach(btn => btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    cards.forEach(c => c.classList.toggle('hidden', f !== 'all' && c.dataset.category !== f));
    const grid = section.querySelector('.grid');
    if (grid) grid.scrollLeft = 0;   // always start the row from the first card
  }));
});

// Carousels (index page cards)
document.querySelectorAll('.carousel').forEach(car => {
  const slides = car.querySelectorAll('.slide');
  let i = 0;
  const show = n => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('active', k === i));
  };
  car.querySelector('.prev').addEventListener('click', () => show(i - 1));
  car.querySelector('.next').addEventListener('click', () => show(i + 1));
});

// Photo galleries (photography page): each .gallery runs separately
let activeGallery = document.querySelector('.gallery');   // the gallery the arrow keys control

document.querySelectorAll('.gallery').forEach(gallery => {
  const mainImg = gallery.querySelector('.gallery-image');
  const thumbs  = gallery.querySelectorAll('.thumbs img');
  const counter = gallery.querySelector('.gallery-count');
  let current = 0;

  function showPhoto(n, scroll = true) {
    current = (n + thumbs.length) % thumbs.length;   // loops around at the ends
    const thumb = thumbs[current];
    mainImg.src = thumb.src;
    mainImg.alt = thumb.alt;
    mainImg.style.objectFit = thumb.dataset.fit || 'contain';          // data-fit="cover" fills the box, no bars
    mainImg.style.objectPosition = thumb.dataset.position || 'center'; // data-position="top" etc.
    thumbs.forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
    if (scroll) {
      const strip = thumb.parentElement;   // scroll only the thumbnail strip, not the page
      strip.scrollTo({ left: thumb.offsetLeft - strip.offsetLeft - (strip.clientWidth - thumb.clientWidth) / 2, behavior: 'smooth' });
    }
    counter.textContent = (current + 1) + ' / ' + thumbs.length;
    activeGallery = gallery;
  }

  thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => showPhoto(i)));
  gallery.querySelector('.gallery-prev').addEventListener('click', () => showPhoto(current - 1));
  gallery.querySelector('.gallery-next').addEventListener('click', () => showPhoto(current + 1));

  gallery.showPhoto = showPhoto;
  gallery.getCurrent = () => current;
  showPhoto(0, false);
});

// Left / right arrow keys move whichever gallery was used last
document.addEventListener('keydown', e => {
  if (!activeGallery || !activeGallery.showPhoto) return;
  if (e.key === 'ArrowLeft')  activeGallery.showPhoto(activeGallery.getCurrent() - 1);
  if (e.key === 'ArrowRight') activeGallery.showPhoto(activeGallery.getCurrent() + 1);
});
