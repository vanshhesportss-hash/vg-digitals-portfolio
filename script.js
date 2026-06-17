document.addEventListener('DOMContentLoaded', () => {

    // ── Page load ─────────────────────────────────────────────────────────
    document.body.classList.add('page-loaded');

    // ── Mobile nav ────────────────────────────────────────────────────────
    const burger   = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('.nav-links');
    if (burger && navLinks) {
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            burger.classList.toggle('open');
        });
        navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            navLinks.classList.remove('open'); burger.classList.remove('open');
        }));
    }

    // ── Header scroll shadow ──────────────────────────────────────────────
    const header = document.querySelector('.main-header');
    if (header) window.addEventListener('scroll', () =>
        header.classList.toggle('scrolled', window.scrollY > 40), { passive:true });

    // ── Custom cursor ─────────────────────────────────────────────────────
    const cur   = document.querySelector('.custom-cursor');
    const trail = document.querySelector('.custom-cursor-trail');
    if (cur && trail && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
        let mx = window.innerWidth/2, my = window.innerHeight/2;
        let tx = mx, ty = my;
        let cursorVisible = true;

        // Position both on every rAF tick — cursor snaps, trail lerps
        const animCursor = () => {
            // Snap cursor to exact mouse
            cur.style.left  = mx + 'px';
            cur.style.top   = my + 'px';
            // Trail lerps behind
            tx += (mx - tx) * 0.14;
            ty += (my - ty) * 0.14;
            trail.style.left = tx + 'px';
            trail.style.top  = ty + 'px';
            requestAnimationFrame(animCursor);
        };
        animCursor();

        document.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            if (!cursorVisible) {
                cursorVisible = true;
                cur.classList.remove('hidden');
                trail.classList.remove('hidden');
            }
        }, { passive: true });

        // Hide when mouse leaves window
        document.addEventListener('mouseleave', () => {
            cursorVisible = false;
            cur.classList.add('hidden');
            trail.classList.add('hidden');
        });
        document.addEventListener('mouseenter', () => {
            cursorVisible = true;
            cur.classList.remove('hidden');
            trail.classList.remove('hidden');
        });

        // Hover state on interactive elements
        const hoverEls = 'a, button, .preview-card, .skill-tags span, input, textarea, select, label, .sticky-cta-bar, .whatsapp-float, .scroll-top-btn';
        document.querySelectorAll(hoverEls).forEach(el => {
            el.addEventListener('mouseenter', () => { cur.classList.add('hovered'); trail.classList.add('hovered'); });
            el.addEventListener('mouseleave', () => { cur.classList.remove('hovered'); trail.classList.remove('hovered'); });
        });
    }

    // ── Cursor glow ───────────────────────────────────────────────────────
    if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
        const glow = document.createElement('div'); glow.className='cursor-glow'; document.body.appendChild(glow);
        let gx=-300,gy=-300,cgx=-300,cgy=-300;
        document.addEventListener('mousemove', e=>{gx=e.clientX;gy=e.clientY;},{passive:true});
        const ag = ()=>{ cgx+=(gx-cgx)*0.06; cgy+=(gy-cgy)*0.06; glow.style.transform=`translate(${cgx-190}px,${cgy-190}px)`; requestAnimationFrame(ag); };
        ag();
    }

    // ── Scroll-reveal ─────────────────────────────────────────────────────
    const revealEls = document.querySelectorAll(
        '.preview-card,.hero-text,.form-box,.about-me-layout > *,.page-title,.page-subtitle,.skill-category,.section-headline-block,.score-stat,.process-step,.scoreboard-wrap'
    );
    const ro = new IntersectionObserver(entries => {
        entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('revealed'); ro.unobserve(e.target); } });
    }, { threshold:0.1, rootMargin:'0px 0px -40px 0px' });
    revealEls.forEach(el => { el.classList.add('will-reveal'); ro.observe(el); });

    // Stagger grid cards
    document.querySelectorAll('.grid-2,.grid-3,.grid-4').forEach(g =>
        g.querySelectorAll('.preview-card').forEach((c,i) => c.style.transitionDelay=`${i*85}ms`));

    // ── Particle canvas ───────────────────────────────────────────────────
    const heroSec = document.querySelector('.hero-section');
    if (heroSec) {
        const canvas = document.createElement('canvas'); canvas.className='hero-canvas'; heroSec.prepend(canvas);
        const ctx = canvas.getContext('2d');
        let W,H;
        const resize=()=>{ W=canvas.width=heroSec.offsetWidth; H=canvas.height=heroSec.offsetHeight; };
        resize(); window.addEventListener('resize',resize,{passive:true});
        const pts = Array.from({length:65},()=>({
            x:Math.random()*1500,y:Math.random()*800,
            vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,
            r:Math.random()*1.4+.4,
            color:Math.random()>.5?'#236CFF':'#FF6723',
            a:Math.random()*.4+.1
        }));
        const draw=()=>{
            ctx.clearRect(0,0,W,H);
            pts.forEach(p=>{
                p.x+=p.vx; p.y+=p.vy;
                if(p.x<0)p.x=W; if(p.x>W)p.x=0; if(p.y<0)p.y=H; if(p.y>H)p.y=0;
                ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
                ctx.fillStyle=p.color; ctx.globalAlpha=p.a; ctx.fill();
            });
            for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
                const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
                if(d<115){ ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y);
                    ctx.strokeStyle='#236CFF'; ctx.globalAlpha=(1-d/115)*.09; ctx.lineWidth=.5; ctx.stroke(); }
            }
            ctx.globalAlpha=1; requestAnimationFrame(draw);
        };
        draw();
    }

    // ── Typing text ───────────────────────────────────────────────────────
    const typingEl = document.querySelector('.typing-text');
    if (typingEl) {
        const words = ['Full-Court Press','Performance Engine','Growth Architecture','Conversion Machine'];
        let wi=0,ci=0,del=false;
        const type=()=>{
            const w=words[wi];
            if(!del){ typingEl.textContent=w.slice(0,++ci); if(ci===w.length){del=true;setTimeout(type,2100);return;} }
            else { typingEl.textContent=w.slice(0,--ci); if(ci===0){del=false;wi=(wi+1)%words.length;} }
            setTimeout(type,del?48:88);
        };
        type();
    }

    // ── Animated counters ─────────────────────────────────────────────────
    document.querySelectorAll('[data-count]').forEach(el=>{
        const target=+el.dataset.count, suf=el.dataset.suffix||'';
        const obs=new IntersectionObserver(entries=>{
            if(!entries[0].isIntersecting)return; obs.disconnect();
            let n=0;
            const step=()=>{ n+=Math.ceil((target-n)/14)||1; el.textContent=n+suf; if(n<target)requestAnimationFrame(step); else el.textContent=target+suf; };
            setTimeout(()=>requestAnimationFrame(step),200);
        },{threshold:.6}); obs.observe(el);
    });

    // ── 3D card tilt ──────────────────────────────────────────────────────
    if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
        document.querySelectorAll('.preview-card').forEach(card=>{
            card.addEventListener('mousemove',e=>{
                const r=card.getBoundingClientRect();
                const x=((e.clientX-r.left)/r.width-.5)*13;
                const y=((e.clientY-r.top)/r.height-.5)*-13;
                card.style.transform=`translateY(-6px) rotateY(${x}deg) rotateX(${y}deg)`;
            });
            card.addEventListener('mouseleave',()=>card.style.transform='');
        });
    }

    // ── Magnetic buttons ──────────────────────────────────────────────────
    if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
        document.querySelectorAll('.mag-btn').forEach(btn=>{
            btn.addEventListener('mousemove',e=>{
                const r=btn.getBoundingClientRect();
                const x=(e.clientX-r.left-r.width/2)*0.28;
                const y=(e.clientY-r.top-r.height/2)*0.28;
                btn.style.transform=`translate(${x}px,${y}px) scale(1.04)`;
            });
            btn.addEventListener('mouseleave',()=>btn.style.transform='');
        });
    }

    // ── Button ripple ─────────────────────────────────────────────────────
    document.querySelectorAll('.btn').forEach(btn=>{
        btn.addEventListener('click',function(e){
            const rip=document.createElement('span'); rip.className='btn-ripple';
            const rect=this.getBoundingClientRect(),size=Math.max(rect.width,rect.height);
            rip.style.cssText=`width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
            this.appendChild(rip); setTimeout(()=>rip.remove(),600);
        });
    });

    // ── Skill tag animations ──────────────────────────────────────────────
    document.querySelectorAll('.skill-tags span').forEach((t,i)=>{ t.classList.add('skill-tag-animate'); t.style.animationDelay=`${i*100}ms`; });

    // ── Shimmer placeholders ──────────────────────────────────────────────
    document.querySelectorAll('.img-placeholder').forEach(el=>el.classList.add('shimmer'));

    // ── Form UX ───────────────────────────────────────────────────────────
    document.querySelectorAll('.form-group input,.form-group textarea').forEach(inp=>{
        inp.addEventListener('focus',()=>inp.closest('.form-group').classList.add('focused'));
        inp.addEventListener('blur',()=>{ if(!inp.value)inp.closest('.form-group').classList.remove('focused'); });
    });
    document.querySelectorAll('form').forEach(form=>{
        form.addEventListener('submit',async e=>{
            e.preventDefault();
            const btn=form.querySelector('button[type="submit"]');
            const orig=btn.textContent; btn.textContent='Processing…'; btn.disabled=true; btn.style.opacity='.65';
            await new Promise(r=>setTimeout(r,1100));
            let box=form.querySelector('.form-status-inline');
            if(!box){box=document.createElement('div');box.className='form-status-inline';form.appendChild(box);}
            box.textContent='✅ Received! Our engineering core will reach out within 24 hours.';
            box.className='form-status-inline success'; box.style.display='block';
            btn.textContent=orig; btn.disabled=false; btn.style.opacity='1';
            form.reset(); setTimeout(()=>box.style.display='none',7000);
        });
    });

    // ── Scroll-to-top ─────────────────────────────────────────────────────
    const scrollBtn=document.createElement('button'); scrollBtn.className='scroll-top-btn';
    scrollBtn.setAttribute('aria-label','Back to top'); scrollBtn.innerHTML='↑';
    document.body.appendChild(scrollBtn);
    window.addEventListener('scroll',()=>scrollBtn.classList.toggle('visible',window.scrollY>500),{passive:true});
    scrollBtn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

    // ── Sticky CTA bar ────────────────────────────────────────────────────
    const stickyCTA = document.getElementById('sticky-cta');
    const stickyClose = document.getElementById('sticky-cta-close');
    let ctaClosed = false;
    if(stickyCTA){
        window.addEventListener('scroll',()=>{
            if(!ctaClosed) stickyCTA.classList.toggle('visible', window.scrollY > 600);
        },{passive:true});
        if(stickyClose) stickyClose.addEventListener('click',()=>{ ctaClosed=true; stickyCTA.classList.remove('visible'); });
    }

    // ── Exit intent popup ─────────────────────────────────────────────────
    const exitOverlay = document.getElementById('exit-overlay');
    const exitClose   = document.getElementById('exit-close');
    const exitDismiss = document.getElementById('exit-dismiss');
    let exitShown = false;
    if(exitOverlay){
        document.addEventListener('mouseleave', e=>{
            if(e.clientY<10 && !exitShown && window.scrollY>300){
                exitShown=true; exitOverlay.classList.add('visible');
            }
        });
        const closeExit=()=>exitOverlay.classList.remove('visible');
        if(exitClose)   exitClose.addEventListener('click',closeExit);
        if(exitDismiss) exitDismiss.addEventListener('click',closeExit);
        exitOverlay.addEventListener('click',e=>{ if(e.target===exitOverlay)closeExit(); });
    }

    // ── Basketball scroll animation ───────────────────────────────────────
    const courtContainer = document.getElementById('bball-court');
    const player  = document.getElementById('bball-player');
    const ball    = document.getElementById('bball-ball');
    const progLine= document.getElementById('bball-progress-line');
    const scoreEl = document.getElementById('bball-score');
    const phaseLabel = document.getElementById('bball-phase');
    const phases  = ['Scroll to start the play →','📋 AUDIT — Diagnosing your systems','🧠 STRATEGY — Building the playbook','🔨 BUILD — Deploying the stack','🚀 LAUNCH — Going live across all channels','🔥 SCALE — Dominating the market!'];
    let lastScored = false;

    if(courtContainer && player && ball){
        const onScroll = ()=>{
            const rect = courtContainer.getBoundingClientRect();
            const winH  = window.innerHeight;
            // Animate when section is in view: from rect.top=winH down to rect.top=-rect.height
            const totalRange = winH + rect.height;
            const entered    = winH - rect.top; // 0 at top of screen, totalRange when bottom passes
            const pct        = Math.max(0, Math.min(1, entered / totalRange));

            // ball travels x: 80 → 876, arc peaks at mid
            const startX = 80, endX = 876;
            const bx = startX + (endX-startX)*pct;
            const arcPeak = 110;
            const by_arc  = 4*arcPeak*pct*(1-pct);
            const by_base = 140;

            ball.setAttribute('x', bx-10);
            ball.setAttribute('y', by_base - by_arc);
            // rotate
            ball.setAttribute('transform', `rotate(${pct*720},${bx},${by_base-by_arc})`);

            // player follows behind
            const px = Math.max(30, bx-60);
            player.setAttribute('x', px-14);
            if(pct>0.9) player.textContent='🏃‍♂️💨'; else player.textContent='🏃';

            // progress line
            const dotPositions=[160,320,480,640,810];
            const lineEnd = startX + (810-startX)*pct;
            progLine.setAttribute('x2', Math.min(810, lineEnd));

            // phase label
            const phaseIdx = Math.min(5, Math.floor(pct*5.5));
            if(phaseLabel) phaseLabel.textContent = phases[phaseIdx] || phases[5];

            // score!
            if(pct>=0.97 && !lastScored){
                lastScored=true;
                scoreEl.setAttribute('opacity','1');
                scoreEl.style.animation='';
                void scoreEl.offsetWidth;
                setTimeout(()=>scoreEl.setAttribute('opacity','0'),2500);
            }
            if(pct<0.9) lastScored=false;
        };
        window.addEventListener('scroll', onScroll, {passive:true});
        onScroll();
    }

    // ── Active nav on scroll ──────────────────────────────────────────────
    const sections = document.querySelectorAll('section[id],main[id]');
    if(sections.length){
        const navObs=new IntersectionObserver(entries=>{
            entries.forEach(e=>{ if(!e.isIntersecting)return;
                document.querySelectorAll('.nav-links a').forEach(a=>
                    a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id));
            });
        },{rootMargin:'-40% 0px -55% 0px'});
        sections.forEach(s=>navObs.observe(s));
    }

});
