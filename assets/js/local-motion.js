(()=>{
 // Native section snapping keeps wheel, touch, keyboard and long sections usable.
 const sections=[...document.querySelectorAll('main > section')].filter(el=>!el.classList.contains('international-ribbon'));
 document.documentElement.classList.add('section-scroll-preview');
 sections.forEach(el=>el.classList.add('scroll-screen'));
 if(window.gsap&&window.ScrollTrigger){
  gsap.registerPlugin(ScrollTrigger);
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)',()=>{
   sections.slice(1).forEach(section=>{
    const content=section.querySelector(':scope > .site-container');
    if(!content)return;
    gsap.fromTo(content,{y:45,scale:.975},{y:0,scale:1,ease:'none',scrollTrigger:{trigger:section,start:'top bottom',end:'top 22%',scrub:.65},clearProps:'transform'});
   });
  });
 }
 const artwork=document.querySelector('.artwork-visual');
 if(artwork){const panel=document.createElement('div');panel.className='bookkeeping-live';panel.setAttribute('aria-hidden','true');panel.innerHTML='<strong>Bookkeeping, in motion</strong><div class="live-rows">'+['Sales','Expenses','Invoices','Receipts'].map((label,i)=>`<div class="live-row" style="--delay:${i*.65}s"><svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg><span>${label}</span></div>`).join('')+'</div>';artwork.append(panel)}
 document.querySelectorAll('.finance-visual .ledger-row').forEach((row,i)=>row.style.setProperty('--delay',`${i*.65}s`));
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('is-checking',entry.isIntersecting)),{threshold:.25});
 document.querySelectorAll('.artwork-visual,.finance-visual').forEach(el=>observer.observe(el));
 const stage=document.querySelector('.finance-visual');
 if(stage){
  const chart=stage.querySelector('.abstract-chart')?.outerHTML||'';
  const check='<svg class="line-icon" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>';
  const items=[
   {title:'Bookkeeping',short:'Clean, organized books',rows:['Sales','Expenses','Invoices','Receipts']},
   {title:'QuickBooks & Xero',short:'Certified',rows:['QuickBooks & Xero certified','Industry-standard tools','Organized financial records']},
   {title:'Growth',short:'Clearer financial insights',rows:['Monthly income and expenses','Clear financial reports','More time for your business'],chart:true},
   {title:'100% remote',short:'Across the border',rows:['Based in Pakistan','UK, US, UAE & Canada','Seamless remote support']}
  ];
  stage.querySelectorAll('.ledger-panel,.visual-chip,.chart-panel').forEach(el=>{window.gsap?.killTweensOf(el);el.remove()});
  const cards=items.map((item,i)=>{const card=document.createElement('div');card.className='rotating-finance-card';card.dataset.slot=String(i);card.innerHTML=`<strong>${item.title}</strong><small class="rotation-summary">${item.short}</small><div class="rotation-details">${item.rows.map((text,j)=>`<div class="ledger-row" style="--delay:${j*.65}s">${check}<span>${text}</span></div>`).join('')}</div>${item.chart?chart:''}`;stage.append(card);return card});
  let step=0;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  window.setInterval(()=>{if(document.hidden||reduce.matches||document.documentElement.classList.contains('pause-motion')||!stage.classList.contains('is-checking'))return;step=(step+1)%4;cards.forEach((card,i)=>card.dataset.slot=String((i-step+4)%4));},3000);
 }
 const benefits=document.querySelector('.benefit-showcase');
 if(benefits){
  const nodes=[benefits.querySelector('.benefit-core'),...benefits.querySelectorAll('.benefit-card')].filter(Boolean);
  const descriptions=['','Than hiring a local bookkeeper or accountant.','We work with clients across the US, UK, Canada, UAE and beyond.','Monthly reports delivered on time, every time.','Your financial data is always protected.','Industry-standard tools you already use.'];
  nodes.forEach((el,i)=>{
   window.gsap?.killTweensOf(el);el.removeAttribute('data-tilt');el.removeAttribute('data-reveal');el.style.removeProperty('transform');el.style.removeProperty('opacity');
   el.classList.add('benefit-rotator');el.dataset.benefitSlot=String(i);
   if(i){const detail=document.createElement('p');detail.className='benefit-expanded-copy';detail.textContent=descriptions[i];el.append(detail);}
  });
  benefits.classList.add('benefits-rotating');
  let visible=false,step=0;
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting},{threshold:.25}).observe(benefits);
  setInterval(()=>{
   if(!visible||document.hidden||matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.classList.contains('pause-motion'))return;
   step=(step+1)%nodes.length;
   nodes.forEach((el,i)=>el.dataset.benefitSlot=String((i-step+nodes.length)%nodes.length));
  },3000);
 }
})();

