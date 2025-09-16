// Minimal, dependency-free GitHub portfolio loader for user 95027
(async () => {
  const GITHUB_USER = '95027';
  const headers = { 'Accept': 'application/vnd.github+json' };
  const DEFAULT_AVATAR = `https://github.com/${GITHUB_USER}.png`;

  const select = (q) => document.querySelector(q);
  const create = (tag, cls) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    return el;
  };

  const nameEl = select('#name');
  const bioEl = select('#bio');
  const avatarEl = select('#avatar');
  const linksEl = select('#links');
  const footerYear = select('#footer-year');
  const menuBtn = select('#menu-btn');
  const mobileNav = select('#mobile-nav');
  const statRepos = select('#stat-repos');
  const statFollowers = select('#stat-followers');
  const statFollowing = select('#stat-following');
  const socials = select('#socials');

  if (footerYear) footerYear.textContent = new Date().getFullYear();

  const gh = async (path, params = {}) => {
    const url = new URL(`https://api.github.com/${path}`);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  };

  // Fetch GitHub profile
  const profile = await gh(`users/${GITHUB_USER}`).catch(() => null);
  if (profile) {
    if (avatarEl) avatarEl.src = profile.avatar_url || DEFAULT_AVATAR;
    if (statRepos) statRepos.textContent = profile.public_repos ?? '—';
    if (statFollowers) statFollowers.textContent = profile.followers ?? '—';
    if (statFollowing) statFollowing.textContent = profile.following ?? '—';

    const profileLinks = [
      { label: 'GitHub', href: profile.html_url },
      profile.blog ? { label: 'Website', href: profile.blog } : null,
      profile.twitter_username
        ? { label: 'Twitter', href: `https://twitter.com/${profile.twitter_username}` }
        : null,
      { label: 'Email', href: 'mailto:kumarchhembeti26@gmail.com' },
    ].filter(Boolean);

    profileLinks.forEach((l) => {
      const a = create('a', 'tag');
      a.href = l.href;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = l.label;
      // linksEl?.appendChild(a);
      socials?.appendChild(a.cloneNode(true));
    });
  } else {
    if (avatarEl && !avatarEl.src) avatarEl.src = DEFAULT_AVATAR;
  }

  // Mobile menu toggle
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
    });
    mobileNav.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => mobileNav.classList.add('hidden'))
    );
  }

  // Active section highlighting
  const navLinks = [...document.querySelectorAll('nav a[href^="#"]')];
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = `#${entry.target.id}`;
        navLinks.forEach((a) => {
          if (a.getAttribute('href') === id) {
            a.classList.toggle('text-teal-400', entry.isIntersecting);
          }
        });
      });
    },
    { rootMargin: '-40% 0px -50% 0px', threshold: 0.1 }
  );

  sections.forEach((sec) => observer.observe(sec));
})();
