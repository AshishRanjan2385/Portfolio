
/* ===== CURSOR ===== */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mx=0,my=0,fx=0,fy=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  cursor.style.left=mx+'px';cursor.style.top=my+'px';
});
(function animateCursor(){
  fx+=(mx-fx)*0.12;fy+=(my-fy)*0.12;
  follower.style.left=fx+'px';follower.style.top=fy+'px';
  requestAnimationFrame(animateCursor);
})();
document.querySelectorAll('a,button,.btn,.social-btn,.theme-toggle,.proj-link').forEach(el=>{
  el.addEventListener('mouseenter',()=>{
    cursor.style.width='20px';cursor.style.height='20px';
    follower.style.width='50px';follower.style.height='50px';
  });
  el.addEventListener('mouseleave',()=>{
    cursor.style.width='12px';cursor.style.height='12px';
    follower.style.width='36px';follower.style.height='36px';
  });
});

/* ===== TYPED TEXT ===== */
const phrases = [
  "Web Developer",
  "AI Web Developer",
  "Web Designer",
  "UI/UX Designer",
  "ECE Student @ SOA",
  "Freelancer"
];
let pi=0,ci=0,deleting=false;
const typed = document.getElementById('typed-text');
function typeLoop(){
  const phrase = phrases[pi];
  if(!deleting){
    typed.textContent = phrase.slice(0,ci+1);
    ci++;
    if(ci===phrase.length){ setTimeout(()=>{deleting=true;typeLoop();},1800);return; }
    setTimeout(typeLoop,80);
  } else {
    typed.textContent = phrase.slice(0,ci-1);
    ci--;
    if(ci===0){ deleting=false;pi=(pi+1)%phrases.length;setTimeout(typeLoop,300);return; }
    setTimeout(typeLoop,45);
  }
}
typeLoop();

/* ===== THEME TOGGLE ===== */
const html = document.documentElement;
const toggle = document.getElementById('themeToggle');
toggle.addEventListener('click',()=>{
  html.setAttribute('data-theme',
    html.getAttribute('data-theme')==='dark'?'light':'dark'
  );
});

/* ===== NAV SCROLL ===== */
const navbar = document.getElementById('navbar');
const progressBar = document.getElementById('progress-bar');
const backTop = document.getElementById('back-top');
window.addEventListener('scroll',()=>{
  const scrolled = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (scrolled/max*100)+'%';
  navbar.classList.toggle('scrolled',scrolled>60);
  backTop.classList.toggle('visible',scrolled>400);
});

/* ===== HAMBURGER ===== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click',()=>{
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if(navLinks.classList.contains('open')){
    spans[0].style.transform='rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity='0';
    spans[2].style.transform='rotate(-45deg) translate(5px,-5px)';
  } else {
    spans.forEach(s=>{s.style.transform='';s.style.opacity='';});
  }
});
navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  navLinks.classList.remove('open');
  hamburger.querySelectorAll('span').forEach(s=>{s.style.transform='';s.style.opacity='';});
}));

/* ===== SCROLL REVEAL ===== */
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting){
      setTimeout(()=>e.target.classList.add('visible'),i*80);
      revealObs.unobserve(e.target);
    }
  });
},{threshold:0.12});
reveals.forEach(r=>revealObs.observe(r));

/* ===== SKILL BARS ===== */
const bars = document.querySelectorAll('.skill-bar-fill');
const barObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.style.width=e.target.dataset.width+'%';
      barObs.unobserve(e.target);
    }
  });
},{threshold:0.3});
bars.forEach(b=>barObs.observe(b));

/* ===== ACTIVE NAV ===== */
const sections = document.querySelectorAll('section[id]');
const navAnchs = document.querySelectorAll('.nav-links a');
const activeObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      navAnchs.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id));
    }
  });
},{threshold:0.5});
sections.forEach(s=>activeObs.observe(s));

/* ===== FORM SUBMIT ===== */
function handleFormSubmit(e){
  e.preventDefault();
  const btn = e.target;
  btn.innerHTML='<i class="fas fa-check"></i> Message Sent!';
  btn.style.background='linear-gradient(135deg,#10b981,#059669)';
  setTimeout(()=>{
    btn.innerHTML='<i class="fas fa-paper-plane"></i> Send Message';
    btn.style.background='';
  },3000);
}

/* ===== PARTICLE CANVAS ===== */
const canvas = document.createElement('canvas');
canvas.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:0;opacity:0.35';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
let W,H,particles=[];
function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;}
resize();window.addEventListener('resize',resize);
class Particle{
  constructor(){this.reset();}
  reset(){
    this.x=Math.random()*W;this.y=Math.random()*H;
    this.vx=(Math.random()-.5)*0.3;this.vy=(Math.random()-.5)*0.3;
    this.size=Math.random()*1.5+0.5;this.alpha=Math.random()*0.4+0.1;
  }
  update(){
    this.x+=this.vx;this.y+=this.vy;
    if(this.x<0||this.x>W||this.y<0||this.y>H)this.reset();
  }
  draw(){
    const isDark=document.documentElement.getAttribute('data-theme')==='dark';
    ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
    ctx.fillStyle=isDark?`rgba(0,212,255,${this.alpha})`:`rgba(0,136,204,${this.alpha})`;
    ctx.fill();
  }
}
for(let i=0;i<80;i++)particles.push(new Particle());
function animParticles(){
  ctx.clearRect(0,0,W,H);
  particles.forEach(p=>{p.update();p.draw();});
  // connect nearby
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const dx=particles[i].x-particles[j].x;
      const dy=particles[i].y-particles[j].y;
      const dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<120){
        const isDark=document.documentElement.getAttribute('data-theme')==='dark';
        ctx.beginPath();
        ctx.strokeStyle=isDark?`rgba(0,212,255,${0.08*(1-dist/120)})`:`rgba(0,136,204,${0.06*(1-dist/120)})`;
        ctx.lineWidth=0.5;
        ctx.moveTo(particles[i].x,particles[i].y);
        ctx.lineTo(particles[j].x,particles[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animParticles);
}
animParticles();

