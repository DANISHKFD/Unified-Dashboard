const STATE_META = {
  TN: { badge: 'Tamil Nadu 2026', subtitle: 'Tamil Nadu Legislative Assembly Election 2026', seats: '234 seats' },
  AP: { badge: 'Andhra Pradesh 2024', subtitle: 'Andhra Pradesh Legislative Assembly Election 2024', seats: '175 seats' },
  BR: { badge: 'Bihar 2025', subtitle: 'Bihar Legislative Assembly Election 2025', seats: '243 seats' },
  MH: { badge: 'Maharashtra 2024', subtitle: 'Maharashtra Legislative Assembly Election 2024', seats: '288 seats' },
  UP: { badge: 'Uttar Pradesh 2022', subtitle: 'Uttar Pradesh Legislative Assembly Election 2022', seats: '403 seats' },
  KL: { badge: 'Keralam 2026', subtitle: 'Keralam Legislative Assembly Election 2026', seats: '140 seats' },
  WB: { badge: 'West Bengal 2026', subtitle: 'West Bengal Legislative Assembly Election 2026', seats: '294 seats' },
  AS: { badge: 'Assam 2026', subtitle: 'Assam Legislative Assembly Election 2026', seats: '126 seats' },
  PY: { badge: 'Puducherry 2026', subtitle: 'Puducherry Legislative Assembly Election 2026', seats: '30 seats' }
};

function getStateCode() {
  const params = new URLSearchParams(window.location.search);
  return (params.get('state') || 'TN').toUpperCase();
}

function getStateMeta() {
  return STATE_META[getStateCode()] || { badge: 'State Assembly', subtitle: 'State Assembly Election 2026', seats: '—' };
}

function updatePageTitles(pageTitle) {
  const meta = getStateMeta();
  document.title = `${pageTitle ? pageTitle + ' · ' : ''}${meta.badge} · Election Finance Dashboard`;
}

function initData() {
  const stateCode = getStateCode();
  const stateData = window[stateCode];
  if (!stateData) {
    console.warn(`Data object 'window.${stateCode}' could not be located yet.`);
    return null;
  }

  stateData.candidates.forEach(c => {
    if (typeof c.name !== 'string' || !isNaN(c.name) || c.name === '') {
      c.name = String(c.key).split('||')[0].trim();
    }
  });

  if (!stateData.constituencies || !stateData.parties || !stateData.banks) {
    const constMap = {};
    const partyMap = {};
    const bankMap = {};

    stateData.candidates.forEach(c => {
      if (!constMap[c.constituency]) {
        constMap[c.constituency] = { name: c.constituency, deposits: 0, loans: 0, candidates: 0 };
      }
      constMap[c.constituency].deposits += (c.deposits || 0);
      constMap[c.constituency].loans += (c.loans || 0);
      constMap[c.constituency].candidates += 1;

      if (!partyMap[c.party]) {
        partyMap[c.party] = { name: c.party, deposits: 0, loans: 0, candidates: 0 };
      }
      partyMap[c.party].deposits += (c.deposits || 0);
      partyMap[c.party].loans += (c.loans || 0);
      partyMap[c.party].candidates += 1;
    });

    stateData.constituencies = Object.values(constMap).map(c => {
      c.net = c.deposits - c.loans;
      return c;
    });
    stateData.parties = Object.values(partyMap);

    const processAccs = (accsObj, isLoan) => {
      if (!accsObj) return;
      Object.values(accsObj).forEach(accArr => {
        accArr.forEach(a => {
          const bName = a.bank || 'Unknown';
          if (!bankMap[bName]) {
            bankMap[bName] = { name: bName, deposits: 0, loans: 0, accounts: 0 };
          }
          if (isLoan) bankMap[bName].loans += (a.amount || 0);
          else bankMap[bName].deposits += (a.amount || 0);
          bankMap[bName].accounts += 1;
        });
      });
    };

    processAccs(stateData.cand_accounts, false);
    processAccs(stateData.cand_loans, true);
    stateData.banks = Object.values(bankMap);
    stateData.constituencies.sort((a, b) => a.name.localeCompare(b.name));
    stateData.parties.sort((a, b) => b.deposits - a.deposits);
    stateData.banks.sort((a, b) => b.deposits - a.deposits);
  }

  return stateData;
}

async function loadStateData(stateCode) {
  try {
    const response = await fetch(`./data/${stateCode.toLowerCase()}_data.json`);
    if (!response.ok) throw new Error('Data not found');
    const electionData = await response.json();
    if (typeof renderDashboard === 'function') renderDashboard(electionData);
    updatePageTitles();
    return electionData;
  } catch (error) {
    console.error('Error loading state data:', error);
    return null;
  }
}

function getMyNetaBtn(url) {
  if (!url) return '';
  return `<a href="${url}" target="_blank" class="tab active" style="text-decoration:none; display:inline-block; margin-top:10px; background:var(--blue); color:white;">Detailed View on MyNeta</a>`;
}

function fmt(n) {
  if (!n && n !== 0) return '—';
  const a = Math.abs(n);
  let s;
  if (a >= 10000000) s = '₹' + (a / 10000000).toFixed(2) + ' Cr';
  else if (a >= 100000) s = '₹' + (a / 100000).toFixed(2) + ' L';
  else if (a >= 1000) s = '₹' + (a / 1000).toFixed(1) + ' K';
  else s = '₹' + a.toLocaleString('en-IN');
  return n < 0 ? '−' + s : s;
}

function fmtShort(n) {
  if (n === null || n === undefined) return '—';
  const a = Math.abs(n);
  let s;
  if (a >= 10000000) s = '₹' + (a / 10000000).toFixed(1) + ' Cr';
  else if (a >= 100000) s = '₹' + (a / 100000).toFixed(1) + ' L';
  else s = '₹' + a.toLocaleString('en-IN');
  return n < 0 ? '−' + s : s;
}

const PCOL = {
  'Tamilaga Vettri Kazhagam': '#E53E3E',
  DMK: '#E53E3E',
  AIADMK: '#38A169',
  BJP: '#DD6B20',
  INC: '#3182CE',
  PMK: '#805AD5',
  DMDK: '#D69E2E',
  NTK: '#1A202C',
  VCK: '#2B6CB0',
  AMMK: '#6B46C1',
  MNM: '#319795',
  CPI: '#C53030',
  CPM: '#C05621',
  MDMK: '#2C7A7B',
  IUML: '#276749',
  AIFB: '#E53E3E',
  IND: '#718096',
  'Naam Tamilar Katchi': '#1A202C',
  'Kongunadu Makkal Desia Katchi': '#B7791F',
  'Desiya Murpokku Dravida Kazhagam': '#2C7A7B'
};

function partyColor(p) {
  return PCOL[p] || (PCOL[Object.keys(PCOL).find(k => p && p.includes(k.split(' ')[0])) || ''] || '#718096');
}

const AVCOLS = ['#1D4ED8', '#0D9488', '#B91C1C', '#C9962A', '#7C3AED', '#059669', '#D97706', '#DC2626', '#0891B2'];
function avatarColor(name) {
  let h = 0;
  for (let c of (name || '')) h = (h * 31 + c.charCodeAt(0)) % AVCOLS.length;
  return AVCOLS[h];
}

function initials(name) {
  return (name || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function navigate(page) {
  window.location.href = page;
}

function buildSidebar(activePage, currentDataMeta) {
  const stateCode = getStateCode();
  const config = getStateMeta();

  const pages = [
    { id: 'index', label: 'Overview', icon: 'grid', href: `index.html?state=${stateCode}` },
    { id: 'constituencies', label: 'Constituencies', icon: 'map', href: `constituencies.html?state=${stateCode}` },
    { id: 'candidates', label: 'Candidates', icon: 'user', href: `candidates.html?state=${stateCode}` },
    { id: 'banks', label: 'Banks', icon: 'bank', href: `banks.html?state=${stateCode}` },
    { id: 'parties', label: 'Parties', icon: 'users', href: `parties.html?state=${stateCode}` }
  ];

  const icons = {
    // Added the new home icon here
    home: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    grid: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    map: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    user: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`,
    bank: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="10" width="18" height="11" rx="1"/><path d="M3 10l9-7 9 7"/><line x1="12" y1="10" x2="12" y2="21"/><line x1="7" y1="10" x2="7" y2="21"/><line x1="17" y1="10" x2="17" y2="21"/></svg>`,
    users: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
  };

  const m = currentDataMeta || { total_candidates: 0 };

  return `<nav class="sidebar">
    <div class="sb-brand">
      <!-- 1. The Badge is now a clickable anchor tag pointing to the hub -->
      <a class="sb-badge" href="../hub.html" style="display: inline-block; text-decoration: none; cursor: pointer; transition: opacity 0.2s;" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1" title="Return to India Map Hub">
        ${config.badge} ↩
      </a>
      <div class="sb-title" style="margin-top: 8px;">Election Finance<br>Dashboard</div>
      <div class="sb-sub">${m.total_candidates.toLocaleString()} candidates · ${config.seats}</div>
    </div>
    
    <!-- 2. The New Dedicated Navigation Section -->
    <div class="sb-section">
      <div class="sb-label">Navigation</div>
      <a class="nav-item" href="../hub.html">
        ${icons.home} India Map Hub
      </a>
    </div>

    <div class="sb-section">
      <div class="sb-label">Overview</div>
      ${pages.slice(0, 1).map(p => `<a class="nav-item${activePage === p.id ? ' active' : ''}" href="${p.href}">${icons[p.icon]}${p.label}</a>`).join('')}
    </div>
    <div class="sb-section">
      <div class="sb-label">Analysis</div>
      ${pages.slice(1).map(p => `<a class="nav-item${activePage === p.id ? ' active' : ''}" href="${p.href}">${icons[p.icon]}${p.label}</a>`).join('')}
    </div>
    <div class="sb-footer">Data: myneta.info · May 2026</div>
  </nav>`;
}

function buildTopbar(title, sub) {
  updatePageTitles(title);
  const pageSubtitle = sub || getStateMeta().subtitle;
  return `<div class="topbar">
    <div><div class="page-title">${title}</div><div class="page-sub">${pageSubtitle}</div></div>
    <div class="search-wrap"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9A9087" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input type="text" id="gs" placeholder="Search candidate…" oninput="globalSearch(this.value)"></div>
  </div>`;
}

function globalSearch(q) {
  if (q.length > 1) {
    const stateCode = getStateCode();
    window.location.href = `candidates.html?state=${stateCode}&q=` + encodeURIComponent(q);
  }
}
