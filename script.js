/* ============================================
   SCRIPT.JS — Animations & Interactivité
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. CONFETTI AU CHARGEMENT ──
  createConfetti();

  // ── 2. PARTICULES DE FOND (Canvas) ──
  initParticles();

  // ── 3. ÉTOILES ANIMÉES ──
  createStars();

  // ── 4. PARTICULES AUTOUR DE LA PHOTO ──
  createPhotoParticles();

  // ── 5. ANIMATIONS AU SCROLL (Intersection Observer) ──
  initScrollAnimations();

  // ── 6. MODAL (CTA) ──
  initModal();

  // ── 7. MUSIQUE ──
  initMusic();

  // ── 8. PHOTO DETECTION ──
  initPhoto();
});

/* ============================================
   CONFETTI
   ============================================ */
function createConfetti() {
  const colors = ['#d4af37', '#f5e6c8', '#e8b4c8', '#c9a0dc', '#ffffff'];
  const shapes = ['square', 'circle'];

  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.classList.add('confetti-piece');

    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const left = Math.random() * 100;
    const fallDur = 2 + Math.random() * 3;
    const fallDelay = Math.random() * 2;
    const rotation = Math.floor(Math.random() * 720) + 'deg';
    const size = 6 + Math.random() * 8;

    piece.style.left = left + '%';
    piece.style.width = size + 'px';
    piece.style.height = size + 'px';
    piece.style.background = color;
    piece.style.borderRadius = shape === 'circle' ? '50%' : '2px';
    piece.style.setProperty('--fall-dur', fallDur + 's');
    piece.style.setProperty('--fall-delay', fallDelay + 's');
    piece.style.setProperty('--rotation', rotation);

    document.body.appendChild(piece);

    // Supprimer après animation
    setTimeout(() => piece.remove(), (fallDur + fallDelay) * 1000 + 500);
  }
}

/* ============================================
   PARTICULES DE FOND (Canvas)
   ============================================ */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  const count = 80;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.golden = Math.random() > 0.5;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      const color = this.golden ? `rgba(212, 175, 55, ${this.opacity})` : `rgba(240, 230, 246, ${this.opacity * 0.5})`;
      ctx.fillStyle = color;
      ctx.fill();
    }
  }

  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ============================================
   ÉTOILES ANIMÉES
   ============================================ */
function createStars() {
  const container = document.querySelector('.stars-container');
  if (!container) return;

  for (let i = 0; i < 40; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.setProperty('--duration', (2 + Math.random() * 4) + 's');
    star.style.animationDelay = Math.random() * 5 + 's';
    container.appendChild(star);
  }
}

/* ============================================
   PARTICULES AUTOUR DE LA PHOTO
   ============================================ */
function createPhotoParticles() {
  const container = document.querySelector('.photo-particles');
  if (!container) return;

  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.classList.add('photo-particle');

    const angle = (i / 12) * Math.PI * 2;
    const radius = 130 + Math.random() * 30;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    p.style.left = '50%';
    p.style.top = '50%';
    p.style.setProperty('--tx', x * 0.5 + 'px');
    p.style.setProperty('--ty', y * 0.5 + 'px');
    p.style.setProperty('--tx2', x + 'px');
    p.style.setProperty('--ty2', y + 'px');
    p.style.setProperty('--dur', (3 + Math.random() * 2) + 's');
    p.style.setProperty('--delay', Math.random() * 3 + 's');

    container.appendChild(p);
  }
}

/* ============================================
   ANIMATIONS AU SCROLL (Intersection Observer)
   ============================================ */
function initScrollAnimations() {
  // Hero — apparition immédiate
  setTimeout(() => {
    document.querySelector('.hero-title')?.classList.add('visible');
    document.querySelector('.hero-subtitle')?.classList.add('visible');
  }, 300);

  // Observer pour les éléments au scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Cartes qualités
        if (entry.target.classList.contains('quality-card')) {
          entry.target.classList.add('visible');
        }
        // Lignes de message typing
        if (entry.target.classList.contains('message-text')) {
          const lines = entry.target.querySelectorAll('.typing-line');
          lines.forEach((line, i) => {
            setTimeout(() => line.classList.add('visible'), i * 400);
          });
        }
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.quality-card').forEach(el => observer.observe(el));
  document.querySelectorAll('.message-text').forEach(el => observer.observe(el));
}

/* ============================================
   MODAL
   ============================================ */
function initModal() {
  const overlay = document.getElementById('modal-overlay');
  const openBtn = document.getElementById('cta-open');
  const closeBtn = document.getElementById('modal-close');

  if (!overlay || !openBtn) return;

  openBtn.addEventListener('click', () => {
    overlay.classList.add('active');
  });

  closeBtn?.addEventListener('click', () => {
    overlay.classList.remove('active');
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
  });
}

/* ============================================
   MUSIQUE (Play / Pause)
   ============================================ */
function initMusic() {
  const btn = document.getElementById('music-btn');
  const audio = document.getElementById('bg-music');
  if (!btn || !audio) return;

  let playing = false;

  btn.addEventListener('click', () => {
    if (playing) {
      audio.pause();
      btn.textContent = '🎵';
      btn.classList.remove('playing');
    } else {
      audio.play().catch(() => {});
      btn.textContent = '⏸';
      btn.classList.add('playing');
    }
    playing = !playing;
  });
}

/* ============================================
   PHOTO — Afficher l'image si elle se charge
   ============================================ */
function initPhoto() {
  const img = document.querySelector('.photo-placeholder img');
  const placeholder = document.querySelector('.photo-placeholder');
  if (!img || !placeholder) return;

  img.addEventListener('load', () => {
    placeholder.classList.add('has-photo');
  });

  img.addEventListener('error', () => {
    img.style.display = 'none';
  });

  if (img.complete && img.naturalWidth > 0) {
    placeholder.classList.add('has-photo');
  }
}
