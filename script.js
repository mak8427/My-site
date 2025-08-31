document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu toggle (bound initially; re-bound after nav rebuild)
    function bindHamburger() {
        const menu = document.querySelector('.menu-links');
        const icon = document.querySelector('.hamburger-icon');
        if (!menu || !icon) return;
        function toggleMenu() {
            menu.classList.toggle('open');
            icon.classList.toggle('open');
            const expanded = icon.classList.contains('open');
            icon.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        }
        icon.onclick = toggleMenu;
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (link.getAttribute('href').startsWith('#')) toggleMenu();
            });
        });
    }
    bindHamburger();

    // Theme toggle functionality (shared between desktop + mobile if present)
    function bindThemeToggle() {
        const body = document.body;
        const btns = Array.from(document.querySelectorAll('#themeToggleButton, #themeToggleButtonMobile'));
        const saved = localStorage.getItem('theme');
        if (saved === 'dark' || !saved) {
            body.classList.add('dark-theme');
            btns.forEach(b => b && (b.textContent = '🌙'));
        } else {
            btns.forEach(b => b && (b.textContent = '☀'));
        }
        btns.forEach(btn => btn && btn.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            const isDark = body.classList.contains('dark-theme');
            btns.forEach(b => b && (b.textContent = isDark ? '🌙' : '☀'));
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        }));
    }
    bindThemeToggle();

    // Dynamically load sections (graceful if files are missing)
    const sections = [
        'profile',
        'about',
        'experience',      // fused: includes education + volunteering anchors
        'technologies',
        'projects',
        'publications',
        'contact'
    ];
    const mainContent = document.getElementById('main-content');

    async function loadSections() {
        if (!mainContent) return;
        const names = sections.slice();
        const results = await Promise.allSettled(
            names.map(name => fetch(`sections/${name}.html`).then(r => r.ok ? r.text() : Promise.reject(r.status)))
        );
        // Debug: log any missing sections
        results.forEach((r, i) => {
            if (r.status !== 'fulfilled') {
                console.warn('[Sections] Failed to load', names[i], r.reason);
            }
        });
        const htmls = results
            .map(r => (r.status === 'fulfilled' ? r.value : ''))
            .filter(Boolean);
        mainContent.innerHTML = htmls.join('');

        try {
            applyProportionalTimeline();
            applyDateChips();
            applyItemDots();
        } catch (e) {
            console.warn('Timeline visuals not applied:', e);
        }

        // After content is present, rebuild navs to match available anchors/sections
        rebuildNavFromDom();
        bindHamburger();
        bindThemeToggle();
        initScrollProgress();

        // Normalize vertical spacing between sections to avoid any visual crop/overlap
        normalizeSectionSpacing(32); // ensure at least 32px between adjacent sections
        window.addEventListener('resize', () => normalizeSectionSpacing(32));
        window.addEventListener('load', () => normalizeSectionSpacing(32));
        setTimeout(() => normalizeSectionSpacing(32), 100);

        // Optional dev checks
        try {
            const params = new URLSearchParams(location.search);
            const enable = params.has('dev') || localStorage.getItem('devChecks') === '1';
            if (enable) runDevLayoutChecks();
        } catch { /* noop */ }
    }

    loadSections();
});

// Build nav links based on actual sections/anchors present in DOM
function rebuildNavFromDom() {
    // Build only top-level sections. We intentionally exclude
    // in-Experience anchors like #education and #volunteering
    // so they don't appear as separate nav items.
    const order = [
        { id: 'about', label: 'About' },
        { id: 'experience', label: 'Experience' },
        { id: 'technologies', label: 'Technologies' },
        { id: 'projects', label: 'Projects' },
        { id: 'publications', label: 'Publications' },
        { id: 'contact', label: 'Contact' }
    ];
    const present = order.filter(o => document.getElementById(o.id));

    function renderList(container, themeBtnId) {
        if (!container) return;
        container.innerHTML = '';
        const ul = container.tagName.toLowerCase() === 'ul' ? container : document.createElement('ul');
        if (container !== ul) { container.appendChild(ul); }
        if (themeBtnId) {
            const li = document.createElement('li');
            li.innerHTML = `<button id="${themeBtnId}" aria-label="Toggle theme">☀</button>`;
            ul.appendChild(li);
        }
        present.forEach(o => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${o.id}`;
            a.textContent = o.label;
            li.appendChild(a);
            ul.appendChild(li);
        });
    }

    renderList(document.querySelector('#desktop-nav .nav-links'), 'themeToggleButton');
    // include theme toggle on mobile too
    renderList(document.querySelector('#hamburger-nav .menu-links ul') || document.querySelector('#hamburger-nav .menu-links'), 'themeToggleButtonMobile');
    // footer nav mirrors available links, no theme toggle
    renderList(document.getElementById('footer-nav-links'), null);

    // Re-bind active-link highlighting
    setActiveLinkOnScroll(present.map(p => p.id));

    // Initialize indicator position to the first available link
    const first = document.querySelector('#desktop-nav .nav-links a');
    if (first) {
        updateNavIndicator(first);
        const firstSection = document.getElementById(present[0]?.id);
        if (firstSection) updateNavAccentFromSection(firstSection);
    }
}

// Highlight nav link for the section in view
function setActiveLinkOnScroll(ids) {
    const links = new Map();
    document.querySelectorAll('#desktop-nav .nav-links a, #hamburger-nav .menu-links a').forEach(a => {
        const id = a.getAttribute('href').replace('#','');
        links.set(id, a);
    });
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            const id = e.target.id;
            const link = links.get(id);
            if (!link) return;
            if (e.isIntersecting) {
                document.querySelectorAll('#desktop-nav .nav-links a.active, #hamburger-nav .menu-links a.active').forEach(n => n.classList.remove('active'));
                link.classList.add('active');
                // Update indicator position and accent color
                updateNavIndicator(link);
                updateNavAccentFromSection(e.target);
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) obs.observe(el);
    });

    // Reposition indicator on resize
    window.addEventListener('resize', () => {
        const active = document.querySelector('#desktop-nav .nav-links a.active');
        if (active) updateNavIndicator(active);
    });
}

// Move the desktop nav indicator under the provided link
function updateNavIndicator(link) {
    const indicator = document.getElementById('nav-indicator');
    const nav = document.getElementById('desktop-nav');
    if (!indicator || !nav || !link) return;
    const navRect = nav.getBoundingClientRect();
    const rect = link.getBoundingClientRect();
    const x = rect.left - navRect.left;
    const w = rect.width;
    nav.style.setProperty('--nav-indicator-x', `${x}px`);
    nav.style.setProperty('--nav-indicator-w', `${w}px`);
    nav.classList.add('indicator-ready');
}

// Update nav accent color based on the current section's --section-accent
function updateNavAccentFromSection(sectionEl) {
    if (!sectionEl) return;
    const styles = getComputedStyle(sectionEl);
    const accent = styles.getPropertyValue('--section-accent').trim() || getComputedStyle(document.documentElement).getPropertyValue('--text-container-strong-color').trim();
    document.documentElement.style.setProperty('--nav-accent', accent);
}

// Scroll progress bar
function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    const update = () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    setTimeout(update, 50);
}

// Ensure each section has at least `minGap` px gap from the previous one.
// This dynamically compensates for absolute-positioned elements and varying content heights.
function normalizeSectionSpacing(minGap = 24) {
    const sections = Array.from(document.querySelectorAll('main section'));
    if (!sections.length) return;
    // Reset any previously applied margins to measure fresh
    sections.forEach(s => { s.style.marginTop = ''; });
    let prevBottom = null;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    sections.forEach((sec, i) => {
        const rect = sec.getBoundingClientRect();
        const top = rect.top + scrollY;
        const bottom = rect.bottom + scrollY;
        if (prevBottom !== null) {
            const needed = prevBottom + minGap - top;
            if (needed > 0) {
                // Apply only the extra needed spacing; preserve existing CSS margins implicitly
                sec.style.marginTop = `${needed}px`;
            }
        }
        prevBottom = Math.max(prevBottom === null ? -Infinity : prevBottom, bottom);
    });
}

// Build layered gradient bands on the center timeline to proportionally map time ranges.
function applyProportionalTimeline() {
    const timeline = document.querySelector('#experience .timeline');
    if (!timeline) return;

    // Colors from CSS variables (fallbacks for older browsers)
    const styles = getComputedStyle(document.documentElement);
    const exp = styles.getPropertyValue('--exp-accent').trim() || '#6366F1';
    const edu = styles.getPropertyValue('--edu-accent').trim() || '#10B981';
    const vol = styles.getPropertyValue('--vol-accent').trim() || '#F59E0B';

    // Helper to convert hex to rgba with alpha
    const hexToRgba = (hex, a) => {
        const h = hex.replace('#','');
        const bigint = parseInt(h.length===3 ? h.split('').map(c=>c+c).join('') : h, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    };

    // Time domain
    const d = (y,m=1)=> new Date(y, m-1, 1);
    const min = d(2020,1);
    // Fix the visible domain to 2020 -> 2025 (newest at top)
    const max = d(2025,12);
    const span = max.getTime() - min.getTime();
    const pct = (date)=> Math.max(0, Math.min(100, ((date.getTime() - min.getTime())/span)*100));

    // Bands (inclusive of overlaps). Use semi-transparent layers so colors blend visually.
    const bands = [
        { color: edu, alpha: 0.45, start: d(2020,1), end: d(2023,12) }, // BSc
        { color: edu, alpha: 0.45, start: d(2024,1), end: d(2025,12) },  // MSc clipped to 2025 top
        { color: exp, alpha: 0.45, start: d(2025,3), end: d(2025,12) },  // Experience in 2025
        { color: vol, alpha: 0.35, start: d(2021,10), end: d(2023,12) }, // Volunteering
    ];

    const gradients = bands.map(b => {
        const c = hexToRgba(b.color, b.alpha);
        const s = (100 - pct(b.start)).toFixed(2) + '%';
        const e = (100 - pct(b.end)).toFixed(2) + '%';
        const lo = Math.min(parseFloat(s), parseFloat(e)).toFixed(2) + '%';
        const hi = Math.max(parseFloat(s), parseFloat(e)).toFixed(2) + '%';
        // Transparent outside range; solid within (newest at top)
        return `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) ${lo}, ${c} ${lo}, ${c} ${hi}, rgba(0,0,0,0) ${hi}, rgba(0,0,0,0) 100%)`;
    });

    // Base line color at the bottom of the stack
    const base = getComputedStyle(document.documentElement).getPropertyValue('--primary-border-color').trim() || '#555';
    gradients.push(`linear-gradient(to bottom, ${base}, ${base})`);

    timeline.style.setProperty('--timeline-bg', gradients.join(','));
}

function applyTimelineTicks() {
    const timeline = document.querySelector('#experience .timeline');
    if (!timeline) return;
    // Remove existing
    const old = timeline.querySelector('.timeline-ticks');
    if (old) old.remove();

    const ticks = document.createElement('div');
    ticks.className = 'timeline-ticks';

    const d = (y,m=1)=> new Date(y, m-1, 1);
    const min = d(2020,1);
    const max = d(2025,12);
    const span = max.getTime() - min.getTime();
    const pct = (date)=> ((date.getTime() - min.getTime())/span)*100;
    const rpct = (date)=> 100 - pct(date); // newest at top

    for (let y = 2025; y >= 2020; y--) {
        const top = rpct(d(y,12));
        const tick = document.createElement('div');
        tick.className = 'timeline-tick';
        tick.style.top = top + '%';
        const label = document.createElement('span');
        label.className = 'label';
        label.textContent = String(y);
        tick.appendChild(label);
        ticks.appendChild(tick);
    }
    timeline.appendChild(ticks);
}

// --- Midpoint month markers per timeline item ---
function applyTimelineMidpoints() {
    const timeline = document.querySelector('#experience .timeline');
    if (!timeline) return;

    // Remove existing
    const old = timeline.querySelector('.timeline-midpoints');
    if (old) old.remove();

    const mids = document.createElement('div');
    mids.className = 'timeline-midpoints';

    // Domain config (Dependency inversion: pass config if needed later)
    const domainStart = new Date(2020, 0, 1); // Jan-2020
    const domainEnd = new Date(2025, 11, 1);  // Dec-2025 shown top

    // Utilities (Single responsibility: date math)
    const ymToDate = (ym) => {
        if (ym === 'present') return domainEnd;
        const [y, m] = ym.split('-').map(Number);
        return new Date(y, (m || 1) - 1, 1);
    };
    const toIndex = (d) => d.getFullYear() * 12 + d.getMonth();
    const clampDate = (d) => new Date(Math.min(Math.max(d.getTime(), domainStart.getTime()), domainEnd.getTime()));
    const indexToDate = (i) => new Date(Math.floor(i / 12), i % 12, 1);
    const two = (n) => (n < 10 ? '0' + n : '' + n);
    const pctFromDate = (d) => 100 - ((clampDate(d).getTime() - domainStart.getTime()) / (domainEnd.getTime() - domainStart.getTime())) * 100; // newest at top

    const items = timeline.querySelectorAll('.timeline-item[data-start]');
    items.forEach(item => {
        const start = ymToDate(item.getAttribute('data-start'));
        const end = ymToDate(item.getAttribute('data-end') || 'present');
        const sIdx = toIndex(start);
        const eIdx = toIndex(end);
        const midIdx = Math.round((sIdx + eIdx) / 2);
        const mid = indexToDate(midIdx);

        // Create marker near center line
        const marker = document.createElement('div');
        marker.className = 'timeline-mid';
        marker.style.top = pctFromDate(mid) + '%';
        const label = document.createElement('span');
        label.className = 'label';
        label.textContent = two(mid.getMonth() + 1);
        marker.appendChild(label);
        mids.appendChild(marker);
    });

    timeline.appendChild(mids);
}

// Replace center-line date strips with in-card date chips
function applyDateChips() {
    const items = document.querySelectorAll('#experience .timeline-item');
    items.forEach(item => {
        const strip = item.querySelector('.timeline-strip');
        const content = item.querySelector('.timeline-content');
        if (!strip || !content) return;
        const text = strip.textContent.trim();
        if (!text) return;

        // Hide the strip on the center line
        strip.style.display = 'none';

        // Inject a date chip inside the card, after the category badge if present
        const chip = document.createElement('span');
        chip.className = 'date-chip';
        chip.textContent = text;
        const badge = content.querySelector('.badge');
        if (badge && badge.nextSibling) {
            badge.parentNode.insertBefore(chip, badge.nextSibling);
        } else {
            content.insertBefore(chip, content.firstChild);
        }
    });
}

// Add a dot on the center line for each timeline item aligned with the arrow tip
function applyItemDots() {
    const timeline = document.querySelector('#experience .timeline');
    if (!timeline) return;

    // Remove existing generated item dots
    timeline.querySelectorAll('.timeline-item-dot').forEach(el => el.remove());

    const tlRect = timeline.getBoundingClientRect();
    const items = timeline.querySelectorAll('.timeline-item');
    items.forEach(item => {
        const content = item.querySelector('.timeline-content');
        if (!content) return;
        const cRect = content.getBoundingClientRect();
        // Arrow tip is at 22px from the top of .timeline-content
        // Nudge the dot a bit lower for visual spacing
        const tipY = cRect.top - tlRect.top + 22 + 12; // +12px downward
        const pct = (tipY / tlRect.height) * 100;

        const dot = document.createElement('span');
        dot.className = 'timeline-item-dot';
        if (item.classList.contains('is-experience')) dot.classList.add('dot--experience');
        if (item.classList.contains('is-education')) dot.classList.add('dot--education');
        if (item.classList.contains('is-volunteering')) dot.classList.add('dot--volunteering');
        dot.style.top = pct + '%';
        timeline.appendChild(dot);
    });

    // Recompute on resize/orientation change
    const onResize = () => { clearTimeout(onResize.tid); onResize.tid = setTimeout(applyItemDots, 100); };
    window.addEventListener('resize', onResize, { once: true });
    window.addEventListener('orientationchange', onResize, { once: true });
}

// --- Optional dev-time layout checks ---
function runDevLayoutChecks() {
    const badge = document.createElement('div');
    const styles = {
        position: 'fixed', right: '12px', bottom: '12px', zIndex: 9999,
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
        fontSize: '12px', padding: '8px 10px', borderRadius: '8px',
        background: 'rgba(0,0,0,0.75)', color: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
    };
    Object.assign(badge.style, styles);
    document.body.appendChild(badge);

    const check = () => {
        const issues = [];

        // 1) Section overlap checks (global, plus specific Experience -> Technologies)
        const sections = Array.from(document.querySelectorAll('section'));
        for (let i = 0; i < sections.length - 1; i++) {
            const a = sections[i].getBoundingClientRect();
            const b = sections[i + 1].getBoundingClientRect();
            const overlap = Math.max(0, a.bottom - b.top);
            if (overlap > 1) {
                const ida = sections[i].id || `section-${i}`;
                const idb = sections[i + 1].id || `section-${i + 1}`;
                issues.push(`Overlap: #${ida} -> #${idb} by ${overlap.toFixed(1)}px`);
            }
        }
        const exp = document.querySelector('#experience');
        const tech = document.querySelector('#technologies');
        if (exp && tech) {
            const a = exp.getBoundingClientRect();
            const b = tech.getBoundingClientRect();
            const overlap = Math.max(0, a.bottom - b.top);
            if (overlap > 1) issues.push(`Overlap: #experience -> #technologies by ${overlap.toFixed(1)}px`);
        }

        // 2) Timeline dot alignment with center line
        const tl = document.querySelector('#experience .timeline');
        const anyDot = document.querySelector('#experience .timeline-item-dot');
        if (tl && anyDot) {
            const cr = tl.getBoundingClientRect();
            const styles = getComputedStyle(tl);
            const shiftStr = styles.getPropertyValue('--center-shift');
            const shiftPx = parseFloat(shiftStr) || 0;
            const centerX = cr.left + cr.width / 2 + shiftPx; // actual line X
            // check several dots
            document.querySelectorAll('#experience .timeline-item-dot').forEach(d => {
                const dr = d.getBoundingClientRect();
                const dotX = dr.left + dr.width / 2;
                const delta = Math.abs(centerX - dotX);
                if (delta > 1.5) issues.push(`Item dot misaligned by ${delta.toFixed(1)}px`);
            });
        }

        // 3) Ensure ticks/midpoints are not visible
        const ticks = document.querySelector('#experience .timeline-ticks');
        const mids = document.querySelector('#experience .timeline-midpoints');
        const isVisible = (el) => el && window.getComputedStyle(el).display !== 'none' && el.offsetParent !== null;
        if (isVisible(ticks)) issues.push('Year ticks visible but should be hidden');
        if (isVisible(mids)) issues.push('Month midpoints visible but should be hidden');

        badge.textContent = issues.length ? `Layout checks: ${issues.length} issue(s)` : 'Layout checks: OK';
        badge.style.background = issues.length ? 'rgba(180,0,0,0.85)' : 'rgba(0,128,0,0.85)';

        // Also log details to console
        if (issues.length) {
            console.groupCollapsed('[DevChecks] Layout issues');
            issues.forEach(i => console.warn(i));
            console.groupEnd();
        }
    };

    const onResize = () => { clearTimeout(onResize.tid); onResize.tid = setTimeout(check, 120); };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    setTimeout(check, 50);
}
