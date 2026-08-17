const root=document.documentElement;
const header=document.querySelector("[data-header]");
const menuButton=document.querySelector("[data-menu-button]");
const menu=document.querySelector("[data-menu]");
const progress=document.querySelector(".scroll-progress span");
const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelector("[data-year]").textContent=new Date().getFullYear();
function closeMenu(){
  if(!menuButton||!menu)return;
  menuButton.setAttribute("aria-expanded","false");
  menu.classList.remove("is-open");
}
menuButton?.addEventListener("click",()=>{
  const open=menuButton.getAttribute("aria-expanded")==="true";
  menuButton.setAttribute("aria-expanded",String(!open));
  menu.classList.toggle("is-open",!open);
});
menu?.querySelectorAll("a").forEach(link=>link.addEventListener("click",closeMenu));
document.addEventListener("keydown",event=>{if(event.key==="Escape")closeMenu()});

function updateScroll(){
  const scrollable=document.documentElement.scrollHeight-window.innerHeight;
  progress.style.width=`${scrollable>0?(window.scrollY/scrollable)*100:0}%`;
  header?.classList.toggle("is-scrolled",window.scrollY>24);
}
updateScroll();
window.addEventListener("scroll",updateScroll,{passive:true});

if(!reduceMotion){
  window.addEventListener("pointermove",event=>{
    root.style.setProperty("--mx",`${event.clientX}px`);
    root.style.setProperty("--my",`${event.clientY}px`);
  },{passive:true});
}
document.querySelectorAll("[data-delay]").forEach(element=>{
  element.style.setProperty("--delay",`${element.dataset.delay}ms`);
});

if("IntersectionObserver" in window&&!reduceMotion){
  const revealObserver=new IntersectionObserver((entries,observer)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.13,rootMargin:"0px 0px -40px"});
  document.querySelectorAll(".reveal, .skill-row").forEach(element=>revealObserver.observe(element));
}else{
  document.querySelectorAll(".reveal, .skill-row").forEach(element=>element.classList.add("is-visible"));
}

const sections=[...document.querySelectorAll("main section[id]")];
const navLinks=[...document.querySelectorAll('.site-nav a[href^="#"]')];
if("IntersectionObserver" in window){
  const sectionObserver=new IntersectionObserver(entries=>{
    const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(!visible)return;
    navLinks.forEach(link=>link.classList.toggle("is-active",link.getAttribute("href")===`#${visible.target.id}`));
  },{rootMargin:"-25% 0px -60%",threshold:[.05,.3,.6]});
  sections.forEach(section=>sectionObserver.observe(section));
}

const tiltCard=document.querySelector("[data-tilt]");
if(tiltCard&&!reduceMotion&&window.matchMedia("(pointer: fine)").matches){
  tiltCard.addEventListener("pointermove",event=>{
    const rect=tiltCard.getBoundingClientRect();
    const x=(event.clientX-rect.left)/rect.width-.5;
    const y=(event.clientY-rect.top)/rect.height-.5;
    tiltCard.style.transform=`perspective(900px) rotateY(${x*7}deg) rotateX(${y*-7}deg) translateY(-3px)`;
  });
  tiltCard.addEventListener("pointerleave",()=>{tiltCard.style.transform=""});
}
