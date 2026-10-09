document.documentElement.classList.add('enhanced');
const menu=document.querySelector('.menu'),nav=document.querySelector('#main-nav');
function closeMenu(){menu.setAttribute('aria-expanded','false');menu.textContent=menu.dataset.open;nav.classList.remove('open');}
if(menu&&nav){menu.hidden=false;menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.textContent=open?menu.dataset.close:menu.dataset.open;nav.classList.toggle('open',open);});nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});}
const buttons=[...document.querySelectorAll('[data-mode]')],panels=[...document.querySelectorAll('[data-panel]')];
function selectMode(value){buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===value)));panels.forEach(p=>{p.hidden=p.dataset.panel!==value;});}
buttons.forEach((b,i)=>{b.hidden=false;b.addEventListener('click',()=>selectMode(b.dataset.mode));b.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%buttons.length;if(e.key==='ArrowLeft')next=(i+buttons.length-1)%buttons.length;if(next!==undefined){e.preventDefault();buttons[next].focus();selectMode(buttons[next].dataset.mode);}});});
if(buttons.length)selectMode('0');
