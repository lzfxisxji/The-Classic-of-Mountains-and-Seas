import { beasts } from './data.js';

const validVolumes = new Set(['all', 'mountains', 'seas', 'wilderness']);
const volumeLabels = {
  all: '全部卷册',
  mountains: '山经',
  seas: '海经',
  wilderness: '大荒经'
};

function normalizeVolume(volume) {
  return validVolumes.has(volume) ? volume : 'all';
}

function createTextElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function createVolumeCard(id, beast, index) {
  const card = document.createElement('a');
  card.className = 'volume-card';
  card.href = `specimen.html?id=${encodeURIComponent(id)}`;
  card.style.setProperty('--card-delay', `${index * 85}ms`);
  card.setAttribute('aria-label', `打开${beast.name}图鉴详情`);

  const imageFrame = document.createElement('div');
  imageFrame.className = 'volume-card-image';

  const image = document.createElement('img');
  image.src = beast.image;
  image.alt = `${beast.name}原创异兽档案图`;
  image.loading = 'lazy';
  image.decoding = 'async';
  imageFrame.append(image);

  const indexMark = createTextElement('span', 'volume-card-index', String(index + 1).padStart(2, '0'));
  imageFrame.append(indexMark);

  const content = document.createElement('div');
  content.className = 'volume-card-content';
  content.append(
    createTextElement('span', 'volume-card-no', `SHB / ${beast.no}`),
    createTextElement('h2', '', beast.name),
    createTextElement('p', 'volume-card-source', beast.source)
  );

  const location = document.createElement('p');
  location.className = 'volume-card-place';
  location.append(
    createTextElement('span', '', '观测地点'),
    createTextElement('b', '', beast.place)
  );
  content.append(location);

  const openMark = createTextElement('span', 'volume-card-open', '启封档案');
  openMark.setAttribute('aria-hidden', 'true');
  content.append(openMark);

  card.append(imageFrame, content);
  return card;
}

export function renderLibrary(volume) {
  volume = normalizeVolume(volume);
  const entries = Object.entries(beasts).filter(([, beast]) => volume === 'all' || beast.volume === volume);
  const grid = document.querySelector('#volume-grid');

  grid.replaceChildren();

  if (entries.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-volume';
    emptyState.append(
      createTextElement('span', '', '卷册封存'),
      createTextElement('p', '', '该卷册尚未开放观测')
    );
    grid.append(emptyState);
  } else {
    const fragment = document.createDocumentFragment();
    entries.forEach(([id, beast], index) => fragment.append(createVolumeCard(id, beast, index)));
    grid.append(fragment);
  }

  document.querySelector('#active-volume-label').textContent = volumeLabels[volume];
  document.querySelector('#volume-count').textContent = String(entries.length).padStart(2, '0');
  document.title = `${volumeLabels[volume]}｜卷册库｜山海档案局`;

  document.querySelectorAll('.volume-tabs [data-volume]').forEach((tab) => {
    const isActive = tab.dataset.volume === volume;
    tab.classList.toggle('active', isActive);
    if (isActive) tab.setAttribute('aria-current', 'page');
    else tab.removeAttribute('aria-current');
  });

  return entries;
}

const requestedVolume = new URLSearchParams(window.location.search).get('volume');
renderLibrary(requestedVolume);
