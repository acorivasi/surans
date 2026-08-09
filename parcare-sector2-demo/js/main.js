// LocLiber — prototip demo. Toate datele sunt simulate local (localStorage),
// nu există server real în spate. Menit pentru testare de concept, nu producție.

const STORAGE_KEY = 'locliber_public_spots_v1';

const DEFAULT_PUBLIC_SPOTS = [
  { id: 'p1', lat: 44.4468, lng: 26.1298, street: 'Piața Obor', status: 'liber' },
  { id: 'p2', lat: 44.4426, lng: 26.1247, street: 'Șoseaua Iancului', status: 'ocupat' },
  { id: 'p3', lat: 44.4444, lng: 26.1355, street: 'Strada Maica Domnului', status: 'liber' },
  { id: 'p4', lat: 44.4380, lng: 26.1420, street: 'Bulevardul Pantelimon', status: 'ocupat' },
  { id: 'p5', lat: 44.4550, lng: 26.1280, street: 'Șoseaua Colentina', status: 'liber' },
  { id: 'p6', lat: 44.4530, lng: 26.1180, street: 'Strada Doamna Ghica', status: 'ocupat' },
  { id: 'p7', lat: 44.4390, lng: 26.1330, street: 'Strada Baicului', status: 'liber' },
  { id: 'p8', lat: 44.4330, lng: 26.1150, street: 'Strada Traian', status: 'liber' },
  { id: 'p9', lat: 44.4470, lng: 26.1370, street: 'Strada Reșița', status: 'ocupat' },
  { id: 'p10', lat: 44.4410, lng: 26.1090, street: 'Institutul Medico-Militar', status: 'liber' },
];

const PRIVATE_SPOTS = [
  { id: 'v1', lat: 44.4335, lng: 26.1155, address: 'Strada Traian 45', owner: 'Ana P.', pricePerHour: 5, pricePerDay: 25 },
  { id: 'v2', lat: 44.4385, lng: 26.1425, address: 'Bulevardul Pantelimon 165', owner: 'Mihai R.', pricePerHour: 4, pricePerDay: 20 },
  { id: 'v3', lat: 44.4555, lng: 26.1285, address: 'Șoseaua Colentina 42', owner: 'ContExpert SRL', pricePerHour: 3, pricePerDay: 15 },
  { id: 'v4', lat: 44.4395, lng: 26.1335, address: 'Strada Baicului 12', owner: 'Elena D.', pricePerHour: 6, pricePerDay: 30 },
];

let publicSpots = loadPublicSpots();
let map, markersById = {};

function loadPublicSpots() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return structuredClone(DEFAULT_PUBLIC_SPOTS).map(s => ({ ...s, updatedAt: Date.now() }));
  try {
    return JSON.parse(raw);
  } catch {
    return structuredClone(DEFAULT_PUBLIC_SPOTS).map(s => ({ ...s, updatedAt: Date.now() }));
  }
}

function savePublicSpots() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(publicSpots));
}

function minutesAgo(ts) {
  const diff = Math.round((Date.now() - ts) / 60000);
  if (diff <= 0) return 'chiar acum';
  if (diff === 1) return 'acum 1 minut';
  return `acum ${diff} minute`;
}

function initMap() {
  map = L.map('map', { scrollWheelZoom: false }).setView([44.4460, 26.1290], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  publicSpots.forEach(renderPublicMarker);
  PRIVATE_SPOTS.forEach(renderPrivateMarker);
  updateStats();
}

function colorFor(status) {
  return status === 'liber' ? '#1a9c5a' : '#e0453b';
}

function renderPublicMarker(spot) {
  if (markersById[spot.id]) {
    map.removeLayer(markersById[spot.id]);
  }
  const marker = L.circleMarker([spot.lat, spot.lng], {
    radius: 10,
    color: '#fff',
    weight: 2,
    fillColor: colorFor(spot.status),
    fillOpacity: 0.95,
  }).addTo(map);

  marker.bindPopup(() => popupHtmlFor(spot));
  marker.on('popupopen', () => attachPopupHandlers(spot));
  markersById[spot.id] = marker;
}

function popupHtmlFor(spot) {
  const statusLabel = spot.status === 'liber' ? 'Liber' : 'Ocupat';
  const actionLabel = spot.status === 'liber' ? 'Am parcat aici' : 'Am plecat / e liber';
  const actionClass = spot.status === 'liber' ? 'btn-mark-taken' : 'btn-mark-free';
  return `
    <div class="spot-popup" data-spot-id="${spot.id}">
      <h4>${spot.street}</h4>
      <div class="status ${spot.status}">${statusLabel} · ${minutesAgo(spot.updatedAt)}</div>
      <button class="${actionClass}" data-action="toggle">${actionLabel}</button>
    </div>
  `;
}

function attachPopupHandlers(spot) {
  const btn = document.querySelector(`.spot-popup[data-spot-id="${spot.id}"] button[data-action="toggle"]`);
  if (!btn) return;
  btn.addEventListener('click', () => {
    const current = publicSpots.find(s => s.id === spot.id);
    current.status = current.status === 'liber' ? 'ocupat' : 'liber';
    current.updatedAt = Date.now();
    savePublicSpots();
    renderPublicMarker(current);
    markersById[current.id].openPopup();
    updateStats();
    showToast(current.status === 'ocupat'
      ? `Ai marcat ${current.street} ca ocupat. Mulțumim pentru raportare!`
      : `Ai marcat ${current.street} ca liber. Un vecin te va mulțumi.`);
  });
}

function renderPrivateMarker(spot) {
  const icon = L.divIcon({
    className: '',
    html: `<div style="width:22px;height:22px;border-radius:50%;background:#2d6ae0;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.4);"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
  const marker = L.marker([spot.lat, spot.lng], { icon }).addTo(map);
  marker.bindPopup(`
    <div class="spot-popup">
      <h4>${spot.address}</h4>
      <div class="status">Proprietar: ${spot.owner}</div>
      <div class="status">${spot.pricePerHour} lei/oră · ${spot.pricePerDay} lei/zi</div>
      <button class="btn-mark-free" data-open-booking="${spot.id}">Rezervă</button>
    </div>
  `);
  marker.on('popupopen', () => {
    const btn = document.querySelector(`[data-open-booking="${spot.id}"]`);
    if (btn) btn.addEventListener('click', () => openBookingModal(spot));
  });
}

function updateStats() {
  const free = publicSpots.filter(s => s.status === 'liber').length;
  document.getElementById('stat-free').textContent = free;
  document.getElementById('stat-total').textContent = publicSpots.length;
  document.getElementById('stat-private').textContent = PRIVATE_SPOTS.length;
}

function renderPrivateList() {
  const container = document.getElementById('private-list');
  container.innerHTML = PRIVATE_SPOTS.map(spot => `
    <div class="private-card">
      <h4>${spot.address}</h4>
      <div class="owner">Proprietar: ${spot.owner}</div>
      <div class="price">${spot.pricePerHour} lei/oră &nbsp;•&nbsp; ${spot.pricePerDay} lei/zi</div>
      <button class="btn btn-primary" data-open-booking-card="${spot.id}">Rezervă acest loc</button>
    </div>
  `).join('');
  container.querySelectorAll('[data-open-booking-card]').forEach(btn => {
    btn.addEventListener('click', () => {
      const spot = PRIVATE_SPOTS.find(s => s.id === btn.dataset.openBookingCard);
      openBookingModal(spot);
    });
  });
}

// --- Booking modal ---
let activeBookingSpot = null;

function openBookingModal(spot) {
  activeBookingSpot = spot;
  document.getElementById('modal-title').textContent = `Rezervă: ${spot.address}`;
  document.getElementById('modal-subtitle').textContent = `Proprietar: ${spot.owner}`;
  document.getElementById('booking-date').valueAsDate = new Date();
  updateModalPrice();
  document.getElementById('modal-backdrop').classList.add('open');
}

function closeBookingModal() {
  document.getElementById('modal-backdrop').classList.remove('open');
  activeBookingSpot = null;
}

function updateModalPrice() {
  if (!activeBookingSpot) return;
  const hours = Number(document.getElementById('booking-duration').value) || 1;
  const total = (hours * activeBookingSpot.pricePerHour).toFixed(0);
  document.getElementById('modal-price').textContent = `Total estimat: ${total} lei (${hours} h × ${activeBookingSpot.pricePerHour} lei/oră)`;
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 3500);
}

// Simulează alți vecini care raportează, ca demo-ul să pară "viu"
function simulateCommunityActivity() {
  setInterval(() => {
    const idx = Math.floor(Math.random() * publicSpots.length);
    const spot = publicSpots[idx];
    spot.status = spot.status === 'liber' ? 'ocupat' : 'liber';
    spot.updatedAt = Date.now();
    savePublicSpots();
    renderPublicMarker(spot);
    updateStats();
    showToast(`Un vecin a raportat: ${spot.street} e acum ${spot.status === 'liber' ? 'liber' : 'ocupat'}.`);
  }, 25000);
}

document.addEventListener('DOMContentLoaded', () => {
  renderPrivateList();

  try {
    initMap();
    simulateCommunityActivity();
  } catch (err) {
    console.error('Harta nu a putut fi încărcată:', err);
    document.getElementById('map').innerHTML =
      '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#4a5060;text-align:center;padding:20px;">Harta nu s-a putut încărca (conexiune blocată la OpenStreetMap/Leaflet). Restul paginii funcționează normal.</div>';
  }

  document.getElementById('modal-close').addEventListener('click', closeBookingModal);
  document.getElementById('modal-backdrop').addEventListener('click', (e) => {
    if (e.target.id === 'modal-backdrop') closeBookingModal();
  });
  document.getElementById('booking-duration').addEventListener('input', updateModalPrice);
  document.getElementById('booking-form').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast(`Cerere trimisă către ${activeBookingSpot.owner}! Te va contacta pentru confirmare.`);
    closeBookingModal();
  });

  document.getElementById('reset-demo').addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    publicSpots = loadPublicSpots();
    publicSpots.forEach(renderPublicMarker);
    updateStats();
    showToast('Demo resetat la starea inițială.');
  });
});
