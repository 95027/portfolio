// Minimal, dependency-free GitHub portfolio loader for user 95027
(async () => {
  const GITHUB_USER = '95027';
  const headers = { 'Accept': 'application/vnd.github+json' };
  const DEFAULT_AVATAR = `https://github.com/${GITHUB_USER}.png`;

  const select = (q) => document.querySelector(q);
  const create = (tag, cls) => { const el = document.createElement(tag); if (cls) el.className = cls; return el; };

  const nameEl = select('#name');
  const bioEl = select('#bio');
  const avatarEl = select('#avatar');
  const linksEl = select('#links');
  const skillsEl = select('#skills-list');
  const footerYear = select('#footer-year');
  const menuBtn = select('#menu-btn');
  const mobileNav = select('#mobile-nav');
  const mainNav = select('#main-nav');
  const statRepos = select('#stat-repos');
  const statFollowers = select('#stat-followers');
  const statFollowing = select('#stat-following');
  const featuredGrid = select('#featured-grid');
  const socials = document.querySelector('#socials');
  footerYear.textContent = new Date().getFullYear();

  const gh = async (path, params = {}) => {
    const url = new URL(`https://api.github.com/${path}`);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  };

  const profile = await gh(`users/${GITHUB_USER}`).catch(() => null);
  if (profile) {
    // Keep custom hero heading and summary; do not overwrite name/bio
    if (profile.avatar_url) {
      avatarEl.src = profile.avatar_url;
    } else if (avatarEl && !avatarEl.src) {
      avatarEl.src = DEFAULT_AVATAR;
    }
    if (statRepos) statRepos.textContent = profile.public_repos ?? '—';
    if (statFollowers) statFollowers.textContent = profile.followers ?? '—';
    if (statFollowing) statFollowing.textContent = profile.following ?? '—';

    const profileLinks = [
      { label: 'GitHub', href: profile.html_url },
      profile.blog ? { label: 'Website', href: profile.blog } : null,
      profile.twitter_username ? { label: 'Twitter', href: `https://twitter.com/${profile.twitter_username}` } : null,
      { label: 'Email', href: 'mailto:kumarchhembeti26@gmail.com' },
    ].filter(Boolean);
    profileLinks.forEach(l => {
      const a = create('a', 'tag');
      a.href = l.href; a.target = '_blank'; a.rel = 'noopener'; a.textContent = l.label;
      linksEl.appendChild(a);
      if (socials) socials.appendChild(a.cloneNode(true));
    });
  } else {
    // Fallback when GitHub API is unavailable/rate-limited
    if (avatarEl && !avatarEl.src) {
      avatarEl.src = DEFAULT_AVATAR;
    }
  }

  // Mobile menu toggle
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      const isHidden = mobileNav.classList.contains('hidden');
      mobileNav.classList.toggle('hidden', !isHidden);
    });
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.add('hidden')));
  }

  // Active section highlighting
  const navLinks = [...document.querySelectorAll('nav a[href^="#"]')];
  const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = `#${entry.target.id}`;
      navLinks.forEach(a => {
        if (a.getAttribute('href') === id) {
          a.classList.toggle('text-teal-400', entry.isIntersecting);
        }
      });
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0.1 });
  sections.forEach(sec => observer.observe(sec));

  // Fetch repositories for skills only
  const repos = await gh(`users/${GITHUB_USER}/repos`, { per_page: 100, sort: 'updated' }).catch(() => []);

  // Try to fetch pinned via unofficial API (works for many profiles)
  let pinned = [];
  try {
    const res = await fetch(`https://gh-pinned-repos.egoist.dev/?username=${GITHUB_USER}`);
    pinned = res.ok ? await res.json() : [];
  } catch (_) {}

  // Build language frequency map
  const languageCount = new Map();
  repos.forEach(r => {
    if (r.language) {
      const key = r.language;
      languageCount.set(key, (languageCount.get(key) || 0) + 1);
    }
  });
  const languagesSorted = [...languageCount.entries()].sort((a, b) => b[1] - a[1]);
  languagesSorted.forEach(([lang, count]) => {
    const span = create('span', 'tag');
    span.textContent = `${lang} · ${count}`;
    skillsEl.appendChild(span);
  });

  // Featured section is static per user-provided projects

  const renderRepoCard = (repo) => {
    const a = create('a', 'card block p-4');
    a.href = repo.html_url; a.target = '_blank'; a.rel = 'noopener';
    const name = create('div', 'font-semibold'); name.textContent = repo.name;
    const desc = create('p', 'mt-1 text-sm text-slate-300 line-clamp-2'); desc.textContent = repo.description || 'No description';
    const meta = create('div', 'mt-3 flex items-center gap-4 text-xs text-slate-400');
    const lang = create('span'); lang.textContent = repo.language || '—';
    const stars = create('span'); stars.textContent = `★ ${repo.stargazers_count || 0}`;
    const upd = create('span'); upd.textContent = new Date(repo.pushed_at).toLocaleDateString();
    meta.append(lang, stars, upd);
    a.append(name, desc, meta);
    return a;
  };

  const setGrid = (items) => {
    repoGrid.innerHTML = '';
    items.slice(0, 9).forEach(item => {
      const data = item.repo || item; // pinned API uses {repo, link, description, ...}
      const repoObj = data.html_url ? data : {
        html_url: item.link,
        name: item.repo,
        description: item.description,
        language: item.language,
        stargazers_count: item.stars,
        pushed_at: item.pushed_at || new Date().toISOString()
      };
      repoGrid.appendChild(renderRepoCard(repoObj));
    });
    if (!items.length) {
      const empty = create('div', 'text-slate-400');
      empty.textContent = 'No repositories to display.';
      repoGrid.appendChild(empty);
    }
  };

  // Initial render: popular
  setGrid(byStars);

  filterEl.addEventListener('change', () => {
    const v = filterEl.value;
    if (v === 'popular') return setGrid(byStars);
    if (v === 'recent') return setGrid(byUpdated);
    if (v === 'pinned' && pinned.length) return setGrid(pinned);
    setGrid(repos);
  });

  // No contact form (removed) — socials rendered above
})();


