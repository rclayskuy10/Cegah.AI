// Service Worker for Cegah.AI PWA
// Provides offline support and caching for emergency access

const CACHE_NAME = 'cegah-ai-v2';
const OFFLINE_URL = '/';
const OFFLINE_DATA_KEY = 'cegah-offline-data';

// Files to cache for offline access
const CACHE_FILES = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Emergency offline data - critical information always available
const OFFLINE_EMERGENCY_DATA = {
  emergencyContacts: [
    { name: 'Darurat Umum', number: '112', desc: 'Ambulans, Pemadam, Polisi' },
    { name: 'Basarnas', number: '115', desc: 'Pencarian & Pertolongan' },
    { name: 'Polisi', number: '110', desc: 'Bantuan Keamanan' },
    { name: 'Ambulans', number: '118/119', desc: 'Layanan Medis Darurat' },
    { name: 'PMI', number: '021-7992325', desc: 'Palang Merah Indonesia' },
    { name: 'BNPB', number: '117', desc: 'Badan Penanggulangan Bencana' },
  ],
  guides: {
    gempa: {
      title: 'Panduan Saat Gempa Bumi',
      steps: [
        'DROP - Jatuhkan badan ke lantai',
        'COVER - Berlindung di bawah meja kokoh, lindungi kepala',
        'HOLD ON - Pegang kuat benda pelindung sampai guncangan berhenti',
        'Jangan berlari keluar saat masih berguncang',
        'Setelah berhenti, keluar dengan hati-hati, jauhi bangunan',
        'Periksa luka pada diri sendiri dan orang sekitar',
        'Waspada gempa susulan, jangan masuk bangunan rusak'
      ]
    },
    banjir: {
      title: 'Panduan Saat Banjir',
      steps: [
        'Segera pindah ke tempat yang lebih tinggi',
        'Jangan berjalan atau berkendara melewati air banjir',
        'Matikan listrik jika air mulai masuk rumah',
        'Bawa tas siaga dan dokumen penting',
        'Hindari saluran air, selokan, dan daerah rendah',
        'Ikuti arahan evakuasi dari petugas',
        'Jangan minum air banjir, gunakan air bersih yang disimpan'
      ]
    },
    tsunami: {
      title: 'Panduan Saat Tsunami',
      steps: [
        'Jika di pantai dan merasakan gempa kuat, SEGERA mengungsi ke tempat tinggi',
        'Jangan menunggu peringatan resmi, segera bergerak',
        'Lari ke dataran tinggi minimal 30 meter di atas permukaan laut',
        'Jauhi pantai, sungai, dan muara',
        'Jika terjebak, pegang benda terapung yang kuat',
        'Jangan kembali ke pantai sampai ada pernyataan aman resmi',
        'Waspadai gelombang susulan yang bisa lebih besar'
      ]
    },
    longsor: {
      title: 'Panduan Saat Tanah Longsor',
      steps: [
        'Jauhi daerah lereng dan tebing saat hujan lebat',
        'Perhatikan tanda: retakan tanah, suara gemuruh, air keruh',
        'Segera evakuasi jika ada tanda longsor',
        'Lari menjauhi arah longsoran secara lateral, bukan ke bawah',
        'Jangan mendekati area longsor setelah kejadian',
        'Hubungi petugas BPBD untuk bantuan evakuasi',
        'Periksa kondisi bangunan sebelum memasuki kembali'
      ]
    },
    erupsi: {
      title: 'Panduan Saat Erupsi Gunung Api',
      steps: [
        'Ikuti arahan evakuasi dari PVMBG dan BPBD',
        'Jauhi area dalam radius zona bahaya gunung api',
        'Gunakan masker N95 atau kain basah untuk lindungi pernapasan',
        'Tutup pintu dan jendela rapat-rapat',
        'Lindungi sumber air dari abu vulkanik',
        'Jangan menyeberangi sungai dekat gunung api (lahar)',
        'Siapkan tas siaga dengan perlengkapan 3 hari'
      ]
    }
  }
};

// Install event - cache essential files and offline data
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker v2...');
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[SW] Caching essential files');
        return cache.addAll(CACHE_FILES);
      }),
      // Store offline emergency data
      caches.open(OFFLINE_DATA_KEY).then((cache) => {
        const response = new Response(JSON.stringify(OFFLINE_EMERGENCY_DATA), {
          headers: { 'Content-Type': 'application/json' }
        });
        return cache.put('/offline-emergency-data', response);
      })
    ])
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker v2...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_DATA_KEY) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache when offline, network first for API calls
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip chrome extensions and other origins
  if (!event.request.url.startsWith(self.location.origin)) return;

  // Serve offline emergency data
  if (event.request.url.includes('offline-emergency-data')) {
    event.respondWith(
      caches.open(OFFLINE_DATA_KEY).then((cache) => {
        return cache.match('/offline-emergency-data');
      })
    );
    return;
  }

  // Network first for API calls (BMKG data should be fresh)
  if (event.request.url.includes('data.bmkg.go.id') || 
      event.request.url.includes('generativelanguage.googleapis.com')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return new Response(
            JSON.stringify({ 
              error: 'Offline', 
              message: 'Data tidak tersedia saat offline. Silakan coba lagi saat terhubung ke internet.' 
            }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        })
    );
    return;
  }

  // Cache first for static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // Return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      });
    })
  );
});

// Handle push notifications (future enhancement for early warning)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Peringatan bencana baru',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    tag: 'disaster-alert',
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification('Cegah.AI - Peringatan Darurat', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
