// script.js — Interações do portfólio (vanilla JS)
document.addEventListener('DOMContentLoaded', function(){
  // Smooth scroll for internal links (CSS handles most, keep for accessibility)
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href.startsWith('#')){
        const el = document.querySelector(href);
        if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth', block:'start'}); }
      }
    });
  });

  // Filter projects
  const filters = document.querySelectorAll('.filter');
  const projects = document.querySelectorAll('.project-card');
  filters.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      filters.forEach(b=>{ b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
      btn.classList.add('active'); btn.setAttribute('aria-pressed','true');
      const filter = btn.dataset.filter;
      projects.forEach(p=>{
        const cat = p.dataset.category;
        if(filter === 'all' || cat === filter){ p.style.display='block'; p.classList.add('reveal'); }
        else { p.style.display='none'; }
      });
    });
  });

  // Modal / Lightbox
  const modal = document.getElementById('modal');
  const modalContent = modal.querySelector('.modal-content');
  const closeBtn = modal.querySelector('.modal-close');

  function openModal(card){
    const img = card.querySelector('img');
    const title = card.querySelector('h3').textContent;
    const desc = card.querySelector('.desc').textContent;
    modalContent.innerHTML = `<h3>${title}</h3><img src="${img.src}" alt="${img.alt}"><p>${desc}</p>`;
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  }
  function closeModal(){ modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }

  projects.forEach(card=>{
    card.addEventListener('click', ()=> openModal(card));
    card.addEventListener('keypress', (e)=>{ if(e.key==='Enter') openModal(card); });
  });
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal(); });

  // On-scroll reveal (IntersectionObserver)
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){ entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  },{threshold:0.12});
  document.querySelectorAll('.reveal, .project-card').forEach(el=>observer.observe(el));

  // Drag-to-scroll for horizontal gallery on small screens
  const grid = document.querySelector('.projects-grid');
  let isDown=false,startX,scrollLeft;
  if(grid){
    grid.addEventListener('mousedown', (e)=>{ isDown=true; grid.classList.add('dragging'); startX=e.pageX-grid.offsetLeft; scrollLeft=grid.scrollLeft; });
    grid.addEventListener('mouseleave', ()=>{ isDown=false; grid.classList.remove('dragging'); });
    grid.addEventListener('mouseup', ()=>{ isDown=false; grid.classList.remove('dragging'); });
    grid.addEventListener('mousemove', (e)=>{
      if(!isDown) return; e.preventDefault(); const x=e.pageX-grid.offsetLeft; const walk=(x-startX)*2; grid.scrollLeft=scrollLeft-walk;
    });
  }
});
