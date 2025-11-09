const DATA_URL = 'data.json';
const qs = (s, el=document)=>el.querySelector(s);

let raw = [];
let dirs = [];
let currentDir = null;

function getFavicon(u){
  try { const d = new URL(u).hostname; return `https://www.google.com/s2/favicons?sz=128&domain=${encodeURIComponent(d)}`; }
  catch(e){ return ''; }
}

function summarize(items){
  const m = new Map();
  for(const it of items){ m.set(it.dir, (m.get(it.dir)||0)+1); }
  return [...m.entries()].sort((a,b)=>a[0].localeCompare(b[0],'zh-Hans-CN'));
}

function renderTabs(){
  const bar = qs('#tabbar');
  bar.innerHTML = dirs.map(([d,count])=>`
    <div class="tab ${currentDir===d?'active':''}" data-dir="${d}">${d}</div>
  `).join('');
 
  
  bar.onclick = e => {
  const el = e.target.closest('.tab');
  if (!el) return;
  document.body.classList.add('dir-transition');
  setTimeout(()=>document.body.classList.remove('dir-transition'), 600);
  currentDir = el.dataset.dir;
  renderTabs();
  renderGrid();
};

}

function renderGrid(){
  const grid = qs('#grid');
  let list = raw.filter(x => x.dir === currentDir);
  const q = qs('#search').value.trim().toLowerCase();
  if(q){
    list = list.filter(x =>
      x.title.toLowerCase().includes(q) ||
      (x.desc||'').toLowerCase().includes(q) ||
      x.url.toLowerCase().includes(q) ||
      x.tags.some(t=>String(t).toLowerCase().includes(q))
    );
  }
  grid.innerHTML = list.map(x=>{
    const fav = getFavicon(x.url);
    return `<a class="dial" href="${x.url}" target="_blank" rel="noopener">
      <div class="icon">${ fav ? `<img src="${fav}" alt="">` : '🌐' }</div>
      <div class="title" title="${x.title}">${x.title}</div>
      <div class="url" title="${x.url}">${x.url}</div>
    </a>`;
  }).join('');
}

document.addEventListener('keydown', e=>{
  if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); const s=qs('#search'); s.focus(); s.select(); }
});

(async function init(){
  const res = await fetch(DATA_URL);
  const json = await res.json();
  raw = json;
  dirs = summarize(json);
  currentDir = (dirs[0] && dirs[0][0]) || null;
  renderTabs();
  renderGrid();
  qs('#search').addEventListener('input', renderGrid);
})();