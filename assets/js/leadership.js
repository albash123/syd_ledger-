(()=>{
 const section=document.querySelector('.ceo-section');if(!section)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const visual=section.querySelector('.ceo-visual');
 visual.addEventListener('pointermove',e=>{if(reduced.matches||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;const b=visual.getBoundingClientRect();const x=(e.clientX-b.left)/b.width,y=(e.clientY-b.top)/b.height;visual.style.setProperty('--pointer-x',`${x*100}%`);visual.style.setProperty('--pointer-y',`${y*100}%`);visual.style.setProperty('--ceo-x',`${(x-.5)*12}px`);visual.style.setProperty('--ceo-y',`${(y-.5)*12}px`)});
 visual.addEventListener('pointerleave',()=>{visual.style.setProperty('--ceo-x','0px');visual.style.setProperty('--ceo-y','0px')});
 if(!window.gsap||!window.ScrollTrigger)return;
 gsap.registerPlugin(ScrollTrigger);
 gsap.matchMedia().add('(prefers-reduced-motion: no-preference)',()=>{
 const tl=gsap.timeline({scrollTrigger:{trigger:section,start:'top 80%',once:true},defaults:{duration:.8,ease:'power3.out',clearProps:'all'}});
 tl.from(section.querySelector('.ceo-label'),{opacity:0,y:16})
 .from(section.querySelectorAll('h2>span'),{opacity:0,y:22,stagger:.12},.15)
 .from(section.querySelector('.ceo-frame'),{opacity:0,scale:.92,x:-35},.3)
 .from(section.querySelector('.ceo-message'),{opacity:0,y:40},.5)
 .from(section.querySelectorAll('.ceo-float'),{opacity:0,scale:.96,stagger:.12},.85)
 .from(section.querySelector('.ceo-identity'),{opacity:0,y:14},1.05);
 });
})();

