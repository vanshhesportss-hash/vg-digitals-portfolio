document.addEventListener('DOMContentLoaded', () => {

    // ── Page load fade-in ────────────────────────────────────────────────────
    document.body.classList.add('page-loaded');

    // ── Mobile nav ───────────────────────────────────────────────────────────
    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks   = document.querySelector('.nav-links');
    if (burgerMenu && navLinks) {
        burgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            burgerMenu.classList.toggle('open');
        });
        navLinks.querySelectorAll('a').forEach(a =>
            a.addEventListener('click', () => {
                navLinks.classList.remove('open');
                burgerMenu.classList.remove('open');
            })
        );
    }

    // ── Header scroll shadow ─────────────────────────────────────────────────
    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', () =>
            header.classList.toggle('scrolled', window.scrollY > 40), { passive: true });
    }

    // ── Scroll-reveal via IntersectionObserver ───────────────────────────────
    const revealTargets = document.querySelectorAll(
        '.preview-card, .hero-text, .form-box, .about-me-layout > *, ' +
        '.page-title, .page-subtitle, .skill-category, .section-headline-block, ' +
        '.home-overview-section > .container > p'
    );
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                e.target.classList.add('revealed');
                revealObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(el => { el.classList.add('will-reveal'); revealObs.observe(el); });

    // ── Stagger cards inside grids ───────────────────────────────────────────
    document.querySelectorAll('.grid-2, .grid-3, .grid-4').forEach(grid => {
        grid.querySelectorAll('.preview-card').forEach((card, i) => {
            card.style.transitionDelay = `${i * 90}ms`;
        });
    });

    // ── Particle canvas on hero ──────────────────────────────────────────────
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        const canvas = document.createElement('canvas');
        canvas.className = 'hero-canvas';
        heroSection.prepend(canvas);
        const ctx = canvas.getContext('2d');
        let W, H;

        const resize = () => {
            W = canvas.width  = heroSection.offsetWidth;
            H = canvas.height = heroSection.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize, { passive: true });

        const particles = Array.from({ length: 60 }, () => ({
            x: Math.random() * 1400, y: Math.random() * 700,
            vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 1.4 + 0.4,
            color: Math.random() > 0.5 ? '#236CFF' : '#FF6723',
            alpha: Math.random() * 0.45 + 0.12
        }));

        const drawParticles = () => {
            ctx.clearRect(0, 0, W, H);
            particles.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
                if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.fill();
            });
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = '#236CFF';
                        ctx.globalAlpha = (1 - d / 120) * 0.1;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            ctx.globalAlpha = 1;
            requestAnimationFrame(drawParticles);
        };
        drawParticles();
    }

    // ── Typing animation on hero h1 span ────────────────────────────────────
    const heroSpan = document.querySelector('.hero-text h1 span');
    if (heroSpan) {
        const words = ['Full-Court Press', 'Performance Engine', 'Growth Architecture', 'Conversion Machine'];
        let wi = 0, ci = 0, deleting = false;
        const type = () => {
            const word = words[wi];
            if (!deleting) {
                heroSpan.textContent = word.slice(0, ++ci);
                if (ci === word.length) { deleting = true; setTimeout(type, 2000); return; }
            } else {
                heroSpan.textContent = word.slice(0, --ci);
                if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
            }
            setTimeout(type, deleting ? 50 : 90);
        };
        type();
    }

    // ── Animated counters ────────────────────────────────────────────────────
    document.querySelectorAll('[data-count]').forEach(el => {
        const target = +el.dataset.count;
        const suffix = el.dataset.suffix || '';
        const obs = new IntersectionObserver(entries => {
            if (!entries[0].isIntersecting) return;
            obs.disconnect();
            let n = 0;
            const step = () => {
                n += Math.ceil((target - n) / 12) || 1;
                el.textContent = n + suffix;
                if (n < target) requestAnimationFrame(step);
                else el.textContent = target + suffix;
            };
            requestAnimationFrame(step);
        }, { threshold: 0.6 });
        obs.observe(el);
    });

    // ── 3-D card tilt (desktop) ──────────────────────────────────────────────
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.querySelectorAll('.preview-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                const x = ((e.clientX - r.left) / r.width  - 0.5) * 12;
                const y = ((e.clientY - r.top)  / r.height - 0.5) * -12;
                card.style.transform = `translateY(-6px) rotateY(${x}deg) rotateX(${y}deg)`;
            });
            card.addEventListener('mouseleave', () => { card.style.transform = ''; });
        });
    }

    // ── Cursor glow (desktop) ────────────────────────────────────────────────
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const glow = document.createElement('div');
        glow.className = 'cursor-glow';
        document.body.appendChild(glow);
        let mx = -300, my = -300, cx = -300, cy = -300;
        document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
        const animGlow = () => {
            cx += (mx - cx) * 0.07;
            cy += (my - cy) * 0.07;
            glow.style.transform = `translate(${cx - 180}px, ${cy - 180}px)`;
            requestAnimationFrame(animGlow);
        };
        animGlow();
    }

    // ── Skill tags stagger ───────────────────────────────────────────────────
    document.querySelectorAll('.skill-tags span').forEach((tag, i) => {
        tag.classList.add('skill-tag-animate');
        tag.style.animationDelay = `${i * 110}ms`;
    });

    // ── Shimmer on img-placeholder ───────────────────────────────────────────
    document.querySelectorAll('.img-placeholder').forEach(el => el.classList.add('shimmer'));

    // ── Form UX: focus glow + inline submit feedback ─────────────────────────
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(inp => {
        inp.addEventListener('focus',  () => inp.closest('.form-group').classList.add('focused'));
        inp.addEventListener('blur',   () => {
            if (!inp.value) inp.closest('.form-group').classList.remove('focused');
        });
    });

    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', async e => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const orig = btn.textContent;
            btn.textContent = 'Processing…';
            btn.disabled = true;
            btn.style.opacity = '0.7';

            await new Promise(r => setTimeout(r, 1100));

            let box = form.querySelector('.form-status-inline');
            if (!box) { box = document.createElement('div'); box.className = 'form-status-inline'; form.appendChild(box); }
            box.textContent = '✅ Received! Our engineering core will reach out within 24 hours.';
            box.className = 'form-status-inline success';
            box.style.display = 'block';

            btn.textContent = orig;
            btn.disabled = false;
            btn.style.opacity = '1';
            form.reset();
            setTimeout(() => { box.style.display = 'none'; }, 6000);
        });
    });

    // ── Scroll-to-top button ─────────────────────────────────────────────────
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-top-btn';
    scrollBtn.setAttribute('aria-label', 'Back to top');
    scrollBtn.innerHTML = '↑';
    document.body.appendChild(scrollBtn);
    window.addEventListener('scroll', () =>
        scrollBtn.classList.toggle('visible', window.scrollY > 500), { passive: true });
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ── Active nav link highlight on scroll ──────────────────────────────────
    const sections = document.querySelectorAll('section[id], main[id]');
    if (sections.length) {
        const navObs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                document.querySelectorAll('.nav-links a').forEach(a =>
                    a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id)
                );
            });
        }, { rootMargin: '-40% 0px -55% 0px' });
        sections.forEach(s => navObs.observe(s));
    }

    // ── Ripple on buttons ────────────────────────────────────────────────────
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'btn-ripple';
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // ── Burger morph ─────────────────────────────────────────────────────────
    // handled via CSS .burger-menu.open

    // ── Smooth section entrance numbers (stat strip if present) ─────────────
    // ready for data-count attributes

});
