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
    image.poster = beast.image;
    image.setAttribute('aria-label', `${beast.name}原创异兽档案图`);
    if (beast.webm) {
      if (image.dataset.src !== beast.webm) {
        image.src = beast.webm;
        image.dataset.src = beast.webm;
      }
      const p = image.play && image.play();
      if (p && p.catch) p.catch(() => {});
    } else if (image.dataset.src) {
      image.removeAttribute('src');
      if (image.load) image.load();
      delete image.dataset.src;
    }
    window.setTimeout(() => image.classList.remove('is-leaving'), 60);
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

/* ---------- 神话叙事：关联档案按钮联动抽屉（先关神话层） ---------- */
(function initMythLinks() {
  const links = [...document.querySelectorAll('[data-open-beast]')];
  if (!links.length) return;
  const mythDialog = document.getElementById('myth-dialog');
  links.forEach((link) => {
    link.addEventListener('click', () => {
      const id = link.dataset.openBeast;
      if (id && beasts[id]) {
        if (mythDialog && mythDialog.open) mythDialog.close();
        openRecord(id);
      }
    });
  });
})();

/* ---------- 神话叙事：沉浸阅读层（主页入口 → 全屏阅读） ---------- */
(function initMythDialog() {
  const mythDialog = document.getElementById('myth-dialog');
  if (!mythDialog) return;
  const triggers = [...document.querySelectorAll('[data-myth]')];
  if (!triggers.length) return;

  const myths = {
    jingwei: {
      no: 'MYTH · 01',
      name: '精卫填海',
      source: '北山经 · 发鸠之山 → 东海',
      accent: '#d8523f',
      original: '有鸟焉，其状如乌，文首、白喙、赤足，名曰「精卫」，其鸣自詨。是炎帝之少女，名曰女娃。女娃游于东海，溺而不返，故为精卫，常衔西山之木石，以堙于东海。',
      prose: '炎帝的小女儿女娃，溺于东海，魂化此鸟。她不复为人，却不肯止息，日复一日衔来西山木石，投向吞噬过自己的沧海。形体微小，意志却以无尽的重复对抗浩瀚——这便是“精卫填海”：一种把哀伤炼成行动、把不可能当作日常的韧性。本站档案中，她仍以赤霞之羽巡行于发鸠与东海之间。',
      tags: ['执念', '重生', '东海', '赤霞'],
      beast: 'jingwei'
    },
    kuafu: {
      no: 'MYTH · 02',
      name: '夸父逐日',
      source: '海外北经 · 大荒北经',
      accent: '#eba15a',
      original: '夸父与日逐走，入日；渴，欲得饮，饮于河、渭；河、渭不足，北饮大泽。未至，道渴而死。弃其杖，化为邓林。',
      prose: '巨人夸父与太阳赛跑，追至日影深处，焦渴难耐，饮尽黄河、渭水仍不足，又向北奔向大泽，终因力竭倒于途中。他遗下的手杖，化作千里桃林——邓林。故事写尽了人对光明的向往，也写尽了人力在自然伟力前的壮烈与限度：败亡之中，仍有生生不息的余响。',
      tags: ['逐日', '邓林', '大泽', '壮烈'],
      beast: null
    },
    xingtian: {
      no: 'MYTH · 03',
      name: '刑天舞干戚',
      source: '海外西经 · 大荒西经',
      accent: '#8fb6c0',
      original: '刑天与帝至此争神，帝断其首，葬之常羊之山。乃以乳为目，以脐为口，操干戚以舞。',
      prose: '刑天与天帝争夺神位，被斩去头颅，葬于常羊之山。失了头颅，他并未倒下——以双乳为眼，以肚脐为口，握盾持斧，继续起舞。一个失去面容却不肯停下的舞者，遂成反抗与不屈的图腾。陶渊明读之慨然：“刑天舞干戚，猛志固常在。”',
      tags: ['争神', '干戚', '常羊山', '不屈'],
      beast: null
    }
  };

  const el = {
    no: mythDialog.querySelector('.myth-dialog__no'),
    name: mythDialog.querySelector('.myth-dialog__name'),
    source: mythDialog.querySelector('.myth-dialog__source'),
    original: mythDialog.querySelector('.myth-dialog__original p'),
    prose: mythDialog.querySelector('.myth-dialog__prose'),
    tags: mythDialog.querySelector('.myth-dialog__tags'),
    link: mythDialog.querySelector('.myth-dialog__link'),
    locked: mythDialog.querySelector('.myth-dialog__locked')
  };

  function openMyth(key) {
    const m = myths[key];
    if (!m) return;
    mythDialog.style.setProperty('--myth-accent-strong', m.accent);
    el.no.textContent = m.no;
    el.name.textContent = m.name;
    el.source.textContent = m.source;
    el.original.textContent = m.original;
    el.prose.textContent = m.prose;
    el.tags.innerHTML = m.tags.map((t) => `<span class="myth-tag">${t}</span>`).join('');
    if (m.beast) {
      el.link.style.display = '';
      el.link.dataset.openBeast = m.beast;
      el.locked.style.display = 'none';
    } else {
      el.link.style.display = 'none';
      el.locked.style.display = '';
    }
    if (!mythDialog.open) mythDialog.showModal();
  }

  triggers.forEach((btn) => btn.addEventListener('click', () => openMyth(btn.dataset.myth)));

  const closeBtn = document.getElementById('close-myth');
  if (closeBtn) closeBtn.addEventListener('click', () => mythDialog.close());
  mythDialog.addEventListener('click', (event) => { if (event.target === mythDialog) mythDialog.close(); });
})();

/* ---------- Hero 标本：火星粒子（JS 注入，按屏宽决定数量） ---------- */
(function initEmbers() {
  const stage = document.querySelector('.beast-stage');
  if (!stage) return;
  let field = stage.querySelector('.ember-field');
  if (!field) {
    field = document.createElement('div');
    field.className = 'ember-field';
    field.setAttribute('aria-hidden', 'true');
    stage.appendChild(field);
  }
  const count = window.innerWidth < 780 ? 8 : 20;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const e = document.createElement('span');
    e.className = 'ember';
    const s = (Math.random() * 3 + 2).toFixed(1);
    e.style.setProperty('--s', s + 'px');
    e.style.left = (Math.random() * 100).toFixed(2) + '%';
    e.style.setProperty('--d', (Math.random() * 4 + 4).toFixed(2) + 's');
    e.style.animationDelay = (-Math.random() * 8).toFixed(2) + 's';
    frag.appendChild(e);
  }
  field.appendChild(frag);
})();

/* ---------- 全局氛围层：滚动视差（rAF 节流，reduced-motion 兜底） ---------- */
(function initParallax() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return; // 关闭视差，避免前庭敏感用户不适
  const root = document.documentElement;
  let ticking = false;
  function update() {
    root.style.setProperty('--scroll-y', (window.scrollY || window.pageYOffset || 0) + 'px');
    ticking = false;
  }
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
})();
