import { beasts } from './data.js';
import { pageTurn, toggleAmbient } from './audio.js';

const archive = document.getElementById('archive');
const stage = document.querySelector('.beast-stage');
const image = document.getElementById('specimen-image');
const cards = [...document.querySelectorAll('.record-card')];
const regions = [...document.querySelectorAll('.map-region')];
const mapBoard = document.querySelector('.map-board');
const mapLegend = document.querySelector('.map-legend');
const mapLabel = document.querySelector('[data-map-label]');
const dialog = document.getElementById('record-dialog');
const relatedRecords = dialog.querySelector('.related-records');
const fields = ['name', 'latin', 'description', 'no', 'source', 'region', 'rank', 'element', 'place'];
const recordFields = ['no', 'name', 'latin', 'source', 'region', 'rank', 'element', 'research', 'quote'];
const statFields = ['strength', 'speed', 'wisdom', 'ability', 'danger'];
let current = 'yinglong';

Object.values(beasts).forEach(({ image: source }) => {
  const preload = new Image();
  preload.src = source;
});

function updateFieldValues(beast) {
  fields.forEach((field) => document.querySelectorAll(`[data-field="${field}"]`).forEach((node) => { node.textContent = beast[field]; }));
  document.querySelector('[data-field="seal"]').textContent = beast.seal;
}

function changeSpecimenImage(beast) {
  image.classList.add('is-leaving');
  window.setTimeout(() => {
    image.src = beast.image;
    image.alt = `${beast.name}原创异兽档案图`;
    image.decode?.().catch(() => {}).finally(() => image.classList.remove('is-leaving'));
  }, 180);
}

function syncMapState(id) {
  const beast = beasts[id];
  if (!beast) return;

  mapBoard.dataset.activeBeast = id;
  regions.forEach((region) => {
    const selected = region.dataset.beast === id;
    region.classList.toggle('active', selected);
    region.setAttribute('aria-pressed', String(selected));
  });
  mapLabel.textContent = beast.mapLabel;
  mapLegend.classList.remove('is-refreshing');
  void mapLegend.offsetWidth;
  mapLegend.classList.add('is-refreshing');
}

function getScrollBehavior() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

function triggerMapScan() {
  mapBoard.classList.remove('is-scanning');
  void mapBoard.offsetWidth;
  mapBoard.classList.add('is-scanning');
}

function renderRecordPanel(beast) {
  if (!beast) return;

  recordFields.forEach((field) => {
    const value = beast[field] ?? '档案待补全';
    dialog.querySelectorAll(`[data-record-field="${field}"]`).forEach((node) => { node.textContent = value; });
  });

  const recordImage = dialog.querySelector('[data-record-field="image"]');
  recordImage.src = beast.image ?? '';
  recordImage.alt = beast.name ? `${beast.name}原画档案` : '异兽原画档案';

  statFields.forEach((field) => {
    const rawValue = beast.stats?.[field];
    const hasValue = Number.isFinite(rawValue);
    const value = hasValue ? Math.max(0, Math.min(100, rawValue)) : 0;
    const output = dialog.querySelector(`[data-record-field="${field}"]`);
    const bar = dialog.querySelector(`[data-record-field="${field}-bar"]`);
    output.textContent = hasValue ? String(value) : '档案待补全';
    bar.style.width = `${value}%`;
    bar.closest('[role="progressbar"]').setAttribute('aria-valuenow', String(value));
  });

  relatedRecords.replaceChildren();
  Object.entries(beasts).forEach(([id, relatedBeast]) => {
    if (relatedBeast === beast) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.beast = id;
    button.textContent = `NO. ${relatedBeast.no} · ${relatedBeast.name}`;
    button.addEventListener('click', () => setSpecimen(id));
    relatedRecords.append(button);
  });
}

function openRecord(id = current) {
  const beast = beasts[id];
  if (!beast) return;
  if (id !== current) setSpecimen(id);
  renderRecordPanel(beast);
  if (!dialog.open) dialog.showModal();
}

function setSpecimen(id, shouldScroll = false) {
  if (!beasts[id]) return;
  if (id === current) {
    syncMapState(id);
    if (dialog.open) renderRecordPanel(beasts[id]);
    return;
  }
  const beast = beasts[id];
  current = id;
  if (dialog.open) renderRecordPanel(beast);
  pageTurn();
  archive.classList.remove('ready');
  archive.classList.add('transitioning');
  document.querySelector('.specimen-stamp').classList.remove('stamp-hit');
  changeSpecimenImage(beast);
  window.setTimeout(() => {
    updateFieldValues(beast);
    archive.style.setProperty('--red', beast.accent);
    archive.style.setProperty('--accent-rgb', beast.rgb);
    stage.dataset.specimen = id;
    cards.forEach((card) => { const selected = card.dataset.beast === id; card.classList.toggle('active', selected); card.setAttribute('aria-selected', String(selected)); });
    syncMapState(id);
    document.querySelector('.specimen-stamp').classList.add('stamp-hit');
    archive.classList.remove('transitioning');
    archive.classList.add('ready');
  }, 240);
  if (shouldScroll) document.getElementById('archive').scrollIntoView({ behavior: getScrollBehavior() });
}

cards.forEach((card) => card.addEventListener('click', () => openRecord(card.dataset.beast)));
regions.forEach((region) => region.addEventListener('click', () => {
  triggerMapScan();
  setSpecimen(region.dataset.beast, false);
}));
document.querySelector('.map-index-link').addEventListener('click', () => openRecord(current));
syncMapState(current);
document.addEventListener('pointermove', (event) => {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  archive.style.setProperty('--mx', `${event.clientX - innerWidth / 2}px`);
  archive.style.setProperty('--my', `${event.clientY - innerHeight / 2}px`);
});
const soundButton = document.getElementById('sound-toggle');
soundButton.addEventListener('click', () => {
  const isOn = toggleAmbient();
  soundButton.classList.toggle('active', isOn);
  soundButton.setAttribute('aria-pressed', String(isOn));
  soundButton.textContent = isOn ? '环境音 · 开' : '环境音 · 关';
});
document.getElementById('open-record').addEventListener('click', () => openRecord(current));
document.getElementById('close-record').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
window.addEventListener('load', () => archive.classList.add('ready'));

/* ---------- 移动端导航面板 ---------- */
const menuButton = document.querySelector('.menu');
const mobileNav = document.getElementById('mobile-nav');
if (menuButton && mobileNav) {
  const closeMobileNav = () => {
    mobileNav.classList.remove('open');
    menuButton.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', '打开菜单');
  };
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    menuButton.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
  });
  mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMobileNav));
}

/* ---------- 档案索引：搜索 + 经部分类 ---------- */
const searchInput = document.getElementById('records-search');
const filterChips = [...document.querySelectorAll('.filter-chip')];
const emptyHint = document.querySelector('.records-empty');
let activeFilter = 'all';

function applyRecordsFilter() {
  if (!searchInput) return;
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;
  cards.forEach((card) => {
    const beastId = card.dataset.beast || '';
    const category = card.dataset.category || '';
    const name = card.querySelector('strong')?.textContent || '';
    const no = card.querySelector('.card-no')?.textContent || '';
    const haystack = `${beastId} ${name} ${no} ${category}`.toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    const matchesFilter = activeFilter === 'all' || category === activeFilter;
    const show = matchesQuery && matchesFilter;
    card.classList.toggle('is-hidden', !show);
    if (show) visible += 1;
  });
  if (emptyHint) emptyHint.classList.toggle('is-hidden', visible > 0);
}

if (searchInput) {
  searchInput.addEventListener('input', applyRecordsFilter);
}
filterChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    filterChips.forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    activeFilter = chip.dataset.filter || 'all';
    applyRecordsFilter();
  });
});

/* ---------- 滚动揭示：板块进入视口时淡入上移 ---------- */
(function initReveal() {
  const items = [...document.querySelectorAll('[data-reveal]')];
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-revealed'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
  items.forEach((el) => io.observe(el));
})();

/* ---------- 山经体系：点击经部卡片联动档案索引筛选 ---------- */
(function initCanonFilter() {
  const canonLinks = [...document.querySelectorAll('[data-go-filter]')];
  if (!canonLinks.length) return;
  canonLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const filter = link.dataset.goFilter;
      if (!filter) return;
      const chip = filterChips.find((c) => c.dataset.filter === filter);
      if (!chip) return;
      filterChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      activeFilter = filter;
      if (searchInput) searchInput.value = '';
      applyRecordsFilter();
    });
  });
})();

/* ---------- 神话叙事：关联档案按钮联动抽屉 ---------- */
(function initMythLinks() {
  const links = [...document.querySelectorAll('[data-open-beast]')];
  if (!links.length) return;
  links.forEach((link) => {
    link.addEventListener('click', () => {
      const id = link.dataset.openBeast;
      if (id && beasts[id]) openRecord(id);
    });
  });
})();
