(function(){
function products(){try{const x=JSON.parse(localStorage.getItem('rc_products')||'[]');return Array.isArray(x)?x:[]}catch(e){return[]}}
function orders(){try{const x=JSON.parse(localStorage.getItem('rc_orders')||'[]');return Array.isArray(x)?x:[]}catch(e){return[]}}
function money(v){const n=Number(v);return Number.isFinite(n)?'₹'+n.toLocaleString('en-IN'):'₹'+v}
function add(text,who){const b=document.getElementById('rcAiMessages');if(!b)return;const r=document.createElement('div');r.className='rc-ai-msg '+who;const d=document.createElement('div');d.className='rc-ai-bubble';d.textContent=text;r.appendChild(d);b.appendChild(r);b.scrollTop=b.scrollHeight}
function welcome(){const b=document.getElementById('rcAiMessages');if(b&&!b.children.length)add('Hi! 👋 I am the RuralConnect demo AI. I can search products, check prices, explain selling, and help with saved order information.','bot')}
window.rcAiToggle=function(){const p=document.getElementById('rcAiPanel');if(!p)return;p.style.display=p.style.display==='block'?'none':'block';if(p.style.display==='block'){welcome();setTimeout(()=>document.getElementById('rcAiInput')?.focus(),50)}}
window.rcAiQuick=function(t){const i=document.getElementById('rcAiInput');if(i)i.value=t;rcAiSend({preventDefault:function(){}})}
window.rcAiSend=function(e){e&&e.preventDefault();const i=document.getElementById('rcAiInput');if(!i)return;const q=i.value.trim();if(!q)return;add(q,'user');i.value='';setTimeout(()=>answer(q),220)}
function answer(q0){
const q=q0.toLowerCase(),ps=products(),os=orders();
if(/^(hi|hello|hey)\b/.test(q)){add('Hello! 😊 What would you like to know about RuralConnect?','bot');return}
if(q.includes('sell')||q.includes('producer')||q.includes('farmer')||q.includes('add product')){add('To sell on RuralConnect, use the Producer section, add product name, price, category, stock and location, then manage incoming orders from the producer dashboard.','bot');return}
if(q.includes('track')||q.includes('order status')||q.includes('where is my order')){
 if(!os.length){add('I could not find any saved orders on this device yet. Place an order first, then I can help with the saved order information.','bot')}
 else{const x=os[os.length-1],id=x.id||x.orderId||x.trackingId||'latest order',s=x.status||x.orderStatus||'Status available in Orders/Tracking';add('Your latest saved order is '+id+'. Current saved status: '+s+'. Open Orders or Tracking for the full timeline.','bot')}return}
if(q.includes('under')||q.includes('below')||q.includes('less than')){
 const m=q.match(/(?:under|below|less than)\s*(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)/i);
 if(m){const lim=Number(m[1]),f=ps.filter(p=>Number(p.price)<=lim);add(f.length?'Products at or below '+money(lim)+':\n'+f.slice(0,8).map(p=>'• '+(p.name||p.title||'Product')+' — '+money(p.price)+(p.unit?'/'+p.unit:'')).join('\n'):'I could not find a saved product at or below '+money(lim)+'.','bot');return}}
if(q.includes('product')||q.includes('item')||q.includes('available')||q.includes('rice')||q.includes('wheat')||q.includes('honey')||q.includes('vegetable')){
 if(!ps.length){add('There are no products saved right now. Add products to RuralConnect and I can search them.','bot')}
 else{add('Here are some RuralConnect products:\n'+ps.slice(0,8).map(p=>'• '+(p.name||p.title||'Product')+' — '+money(p.price)+(p.unit?'/'+p.unit:'')+(p.producer?' • '+p.producer:'')).join('\n'),'bot')}return}
if(q.includes('login')||q.includes('sign in')||q.includes('account')){add('Use the Login section and choose Buyer or Producer. Your demo session is stored locally in this browser.','bot');return}
if(q.includes('auction')||q.includes('bid')||q.includes('bidding')){
 const as=JSON.parse(localStorage.getItem('rc_auctions')||'[]');
 const live=Array.isArray(as)?as.filter(a=>new Date(a.endTime).getTime()>Date.now()):[];
 if(live.length){
   add('There are '+live.length+' live auction(s). Open the Auctions section to see the current bid and place a higher bid as a Buyer.','bot');
 } else {
   add('There are no live auctions right now. A Producer can create one from the Producer Dashboard.','bot');
 }
 return
}
if(q.includes('cart')||q.includes('buy')){add('Choose a product from the marketplace, add it to your cart, then open Cart to continue the demo checkout flow. You can also open Auctions to bid on auction products.','bot');return}
add('I am the RuralConnect demo AI, so I use built-in rules and the data saved in this website. Try: “What products are available?”, “Show me products under ₹100”, “How can I sell my products?”, “How do auctions work?”, or “Track my order”.','bot')
}
document.addEventListener('DOMContentLoaded',welcome);
})();
