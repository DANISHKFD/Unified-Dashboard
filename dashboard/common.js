// ── Data Initialization & Aggregation ──────────────────────
function initData() {
  // 1. Dynamically parse the active 2-letter state code from the URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const stateCode = (urlParams.get('state') || 'TN').toUpperCase(); // Defaults to 'TN'

  // 2. Look up the global dataset dynamically (e.g., window.TN, window.WB, window.KL)
  const stateData = window[stateCode];
  
  // If the matching script file hasn't fully loaded into memory yet, halt gracefully
  if (!stateData) {
    console.warn(`Data object 'window.${stateCode}' could not be located yet.`);
    return null;
  }
  
  // 3. Clean up candidate names if they are indices/empty
  stateData.candidates.forEach(c => {
    if (typeof c.name !== 'string' || !isNaN(c.name) || c.name === "") {
      // Pulls name from the fallback "Name||Constituency" key layout format
      c.name = String(c.key).split('||')[0].trim();
    }
  });

  // 4. Rebuild missing aggregate tracking structures dynamically on the fly
  if (!stateData.constituencies || !stateData.parties || !stateData.banks) {
    const constMap = {};
    const partyMap = {};
    const bankMap = {};

    stateData.candidates.forEach(c => {
      // Aggregate Constituencies
      if (!constMap[c.constituency]) {
        constMap[c.constituency] = { name: c.constituency, deposits: 0, loans: 0, candidates: 0 };
      }
      constMap[c.constituency].deposits += (c.deposits || 0);
      constMap[c.constituency].loans += (c.loans || 0);
      constMap[c.constituency].candidates += 1;

      // Aggregate Parties
      if (!partyMap[c.party]) {
        partyMap[c.party] = { name: c.party, deposits: 0, loans: 0, candidates: 0 };
      }
      partyMap[c.party].deposits += (c.deposits || 0);
      partyMap[c.party].loans += (c.loans || 0);
      partyMap[c.party].candidates += 1;
    });

    // Calculate Net financial positions
    stateData.constituencies = Object.values(constMap).map(c => {
      c.net = c.deposits - c.loans;
      return c;
    });
    stateData.parties = Object.values(partyMap);

    // Aggregate Banks from cand_accounts and cand_loans data blocks
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
    
    // Apply standard layout sort parameters
    state// ── Data Initialization & Aggregation ──────────────────────
(function initData(){
  if(!window.TN) return;
  
  // 1. Fix candidate names if they are indices/empty
  TN.candidates.forEach(c => {
    if(typeof c.name !== 'string' || !isNaN(c.name) || c.name === ""){
      // Pulls name from the "Name||Constituency" key format
      c.name = String(c.key).split('||')[0].trim();
    }
  });

  // 2. Rebuild missing aggregate tables if they don't exist
  if(!TN.constituencies || !TN.parties || !TN.banks) {
    const constMap = {};
    const partyMap = {};
    const bankMap = {};

    TN.candidates.forEach(c => {
      // Aggregate Constituencies
      if(!constMap[c.constituency]) {
        constMap[c.constituency] = { name: c.constituency, deposits: 0, loans: 0, candidates: 0 };
      }
      constMap[c.constituency].deposits += (c.deposits || 0);
      constMap[c.constituency].loans += (c.loans || 0);
      constMap[c.constituency].candidates += 1;

      // Aggregate Parties
      if(!partyMap[c.party]) {
        partyMap[c.party] = { name: c.party, deposits: 0, loans: 0, candidates: 0 };
      }
      partyMap[c.party].deposits += (c.deposits || 0);
      partyMap[c.party].loans += (c.loans || 0);
      partyMap[c.party].candidates += 1;
    });

    // Calculate Net positions
    TN.constituencies = Object.values(constMap).map(c => {
      c.net = c.deposits - c.loans;
      return c;
    });
    TN.parties = Object.values(partyMap);

    // Aggregate Banks from cand_accounts and cand_loans
    const processAccs = (accsObj, isLoan) => {
      if(!accsObj) return;
      Object.values(accsObj).forEach(accArr => {
        accArr.forEach(a => {
          const bName = a.bank || 'Unknown';
          if(!bankMap[bName]) {
            bankMap[bName] = { name: bName, deposits: 0, loans: 0, accounts: 0 };
          }
          if(isLoan) bankMap[bName].loans += (a.amount || 0);
          else bankMap[bName].deposits += (a.amount || 0);
          bankMap[bName].accounts += 1;
        });
      });
    };
    
    processAccs(TN.cand_accounts, false);
    processAccs(TN.cand_loans, true);
    
    TN.banks = Object.values(bankMap);
    
    // Apply default sorting for the views
    TN.constituencies.sort((a, b) => a.name.localeCompare(b.name));
    TN.parties.sort((a, b) => b.deposits - a.deposits);
    TN.banks.sort((a, b) => b.deposits - a.deposits);
  }
})();
// 1. Get the state code from the URL
const urlParams = new URLSearchParams(window.location.search);
const currentState = urlParams.get('state') || 'TN'; // Defaults to TN if no parameter is found

// 2. Dynamically fetch the correct JSON file
async function loadStateData(stateCode) {
    try {
        const response = await fetch(`./data/${stateCode.toLowerCase()}_data.json`);
        if (!response.ok) throw new Error("Data not found");
        
        const electionData = await response.json();
        
        // 3. Trigger your existing UI rendering functions here
        renderDashboard(electionData); 
        updatePageTitles(stateCode);

    } catch (error) {
        console.error("Error loading state data:", error);
        // Add a fallback UI here (e.g., "Data for this state is unavailable")
    }
}
(function () {
  // 1. Map state codes to their correct display titles and years
  const stateMeta = {
    'TN': 'Tamil Nadu 2026',
    'KL': 'Keralam 2026',
    'WB': 'West Bengal 2026',
    'AS': 'Assam 2026',
    'PY': 'Puducherry 2026'
  };

  // 2. Extract the state code from the URL parameter (?state=KL)
  const urlParams = new URLSearchParams(window.location.search);
  const stateCode = (urlParams.get('state') || 'TN').toUpperCase();

  // 3. Find the matching title string (fallback to "State Assembly" if code is unknown)
  const structuralTitle = stateMeta[stateCode] || 'State Assembly';

  // 4. Dynamically update the browser tab title
  document.title = `${structuralTitle} · Election Finance Dashboard`;
})();
// Initialize the page
loadStateData(currentState);
// Helper for the MyNeta button
function getMyNetaBtn(url) {
  if (!url) return '';
  return `<a href="${url}" target="_blank" class="tab active" style="text-decoration:none; display:inline-block; margin-top:10px; background:var(--blue); color:white;">Detailed View on MyNeta</a>`;
}

// ── Formatting ──────────────────────────────
function fmt(n){
  if(!n && n!==0) return '—';
  const a=Math.abs(n);
  let s;
  if(a>=10000000) s='₹'+(a/10000000).toFixed(2)+' Cr';
  else if(a>=100000) s='₹'+(a/100000).toFixed(2)+' L';
  else if(a>=1000) s='₹'+(a/1000).toFixed(1)+' K';
  else s='₹'+a.toLocaleString('en-IN');
  return n<0?'−'+s:s;
}

function fmtShort(n){
  const a=Math.abs(n);
  let s;
  if(a>=10000000) s='₹'+(a/10000000).toFixed(1)+' Cr';
  else if(a>=100000) s='₹'+(a/100000).toFixed(1)+' L';
  else s='₹'+a.toLocaleString('en-IN');
  return n<0?'−'+s:s;
}

// ── Party colours ─────────────────────────
const PCOL={
  'Tamilaga Vettri Kazhagam':'#E53E3E',
  'DMK':'#E53E3E','AIADMK':'#38A169','BJP':'#DD6B20',
  'INC':'#3182CE','PMK':'#805AD5','DMDK':'#D69E2E',
  'NTK':'#1A202C','VCK':'#2B6CB0','AMMK':'#6B46C1',
  'MNM':'#319795','CPI':'#C53030','CPM':'#C05621',
  'MDMK':'#2C7A7B','IUML':'#276749','AIFB':'#E53E3E',
  'IND':'#718096','Naam Tamilar Katchi':'#1A202C',
  'Kongunadu Makkal Desia Katchi':'#B7791F',
  'Desiya Murpokku Dravida Kazhagam':'#2C7A7B'
};

function partyColor(p){
  return PCOL[p]||(PCOL[Object.keys(PCOL).find(k=>p&&p.includes(k.split(' ')[0]))||''])||'#718096';
}

// ── Avatar ────────────────────────────────
const AVCOLS=['#1D4ED8','#0D9488','#B91C1C','#C9962A','#7C3AED','#059669','#D97706','#DC2626','#0891B2'];
function avatarColor(name){
  let h=0;
  for(let c of(name||'')) h=(h*31+c.charCodeAt(0))%AVCOLS.length;
  return AVCOLS[h];
}
function initials(name){
  return(name||'?').split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();
}

// ── Navigation ────────────────────────────
function navigate(page){window.location.href=page;}

// ── Sidebar builder ───────────────────────
function buildSidebar(activePage){
  const pages=[
    {id:'index',label:'Overview',icon:'grid',href:'index.html'},
    {id:'constituencies',label:'Constituencies',href:'constituencies.html',icon:'map'},
    {id:'candidates',label:'Candidates',href:'candidates.html',icon:'user'},
    {id:'banks',label:'Banks',href:'banks.html',icon:'bank'},
    {id:'parties',label:'Parties',href:'parties.html',icon:'users'},
  ];
  const icons={
    grid:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    map:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    user:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`,
    bank:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="10" width="18" height="11" rx="1"/><path d="M3 10l9-7 9 7"/><line x1="12" y1="10" x2="12" y2="21"/><line x1="7" y1="10" x2="7" y2="21"/><line x1="17" y1="10" x2="17" y2="21"/></svg>`,
    users:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
  };
  const m=TN.meta;
  return `<nav class="sidebar">
    <div class="sb-brand">
      <div class="sb-badge">Keralam 2026</div>
      <div class="sb-title">Election Finance<br>Dashboard</div>
      <div class="sb-sub">${m.total_candidates.toLocaleString()} candidates · 140 seats</div>
    </div>
    <div class="sb-section">
      <div class="sb-label">Overview</div>
      ${pages.slice(0,1).map(p=>`<a class="nav-item${activePage===p.id?' active':''}" href="${p.href}">${icons[p.icon]}${p.label}</a>`).join('')}
    </div>
    <div class="sb-section">
      <div class="sb-label">Analysis</div>
      ${pages.slice(1).map(p=>`<a class="nav-item${activePage===p.id?' active':''}" href="${p.href}">${icons[p.icon]}${p.label}</a>`).join('')}
    </div>
    <div class="sb-footer">Data: myneta.info · May 2026</div>
  </nav>`;
}

// ── Topbar ────────────────────────────────
function buildTopbar(title,sub){
  return `<div class="topbar">
    <div><div class="page-title">${title}</div><div class="page-sub">${sub||'Keralam Legislative Assembly Election 2026'}</div></div>
    <div class="search-wrap"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9A9087" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input type="text" id="gs" placeholder="Search candidate…" oninput="globalSearch(this.value)"></div>
  </div>`;
}

function globalSearch(q){
  if(q.length>1) window.location.href='candidates.html?q='+encodeURIComponent(q);
}Data.constituencies.sort((a, b) => a.name.localeCompare(b.name));
    stateData.parties.sort((a, b) => b.deposits - a.deposits);
    stateData.banks.sort((a, b) => b.deposits - a.deposits);
  }

  // Return the processed state dataset back to your dashboard rendering engine
  return stateData;
}

// Run the data processing engine
const activeElectionData = initData();

if (activeElectionData) {
  // Pass the cleanly formatted data structure into your sidebar generator
  document.getElementById('sidebar-container').innerHTML = buildSidebar('index', activeElectionData.meta);
  
  // Pass it along to generate your charts and main metric cards on the layout grid
  renderDashboardMetrics(activeElectionData);
}
// 1. Get the state code from the URL
const urlParams = new URLSearchParams(window.location.search);
const currentState = urlParams.get('state') || 'TN'; // Defaults to TN if no parameter is found

// 2. Dynamically fetch the correct JSON file
async function loadStateData(stateCode) {
    try {
        const response = await fetch(`./data/${stateCode.toLowerCase()}_data.json`);
        if (!response.ok) throw new Error("Data not found");
        
        const electionData = await response.json();
        
        // 3. Trigger your existing UI rendering functions here
        renderDashboard(electionData); 
        updatePageTitles(stateCode);

    } catch (error) {
        console.error("Error loading state data:", error);
        // Add a fallback UI here (e.g., "Data for this state is unavailable")
    }
}
(function () {
  // 1. Map state codes to their correct display titles and years
  const stateMeta = {
    'TN': 'Tamil Nadu 2026',
    'KL': 'Keralam 2021',
    'WB': 'West Bengal 2021',
    'AS': 'Assam 2021',
    'PY': 'Puducherry 2021'
  };

  // 2. Extract the state code from the URL parameter (?state=KL)
  const urlParams = new URLSearchParams(window.location.search);
  const stateCode = (urlParams.get('state') || 'TN').toUpperCase();

  // 3. Find the matching title string (fallback to "State Assembly" if code is unknown)
  const structuralTitle = stateMeta[stateCode] || 'State Assembly';

  // 4. Dynamically update the browser tab title
  document.title = `${structuralTitle} · Election Finance Dashboard`;
})();
// Initialize the page
loadStateData(currentState);
// Helper for the MyNeta button
function getMyNetaBtn(url) {
  if (!url) return '';
  return `<a href="${url}" target="_blank" class="tab active" style="text-decoration:none; display:inline-block; margin-top:10px; background:var(--blue); color:white;">Detailed View on MyNeta</a>`;
}

// ── Formatting ──────────────────────────────
function fmt(n){
  if(!n && n!==0) return '—';
  const a=Math.abs(n);
  let s;
  if(a>=10000000) s='₹'+(a/10000000).toFixed(2)+' Cr';
  else if(a>=100000) s='₹'+(a/100000).toFixed(2)+' L';
  else if(a>=1000) s='₹'+(a/1000).toFixed(1)+' K';
  else s='₹'+a.toLocaleString('en-IN');
  return n<0?'−'+s:s;
}

function fmtShort(n){
  const a=Math.abs(n);
  let s;
  if(a>=10000000) s='₹'+(a/10000000).toFixed(1)+' Cr';
  else if(a>=100000) s='₹'+(a/100000).toFixed(1)+' L';
  else s='₹'+a.toLocaleString('en-IN');
  return n<0?'−'+s:s;
}

// ── Party colours ─────────────────────────
const PCOL={
  'Tamilaga Vettri Kazhagam':'#E53E3E',
  'DMK':'#E53E3E','AIADMK':'#38A169','BJP':'#DD6B20',
  'INC':'#3182CE','PMK':'#805AD5','DMDK':'#D69E2E',
  'NTK':'#1A202C','VCK':'#2B6CB0','AMMK':'#6B46C1',
  'MNM':'#319795','CPI':'#C53030','CPM':'#C05621',
  'MDMK':'#2C7A7B','IUML':'#276749','AIFB':'#E53E3E',
  'IND':'#718096','Naam Tamilar Katchi':'#1A202C',
  'Kongunadu Makkal Desia Katchi':'#B7791F',
  'Desiya Murpokku Dravida Kazhagam':'#2C7A7B'
};

function partyColor(p){
  return PCOL[p]||(PCOL[Object.keys(PCOL).find(k=>p&&p.includes(k.split(' ')[0]))||''])||'#718096';
}

// ── Avatar ────────────────────────────────
const AVCOLS=['#1D4ED8','#0D9488','#B91C1C','#C9962A','#7C3AED','#059669','#D97706','#DC2626','#0891B2'];
function avatarColor(name){
  let h=0;
  for(let c of(name||'')) h=(h*31+c.charCodeAt(0))%AVCOLS.length;
  return AVCOLS[h];
}
function initials(name){
  return(name||'?').split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();
}

// ── Navigation ────────────────────────────
function navigate(page){window.location.href=page;}

// ── Sidebar builder ───────────────────────
function buildSidebar(activePage, currentDataMeta) {
  // 1. Extract the current state from the URL to keep navigation consistent
  const urlParams = new URLSearchParams(window.location.search);
  const stateCode = (urlParams.get('state') || 'TN').toUpperCase();

  // 2. Define the structural text dictionary
  const stateUIMeta = {
    'TN': { badge: 'Tamil Nadu 2026', seats: '234 seats' },
    'KL': { badge: 'Keralam 2021', seats: '140 seats' },
    'WB': { badge: 'West Bengal 2021', seats: '294 seats' },
    'AS': { badge: 'Assam 2021', seats: '126 seats' },
    'PY': { badge: 'Puducherry 2021', seats: '30 seats' }
  };
  const config = stateUIMeta[stateCode] || stateUIMeta['TN'];

  // 3. Update the pages array to pass the URL parameter forward on every click
  const pages = [
    {id:'index',label:'Overview',icon:'grid',href:`index.html?state=${stateCode}`},
    {id:'constituencies',label:'Constituencies',href:`constituencies.html?state=${stateCode}`,icon:'map'},
    {id:'candidates',label:'Candidates',href:`candidates.html?state=${stateCode}`,icon:'user'},
    {id:'banks',label:'Banks',href:`banks.html?state=${stateCode}`,icon:'bank'},
    {id:'parties',label:'Parties',href:`parties.html?state=${stateCode}`,icon:'users'},
  ];

  const icons = {
    grid:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    map:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    user:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`,
    bank:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="10" width="18" height="11" rx="1"/><path d="M3 10l9-7 9 7"/><line x1="12" y1="10" x2="12" y2="21"/><line x1="7" y1="10" x2="7" y2="21"/><line x1="17" y1="10" x2="17" y2="21"/></svg>`,
    users:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
  };

  // 4. Use the passed data meta instead of the hardcoded TN.meta
  // (Adding a fallback just in case data isn't fully loaded yet)
  const m = currentDataMeta || { total_candidates: 0 };

  return `<nav class="sidebar">
    <div class="sb-brand">
      <div class="sb-badge">${config.badge}</div>
      <div class="sb-title">Election Finance<br>Dashboard</div>
      <div class="sb-sub">${m.total_candidates.toLocaleString()} candidates · ${config.seats}</div>
    </div>
    <div class="sb-section">
      <div class="sb-label">Overview</div>
      ${pages.slice(0,1).map(p=>`<a class="nav-item${activePage===p.id?' active':''}" href="${p.href}">${icons[p.icon]}${p.label}</a>`).join('')}
    </div>
    <div class="sb-section">
      <div class="sb-label">Analysis</div>
      ${pages.slice(1).map(p=>`<a class="nav-item${activePage===p.id?' active':''}" href="${p.href}">${icons[p.icon]}${p.label}</a>`).join('')}
    </div>
    <div class="sb-footer">Data: myneta.info · May 2026</div>
  </nav>`;
}

// ── Topbar ────────────────────────────────
function buildTopbar(title,sub){
  return `<div class="topbar">
    <div><div class="page-title">${title}</div><div class="page-sub">${sub||'Keralam Legislative Assembly Election 2026'}</div></div>
    <div class="search-wrap"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9A9087" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input type="text" id="gs" placeholder="Search candidate…" oninput="globalSearch(this.value)"></div>
  </div>`;
}

function globalSearch(q){
  if(q.length>1) window.location.href='candidates.html?q='+encodeURIComponent(q);
}