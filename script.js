document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu toggle
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    if (menu && icon) {
        function toggleMenu() {
            menu.classList.toggle("open");
            icon.classList.toggle("open");
        }
        icon.addEventListener('click', toggleMenu);
        const menuLinks = document.querySelectorAll('.menu-links a');
        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Allow normal navigation for external links if any, and smooth scroll for internal
                if (link.getAttribute('href').startsWith('#')) {
                    toggleMenu();
                }
            });
        });
    }

    // Theme toggle functionality
    const themeToggleButton = document.getElementById('themeToggleButton');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || !savedTheme) {
        body.classList.add('dark-theme');
        themeToggleButton.textContent = '🌙';
    } else {
        themeToggleButton.textContent = '☀';
    }
    themeToggleButton.addEventListener('click', function() {
        body.classList.toggle('dark-theme');
        const isDarkMode = body.classList.contains('dark-theme');
        themeToggleButton.textContent = isDarkMode ? '🌙' : '☀';
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });

    // Dynamically load sections
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

    if (mainContent) {
        const fetchPromises = sections.map(section => {
            return fetch(`sections/${section}.html`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.text();
                });
        });

        Promise.all(fetchPromises)
            .then(htmls => {
                mainContent.innerHTML = htmls.join('');
                try {
                    // Restore colored blended bands on the center timeline
                    applyProportionalTimeline();
                    // Ticks and midpoint markers disabled per design preference
                    // applyTimelineTicks();
                    // applyTimelineMidpoints();
                    applyDateChips();
                    applyItemDots();
                } catch (e) { console.warn('Timeline visuals not applied:', e); }

                // Optional dev checks (enable with ?dev=1 or localStorage.devChecks='1')
                try {
                    const params = new URLSearchParams(location.search);
                    const enable = params.has('dev') || localStorage.getItem('devChecks') === '1';
                    if (enable) runDevLayoutChecks();
                } catch (e) { /* noop */ }
            })
            .catch(error => {
                console.error('Error loading sections:', error);
                mainContent.innerHTML = '<p style="text-align: center; padding: 50px;">Error loading page content. Please try again later.</p>';
            });
    }
});

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
