// ═══════════════════════════════════════════════════════════════
//  Yacht Away Now — Premium Interactive JavaScript
// ═══════════════════════════════════════════════════════════════

// ─── Scroll-based navbar + scroll-to-top visibility ───
window.addEventListener('scroll', function() {
  var navbar = document.getElementById('navbar');
  var scrollTop = document.getElementById('scrollTop');
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  if (scrollTop) scrollTop.classList.toggle('visible', window.scrollY > 400);
});

// ─── Mobile nav toggle ───
function toggleMobile() {
  document.getElementById('navLinks').classList.toggle('open');
  document.getElementById('mobileToggle').classList.toggle('open');
}

// ─── Scroll reveal with stagger effect ───
function initReveal() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        // Find siblings to stagger within the same parent
        var parent = entry.target.parentElement;
        var siblings = parent ? Array.from(parent.querySelectorAll('.reveal:not(.visible)')) : [];
        var index = siblings.indexOf(entry.target);
        var delay = index >= 0 ? index * 120 : 0;

        setTimeout(function() {
          entry.target.classList.add('visible');
        }, delay);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal:not(.visible)').forEach(function(el) {
    observer.observe(el);
  });
}

// ─── Active nav link ───
function setActiveNav() {
  var path = window.location.pathname.replace(/\/$/, '').toLowerCase();
  if (path === '' || path === '/index.html') path = '/';
  document.querySelectorAll('.nav-links a[href]').forEach(function(a) {
    var href = a.getAttribute('href').replace(/\/$/, '').toLowerCase();
    if (href === '' || href === '/index.html') href = '/';
    if (a.classList.contains('nav-cta') || a.classList.contains('nav-phone')) return;
    a.classList.toggle('active', href === path);
  });
}

// ─── Form handling (Formspree) ───
function handleFormSubmit(e) {
  e.preventDefault();
  var form = document.getElementById('contactForm');
  var data = new FormData(form);
  fetch(form.action, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
    .then(function(r) {
      if (r.ok) {
        form.style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';
      } else {
        alert('Something went wrong. Please call (727) 609-2248 directly.');
      }
    })
    .catch(function() {
      alert('Network error. Please call (727) 609-2248 directly.');
    });
}

// ─── FAQ toggle ───
function toggleFaq(el) {
  el.closest('.faq-item').classList.toggle('open');
}


// ═══════════════════════════════════════════════════════════════
//  PREMIUM FEATURES
// ═══════════════════════════════════════════════════════════════

// ─── 1. Scroll Progress Bar (gold) ───
function initScrollProgress() {
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.prepend(bar);

  window.addEventListener('scroll', function() {
    var scrollable = document.body.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    var pct = (window.scrollY / scrollable) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
}

// ─── 2. Counter Animation (hero stats) ───
function initCounters() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var text = el.textContent;
        var match = text.match(/^([\d,]+)/);
        if (!match) return;

        var target = parseInt(match[1].replace(/,/g, ''));
        var suffix = text.slice(match[1].length);
        var current = 0;
        var duration = 2000;
        var step = target / (duration / 16);

        var timer = setInterval(function() {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.innerHTML = Math.floor(current).toLocaleString() + suffix;
        }, 16);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.hero-stat-value').forEach(function(el) {
    observer.observe(el);
  });
}

// ─── 3. Photo Lightbox ───
function initLightbox() {
  var images = Array.from(document.querySelectorAll('.gallery-item img'));
  if (images.length === 0) return;

  // Create lightbox DOM
  var lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.id = 'lightbox';
  lb.innerHTML =
    '<button class="lightbox-close" aria-label="Close">&times;</button>' +
    '<button class="lightbox-prev" aria-label="Previous">&#8249;</button>' +
    '<img src="" alt="" id="lightbox-img">' +
    '<button class="lightbox-next" aria-label="Next">&#8250;</button>' +
    '<div class="lightbox-counter"><span id="lightbox-current">1</span> / <span id="lightbox-total">1</span></div>';
  document.body.appendChild(lb);

  var currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    document.getElementById('lightbox-img').src = images[index].src;
    document.getElementById('lightbox-img').alt = images[index].alt;
    document.getElementById('lightbox-current').textContent = index + 1;
    document.getElementById('lightbox-total').textContent = images.length;
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Attach click to each gallery item
  images.forEach(function(img, i) {
    var item = img.closest('.gallery-item');
    if (item) {
      item.style.cursor = 'pointer';
      item.addEventListener('click', function() { openLightbox(i); });
    }
  });

  // Controls
  lb.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lb.querySelector('.lightbox-prev').addEventListener('click', function() {
    openLightbox((currentIndex - 1 + images.length) % images.length);
  });
  lb.querySelector('.lightbox-next').addEventListener('click', function() {
    openLightbox((currentIndex + 1) % images.length);
  });

  // Click backdrop to close
  lb.addEventListener('click', function(e) {
    if (e.target === lb) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightbox((currentIndex - 1 + images.length) % images.length);
    if (e.key === 'ArrowRight') openLightbox((currentIndex + 1) % images.length);
  });
}

// ─── 4. Gold Floating Particles ───
function initParticles() {
  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  document.body.prepend(canvas);
  var ctx = canvas.getContext('2d');
  var particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function Particle() {
    this.reset(true);
  }

  Particle.prototype.reset = function(scatter) {
    this.x = Math.random() * canvas.width;
    this.y = scatter ? Math.random() * canvas.height : canvas.height + 10;
    this.size = Math.random() * 2 + 0.5;
    this.speedY = Math.random() * 0.5 + 0.2;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.5 + 0.1;
  };

  Particle.prototype.update = function() {
    this.y -= this.speedY;
    this.x += this.speedX + Math.sin(this.y * 0.01) * 0.2;
    if (this.y < -10) this.reset(false);
  };

  Particle.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(201, 168, 76, ' + this.opacity + ')';
    ctx.fill();
  };

  // 30 particles for subtlety
  for (var i = 0; i < 30; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var j = 0; j < particles.length; j++) {
      particles[j].update();
      particles[j].draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
}

// ─── 5. Smooth Parallax on Hero Background ───
function initParallax() {
  var hero = document.querySelector('.hero-bg');
  if (!hero) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', function() {
    var y = window.scrollY;
    if (y < window.innerHeight) {
      hero.style.transform = 'translateY(' + (y * 0.3) + 'px)';
    }
  }, { passive: true });
}


// ═══════════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', function() {
  // Core features
  initReveal();
  setActiveNav();

  // Premium features
  initScrollProgress();
  initCounters();
  initLightbox();
  initParticles();
  initParallax();
});
