// Main data used by the marketplace
const defaultProducts = [
{
  id:1,name:"Organic Rice",price:55,unit:"kg",stock:500,producer:"Ram Kumar",location:"Bihar",category:"Agriculture",emoji:"🍚",desc:"High quality organic rice sourced directly from rural producers."
}
,
{
  id:2,name:"Wheat",price:40,unit:"kg",stock:350,producer:"Suresh Farms",location:"Uttar Pradesh",category:"Agriculture",emoji:"🌾",desc:"Fresh wheat suitable for retailers and food businesses."
}
,
{
  id:3,name:"Cotton Saree",price:800,unit:"piece",stock:50,producer:"Sita Weavers",location:"Tamil Nadu",category:"Handloom",emoji:"🧵",desc:"Handwoven cotton saree made by local weavers."
}
,
{
  id:4,name:"Fresh Vegetables",price:30,unit:"kg",stock:200,producer:"Green Fields",location:"Maharashtra",category:"Agriculture",emoji:"🥬",desc:"Fresh seasonal vegetables supplied in bulk."
}
,
{
  id:5,name:"Raw Honey",price:250,unit:"kg",stock:80,producer:"Hill Producers",location:"Uttarakhand",category:"Food Products",emoji:"🍯",desc:"Naturally sourced honey from rural beekeepers."
}
,
{
  id:6,name:"Handicraft Items",price:500,unit:"piece",stock:40,producer:"Rural Artisans",location:"Rajasthan",category:"Handicrafts",emoji:"🏺",desc:"Traditional handcrafted products made by local artisans."
}
];
let products = JSON.parse(localStorage.getItem("rc_products") || "null") || defaultProducts;
let currentUser = JSON.parse(localStorage.getItem("rc_user") || "null");
let postLoginHash = null;
let cart = JSON.parse(localStorage.getItem("rc_cart") || "[]");
let orders = JSON.parse(localStorage.getItem("rc_orders") || "[]");
let auctions = JSON.parse(localStorage.getItem("rc_auctions") || "[]");
let currentRole = "producer";
// Save the current data so it stays after refresh
function save() {
  localStorage.setItem("rc_cart",JSON.stringify(cart));
  localStorage.setItem("rc_orders",JSON.stringify(orders));
  localStorage.setItem("rc_products",JSON.stringify(products));
  localStorage.setItem("rc_auctions",JSON.stringify(auctions));
  if(currentUser)localStorage.setItem("rc_user",JSON.stringify(currentUser));
  else localStorage.removeItem("rc_user");
  updateCartCount()
}
function updateCartCount() {
  document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0)
}
function go(hash) {
  location.hash=hash
}
function money(n) {
  return "₹"+n.toLocaleString("en-IN")
}
function toast(msg) {
  const t=document.getElementById("toast");
  t.textContent=msg;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),2200)
}
function layout(title, body) {
  return `<section class="page"><div class="section-head"><div><h2>${title}</h2></div></div>${body}</section>`
}
function home() {
  return `<section class="page">
  <div class="hero">
    <div class="hero-copy">
      <div class="eyebrow">Fresh products • Fair trade • Stronger communities</div>
      <h1>From villages<br>to <span>greater markets.</span></h1>
      <p>RuralConnect is a simple B2B platform connecting farmers, weavers and artisans with retailers, restaurants and other urban businesses.</p>
      <div class="actions"><a class="btn" href="#products">Explore Products</a><a class="btn secondary" href="#register">Become a Producer</a></div>
    </div>
    <div class="hero-art"><div class="farm-scene">👨‍🌾🌾</div><div class="farm-label">Direct rural-to-urban supply</div></div>
  </div>
  <div class="category-strip">
    <div class="cat"><div class="icon">🌿</div><strong>Fresh Produce</strong><small>Farm products</small></div>
    <div class="cat"><div class="icon">🧵</div><strong>Handloom</strong><small>Local weavers</small></div>
    <div class="cat"><div class="icon">🏺</div><strong>Handicrafts</strong><small>Rural artisans</small></div>
    <div class="cat"><div class="icon">🤝</div><strong>Direct Trade</strong><small>B2B connection</small></div>
  </div>
  <div id="about" class="about-grid" style="margin-top:55px">
    <div class="card about-box"><h3>Why RuralConnect?</h3><p>We simplify the connection between rural producers and urban business buyers by giving both sides one digital place to discover products and manage orders.</p></div>
    <div class="card about-box"><h3>How it works</h3><p>Producer lists products → Buyer discovers products → Buyer places a bulk order → Producer receives and manages the order.</p></div>
  </div>
</section>`;
}
function register() {
  return layout("Create an Account",`<div class="card form-card">
  <div class="role-switch"><button class="${currentRole==="producer"?"active":""}" onclick="setRole('producer')">🌾 Producer</button><button class="${currentRole==="buyer"?"active":""}" onclick="setRole('buyer')">🏪 Buyer</button></div>
  <form onsubmit="registerSubmit(event)">
    <div class="form-grid">
      <div class="field full"><label>Full Name</label><input required placeholder="Enter your name"></div>
      <div class="field"><label>Email</label><input required type="email" placeholder="Enter your email"></div>
      <div class="field"><label>Phone Number</label><input required placeholder="Enter your phone number"></div>
      <div class="field full"><label>Location</label><input required placeholder="Enter village/city"></div>
      <div class="field full"><label>${currentRole==="producer"?"Type of Products":"Business Type"}</label><select><option>Agriculture</option><option>Handloom</option><option>Handicrafts</option><option>Food Products</option><option>Retailer</option><option>Restaurant</option><option>Wholesaler</option></select></div>
    </div>
    <button class="btn" style="width:100%;margin-top:20px">Sign Up</button>
  </form>
  <p style="text-align:center;color:var(--muted);font-size:13px">Already have an account? <a href="#login" style="color:var(--green);font-weight:700">Login</a></p>
</div>`);
}
function setRole(r) {
  currentRole=r;
  render()
}
function registerSubmit(e) {
  e.preventDefault();
  const inputs=e.target.querySelectorAll("input");
  currentUser= {
    name:inputs[0].value.trim(),
    email:inputs[1].value.trim(),
    phone:inputs[2].value.trim(),
    location:inputs[3].value.trim(),
    role:currentRole
  }
  save();
  toast(`${currentRole==="producer"?"Producer":"Buyer"} account created successfully!`);
  setTimeout(()=>go(currentRole==="producer"?"#producer-dashboard":"#buyer-dashboard"),400);
}
function login() {
  return layout("Login",`<div class="card form-card">
  <div class="role-switch"><button class="${currentRole==="producer"?"active":""}" onclick="setRole('producer')">🌾 Producer</button><button class="${currentRole==="buyer"?"active":""}" onclick="setRole('buyer')">🏪 Buyer</button></div>
  <form onsubmit="loginSubmit(event)">
    <div class="field"><label>Email</label><input type="email" required placeholder="you@example.com"></div>
    <div class="field" style="margin-top:15px"><label>Password</label><input type="password" required placeholder="••••••••"></div>
    <button class="btn" style="width:100%;margin-top:20px">Login</button>
  </form>
  <p style="text-align:center;color:var(--muted);font-size:13px">New here? <a href="#register" style="color:var(--green);font-weight:700">Create account</a></p>
</div>`);
}
function loginSubmit(e) {
  e.preventDefault();

  const form = e.currentTarget || e.target;
  const emailInput = form.querySelector('input[type="email"]');
  const passwordInput = form.querySelector('input[type="password"]');

  const email = emailInput ? emailInput.value.trim() : "";
  const password = passwordInput ? passwordInput.value : "";

  if (!email || !password) {
    toast("Please enter email ID and password.");
    return;
  }

  // Use the role selected on the Login page.
  const role = currentRole === "producer" ? "producer" : "buyer";

  currentUser = {
    name: email.split("@")[0] || (role === "producer" ? "Producer" : "Buyer"),
    email: email,
    phone: "",
    location: "",
    role: role
  };

  // Replace any previous session with the new login.
  localStorage.setItem("rc_user", JSON.stringify(currentUser));
  currentRole = role;

  toast(role === "producer" ? "Producer login successful!" : "Buyer login successful!");

  const next = postLoginHash || (role === "producer" ? "#producer-dashboard" : "#buyer-dashboard");
  postLoginHash = null;

  setTimeout(() => go(next), 400);
}

function isLoggedIn() {
  return !!currentUser
}
function isBuyer() {
  return !!currentUser && currentUser.role==="buyer"
}
function isProducer() {
  return !!currentUser && currentUser.role==="producer"
}
function requireBuyer(nextHash) {
  if(isBuyer()) return true;
  if(isProducer()) {
    toast("Producer accounts cannot place buyer orders.");
    return false;
  }
  postLoginHash=nextHash || "#cart";
  toast("Please login as a Buyer to place an order.");
  setTimeout(()=>go("#login"),450);
  return false;
}
function logout() {
  currentUser=null;
  localStorage.removeItem("rc_user");
  toast("Logged out");
  setTimeout(()=>go("#home"),300);
}
function updateNav() {
  const nav=document.getElementById("mainNav");
  if(!nav)return;
  nav.innerHTML = isLoggedIn()
  ? `<a href="#home">Home</a><a href="#products">Products</a><a href="#auctions">Auctions</a><a href="#about">About</a>
       <a href="${isProducer()?"#producer-dashboard":"#buyer-dashboard"}">${isProducer()?"Producer Dashboard":"Buyer Dashboard"}</a>
       <a href="#cart">Cart</a><button class="btn ghost" style="padding:8px 11px" onclick="logout()">Logout</button>`
  : `<a href="#home">Home</a><a href="#products">Products</a><a href="#auctions">Auctions</a><a href="#about">About</a>
       <a href="#login">Login</a><a class="nav-signup" href="#register">Sign Up</a>`;
}
function myProducerProducts() {
  return isProducer() ? products.filter(p=>p.producer===currentUser.name || p.producerEmail===currentUser.email) : [];
}
function producerAddProduct(e) {
  e.preventDefault();
  if(!isProducer()) {
    toast("Please login as a producer.");
    return
  }
  const f=e.target;
  const name=f.querySelector('[name="pname"]').value.trim();
  const price=Number(f.querySelector('[name="price"]').value);
  const unit=f.querySelector('[name="unit"]').value;
  const stock=Number(f.querySelector('[name="stock"]').value);
  const category=f.querySelector('[name="category"]').value;
  const emoji=f.querySelector('[name="emoji"]').value.trim() || "📦";
  const desc=f.querySelector('[name="desc"]').value.trim() || "Product supplied directly by a rural producer.";
  if(!name || !price || !stock) {
    toast("Please fill all required fields.");
    return
  }
  const nextId=products.reduce((m,p)=>Math.max(m,p.id),0)+1;
  products.push( {
    id:nextId,name,price,unit,stock,category,emoji,desc,
    producer:currentUser.name,producerEmail:currentUser.email,
    location:currentUser.location || "Rural India"
  }
  );
  save();
  toast("Product listed successfully!");
  f.reset();
  render();
}
function deleteProduct(id) {
  const p=products.find(x=>x.id===Number(id));
  if(!p || !isProducer())return;
  if(p.producer!==currentUser.name && p.producerEmail!==currentUser.email) {
    toast("You can only manage your own products.");
    return;
  }
  products=products.filter(x=>x.id!==Number(id));
  save();
  toast("Product removed.");
  render();
}
function producerDashboard() {
  if(!isProducer()) {
    return layout("Producer Login Required",`<div class="card empty"><h3>Only producers can access this dashboard.</h3><a class="btn" href="#login">Login as Producer</a></div>`);
  }
  const mine=myProducerProducts();

  // Find only the orders that contain products sold by this producer.
  const producerOrders = orders.filter(o => {
    return o.items.some(item => {
      const p = products.find(x => x.id === item.id);
      return p && (
        p.producerEmail === currentUser.email ||
        p.producer === currentUser.name
      );
    });
  });

  const sales=producerOrders.reduce((s,o)=>s+o.total,0);
  return layout("Producer Dashboard",`
    <div class="section-head">
      <div><h2 style="margin:0">Welcome, ${currentUser.name}</h2><p>List your products and manage buyer orders.</p></div>
      <span class="user-pill">🌾 Producer</span>
    </div>

    <div class="dashboard-grid">
      <div class="stat"><small>My Products</small><div class="num">${mine.length}</div></div>
      <div class="stat"><small>Orders Received</small><div class="num">${producerOrders.length}</div></div>
      <div class="stat"><small>Total Sales</small><div class="num">${money(sales)}</div></div>
      <div class="stat"><small>Location</small><div class="num" style="font-size:18px">${currentUser.location||"Not added"}</div></div>
    </div>

    <div class="manage-grid">
      <div class="card form-card" style="max-width:none;margin:0">
        <h3>➕ List a New Product</h3>
        <p class="role-note">Publish a product here and it will appear in the public marketplace for buyers.</p>
        <form onsubmit="producerAddProduct(event)">
          <div class="form-grid">
            <div class="field full"><label>Product Name *</label><input name="pname" required placeholder="e.g. Organic Rice"></div>
            <div class="field"><label>Price (₹) *</label><input name="price" type="number" min="1" required placeholder="55"></div>
            <div class="field"><label>Unit *</label><select name="unit"><option>kg</option><option>piece</option><option>box</option><option>litre</option></select></div>
            <div class="field"><label>Available Stock *</label><input name="stock" type="number" min="1" required placeholder="500"></div>
            <div class="field"><label>Category *</label><select name="category"><option>Agriculture</option><option>Handloom</option><option>Handicrafts</option><option>Food Products</option></select></div>
            <div class="field"><label>Emoji</label><input name="emoji" maxlength="4" placeholder="🌾"></div>
            <div class="field full"><label>Description</label><input name="desc" placeholder="Short product description"></div>
          </div>
          <button class="btn" style="width:100%;margin-top:18px">Publish Product</button>
        </form>
      </div>

      <div class="card" style="padding:22px">
        <h3>📦 My Listed Products</h3>
        <div class="product-manage-list">
          ${mine.length ? mine.map(p=>`
  <div class="manage-item">
  <div class="mi-icon">${p.emoji}
  </div>
  <div class="manage-item-main"><b>${p.name}
  </b><small>${money(p.price)}
  / ${p.unit}
  • Stock: ${p.stock}
  </small></div>
  <button class="btn danger" onclick="deleteProduct(${p.id})">Delete</button>
  </div>`).join("")
          : `<div class="empty">You haven't listed a product yet.</div>`}
        </div>
      </div>
    </div>


    <div class="card form-card" style="max-width:none;margin-top:20px">
      <h3>🔨 Create a Product Auction</h3>
      <p class="role-note">Choose one of your products and set the starting price. Buyers can then bid their own price.</p>
      ${mine.length ? `
      <form onsubmit="createAuction(event)">
        <div class="form-grid">
          <div class="field"><label>Product *</label>
            <select name="auctionProduct" required>
              ${mine.map(p=>`<option value="${p.id}">${p.name} — ${money(p.price)}/${p.unit}</option>`).join("")}
            </select>
          </div>
          <div class="field"><label>Starting Bid (₹) *</label>
            <input name="startingBid" type="number" min="1" required placeholder="e.g. 50">
          </div>
          <div class="field"><label>Auction Quantity *</label>
            <input name="auctionQty" type="number" min="1" required placeholder="e.g. 50">
          </div>
          <div class="field"><label>Duration *</label>
            <select name="auctionDays">
              <option value="1">1 day</option>
              <option value="3" selected>3 days</option>
              <option value="7">7 days</option>
            </select>
          </div>
        </div>
        <button class="btn" style="width:100%;margin-top:18px">Start Auction</button>
      </form>` : `<div class="empty">List a product first before creating an auction.</div>`}
    </div>

    <div class="card table-card" style="margin-top:20px">
      <div class="section-head"><div><h3 style="margin:0">Buyer Orders</h3><p>Orders placed through the marketplace.</p></div></div>
      <table class="table"><thead><tr><th>#</th><th>Product</th><th>Quantity</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>
        ${producerOrders.length ? producerOrders.slice(0,8).map(o=>{
          const p=products.find(x=>x.id===o.items[0].id)||defaultProducts.find(x=>x.id===o.items[0].id);
          return `<tr><td>#${o.id}</td><td>${p?p.name:"Product"}</td><td>${o.items[0].qty} ${p?p.unit:"unit"}</td><td><span class="status pending">${o.status}</span></td><td><a class="btn secondary" href="#tracking/${o.id}" style="padding:7px 10px">View</a></td></tr>`;
        }).join("") : `<tr><td colspan="5" class="empty">No buyer orders yet.</td></tr>`}
      </tbody></table>
    </div>
  `);
}


function getAuctionProduct(a) {
  return products.find(p => p.id === Number(a.productId)) ||
         defaultProducts.find(p => p.id === Number(a.productId));
}

function auctionIsOpen(a) {
  return new Date(a.endTime).getTime() > Date.now();
}

function auctionHighestBid(a) {
  if(!a.bids || !a.bids.length) return Number(a.startingBid);
  return Math.max(Number(a.startingBid), ...a.bids.map(b => Number(b.amount)));
}

function auctionHighestBidder(a) {
  if(!a.bids || !a.bids.length) return null;
  return a.bids.reduce((best,b) => Number(b.amount) > Number(best.amount) ? b : best, a.bids[0]);
}

function auctionPage() {
  const active = auctions.filter(a => auctionIsOpen(a));
  const ended = auctions.filter(a => !auctionIsOpen(a));

  return layout("Auction Section",`
    <div class="card" style="padding:22px;margin-bottom:20px">
      <h3>🔨 RuralConnect Auctions</h3>
      <p class="role-note">Producers can put a product up for auction. Buyers can enter the price they are willing to pay. The highest bid when the auction ends is the winning bid.</p>
      <div class="actions">
        ${isProducer() ? `<a class="btn" href="#producer-dashboard">Create an Auction</a>` : ""}
        ${!isLoggedIn() ? `<a class="btn secondary" href="#login">Login to Bid</a>` : ""}
      </div>
    </div>

    <h3 style="margin:25px 0 14px">🔥 Live Auctions</h3>
    <div class="products-grid">
      ${active.length ? active.map(auctionCard).join("") :
        `<div class="card empty" style="grid-column:1/-1">No live auctions right now.</div>`}
    </div>

    ${ended.length ? `
      <h3 style="margin:30px 0 14px">Past Auctions</h3>
      <div class="products-grid">
        ${ended.slice().reverse().map(auctionCard).join("")}
      </div>` : ""}
  `);
}

function auctionCard(a) {
  const p = getAuctionProduct(a);
  if(!p) return "";
  const open = auctionIsOpen(a);
  const highest = auctionHighestBid(a);
  const bidder = auctionHighestBidder(a);

  return `<article class="card product-card">
    <div class="product-img">${p.emoji}</div>
    <div class="product-body">
      <h3>${p.name}</h3>
      <div class="price">Current bid: ${money(highest)} / ${p.unit}</div>
      <div class="meta">
        By: ${a.producer}<br>
        📦 Quantity: ${a.quantity} ${p.unit}<br>
        ${open ? "⏰ Ends: " + new Date(a.endTime).toLocaleString("en-IN") : "⛔ Auction ended"}
      </div>
      ${bidder && !open ? `<div class="meta" style="margin-top:8px">🏆 Winner: ${bidder.name}</div>` : ""}
      <div class="product-actions">
        <a class="btn secondary" href="#auction/${a.id}">View Auction</a>
        ${open && isBuyer() && a.producerEmail !== currentUser.email
          ? `<a class="btn" href="#auction/${a.id}">Place Bid</a>`
          : ""}
      </div>
    </div>
  </article>`;
}

function auctionDetail(id) {
  const a = auctions.find(x => x.id === Number(id));
  if(!a) return layout("Auction Not Found",`<div class="empty">This auction does not exist.</div>`);

  const p = getAuctionProduct(a);
  if(!p) return layout("Auction Not Found",`<div class="empty">The product for this auction is no longer available.</div>`);

  const open = auctionIsOpen(a);
  const highest = auctionHighestBid(a);
  const bidder = auctionHighestBidder(a);

  return layout("Product Auction",`
    <div class="detail">
      <div class="detail-image">${p.emoji}</div>
      <div class="detail-copy">
        <div class="eyebrow">${p.category} • 🔨 Auction</div>
        <h1>${p.name}</h1>
        <div class="meta">Producer: ${a.producer} • ${p.location}</div>
        <div class="detail-price">Current Bid: ${money(highest)} / ${p.unit}</div>
        <p style="color:var(--muted);line-height:1.7">${p.desc}</p>

        <div class="info-list">
          <div class="info"><small>Starting Bid</small><b>${money(a.startingBid)} / ${p.unit}</b></div>
          <div class="info"><small>Auction Quantity</small><b>${a.quantity} ${p.unit}</b></div>
          <div class="info"><small>Ends</small><b>${new Date(a.endTime).toLocaleString("en-IN")}</b></div>
        </div>

        ${open && isBuyer() && a.producerEmail !== currentUser.email ? `
          <form onsubmit="placeBid(event,${a.id})" style="margin-top:20px">
            <label style="font-weight:700;display:block;margin-bottom:8px">Your Bid (${p.unit})</label>
            <input name="bid" type="number" min="${highest + 1}" step="1" required
              placeholder="Enter more than ${money(highest)}"
              style="width:100%;padding:12px;border:1px solid #d8e1dc;border-radius:10px">
            <button class="btn" style="width:100%;margin-top:12px">💰 Place Bid</button>
          </form>
        ` : open && !isLoggedIn() ? `
          <div class="card" style="margin-top:18px;padding:16px;background:#f3f8f4">
            <b>Want to bid?</b>
            <p style="margin:6px 0 12px;color:var(--muted)">Login as a Buyer to enter your price.</p>
            <a class="btn" href="#login">Login as Buyer</a>
          </div>
        ` : open && isProducer() ? `
          <div class="card" style="margin-top:18px;padding:16px;background:#f3f8f4">
            This is a producer account. Buyers can place bids on this auction.
          </div>
        ` : `
          <div class="card" style="margin-top:18px;padding:16px;background:#f3f8f4">
            <b>⛔ Auction ended</b>
            ${bidder ? `<p style="margin:6px 0 0">Highest bid: ${money(bidder.amount)} by ${bidder.name}</p>` : `<p style="margin:6px 0 0">No bids were placed.</p>`}
          </div>
        `}
      </div>
    </div>

    <div class="card table-card" style="margin-top:20px">
      <div class="section-head"><div><h3 style="margin:0">Bid History</h3><p>Bids are stored locally in this demo.</p></div></div>
      ${a.bids && a.bids.length ? `
        <table class="table">
          <thead><tr><th>Buyer</th><th>Bid</th><th>Time</th></tr></thead>
          <tbody>
            ${a.bids.slice().reverse().map(b => `<tr>
              <td>${b.name}</td>
              <td><b>${money(b.amount)}</b> / ${p.unit}</td>
              <td>${new Date(b.time).toLocaleString("en-IN")}</td>
            </tr>`).join("")}
          </tbody>
        </table>
      ` : `<div class="empty">No bids yet. Be the first buyer to place a bid.</div>`}
    </div>
  `);
}

function placeBid(e,id) {
  e.preventDefault();

  if(!isBuyer()) {
    toast("Please login as a Buyer to place a bid.");
    return;
  }

  const a = auctions.find(x => x.id === Number(id));
  if(!a || !auctionIsOpen(a)) {
    toast("This auction has ended.");
    render();
    return;
  }

  if(a.producerEmail === currentUser.email) {
    toast("You cannot bid on your own auction.");
    return;
  }

  const amount = Number(e.target.querySelector('[name="bid"]').value);
  const highest = auctionHighestBid(a);

  if(!amount || amount <= highest) {
    toast("Your bid must be higher than the current bid.");
    return;
  }

  a.bids = a.bids || [];
  a.bids.push({
    name: currentUser.name,
    email: currentUser.email,
    amount: amount,
    time: new Date().toISOString()
  });

  save();
  toast("Bid placed successfully!");
  render();
}

function createAuction(e) {
  e.preventDefault();

  if(!isProducer()) {
    toast("Please login as a Producer.");
    return;
  }

  const f = e.target;
  const productId = Number(f.querySelector('[name="auctionProduct"]').value);
  const startingBid = Number(f.querySelector('[name="startingBid"]').value);
  const quantity = Number(f.querySelector('[name="auctionQty"]').value);
  const days = Number(f.querySelector('[name="auctionDays"]').value);
  const p = products.find(x => x.id === productId);

  if(!p || !startingBid || !quantity || !days) {
    toast("Please fill all auction fields.");
    return;
  }

  if(quantity > p.stock) {
    toast("Auction quantity cannot be greater than your stock.");
    return;
  }

  const myOpenAuction = auctions.some(a =>
    a.productId === productId &&
    a.producerEmail === currentUser.email &&
    auctionIsOpen(a)
  );

  if(myOpenAuction) {
    toast("This product already has a live auction.");
    return;
  }

  const nextId = auctions.reduce((m,a) => Math.max(m,a.id),0) + 1;

  auctions.push({
    id: nextId,
    productId: productId,
    producer: currentUser.name,
    producerEmail: currentUser.email,
    startingBid: startingBid,
    quantity: quantity,
    endTime: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
    bids: []
  });

  save();
  toast("Auction created successfully!");
  f.reset();
  render();
}

function productsPage(){
const cats=["All","Agriculture","Handloom","Handicrafts","Food Products"];
const active=new URLSearchParams(location.hash.split("?")[1]||"").get("cat")||"All";
let list=active==="All"?products:products.filter(p=>p.category===active);
return layout("Product Marketplace",`
  <div class="search-row"><input id="search" placeholder="Search for products..." oninput="filterProducts()"><button class="btn">🔍</button></div>
  <div class="filters">${cats.map(c=>`<button class="filter ${active===c?"active":""}" onclick="filterCat('${c}
  ')">${c}</button>`).join("")}</div>
  <div id="productGrid" class="products-grid">${list.map(productCard).join("")}</div>`);
}
function filterCat(c){go("#products?cat="+encodeURIComponent(c))}
function filterProducts(){
const q=document.getElementById("search").value.toLowerCase();
document.getElementById("productGrid").innerHTML=products.filter(p=>(p.name+p.category+p.producer).toLowerCase().includes(q)).map(productCard).join("")||`<div class="empty" style="grid-column:1/-1">No products found.</div>`;
}
function productCard(p){return `<article class="card product-card"><div class="product-img">${p.emoji}</div><div class="product-body"><h3>${p.name}</h3><div class="price">${money(p.price)} / ${p.unit}</div><div class="meta">By: ${p.producer}<br>📍 ${p.location}<br>Available: ${p.stock} ${p.unit}</div><div class="product-actions"><a class="btn secondary" href="#product/${p.id}">View Details</a><button class="btn" onclick="addToCart(${p.id})">Add</button></div></div></article>`}

function productDetail(id){
const p=products.find(x=>x.id===Number(id)); if(!p)return layout("Product not found",`<div class="empty">This product does not exist.</div>`);
return `<section class="page"><div class="detail"><div class="detail-image">${p.emoji}</div><div class="detail-copy"><div class="eyebrow">${p.category} • ✓ Verified Producer</div><h1>${p.name}</h1><div class="meta">By: ${p.producer} • ${p.location}</div><div class="detail-price">${money(p.price)} / ${p.unit}</div><p style="color:var(--muted);line-height:1.7">${p.desc}</p><div class="info-list"><div class="info"><small>Available Quantity</small><b>${p.stock} ${p.unit}</b></div><div class="info"><small>Minimum Order</small><b>${Math.max(10,Math.round(p.stock*.1))} ${p.unit}</b></div></div><label style="font-weight:700;display:block;margin-bottom:8px">Quantity (${p.unit})</label><div class="qty"><button onclick="changeDetailQty(-10)">−</button><span id="detailQty">100</span><button onclick="changeDetailQty(10)">+</button></div><div class="actions"><button class="btn" onclick="addDetail(${p.id})">Add to Cart</button><button class="btn secondary" onclick="toast('Quote request sent to producer')">Request a Quote</button></div><button class="btn ghost" style="margin-top:10px" onclick="toast('Opening WhatsApp order message…')">🟢 Order via WhatsApp</button></div></div></section>`;
}
let detailQty=100;
function changeDetailQty(n){detailQty=Math.max(10,detailQty+n);const el=document.getElementById("detailQty");if(el)el.textContent=detailQty}
function addDetail(id){const p=products.find(x=>x.id===id);addToCart(id,detailQty)}
function addToCart(id,qty=10){const p=products.find(x=>x.id===id);const found=cart.find(x=>x.id===id);if(found)found.qty+=qty;else cart.push({id,qty});save();toast(`${p.name} added to cart. Buyer login is required at checkout.`)}
function cartPage(){
if(!cart.length)return layout("Your Cart",`<div class="card empty"><div style="font-size:55px">🛒</div><h3>Your cart is empty</h3><p>Explore products and add a bulk order.</p><a class="btn" href="#products">Explore Products</a></div>`);
let subtotal=cart.reduce((s,i)=>{const p=products.find(x=>x.id===i.id);return s+p.price*i.qty},0);
return layout("Cart / Bulk Order",`<div class="cart-layout"><div class="card cart-list">${cart.map(i=>{const p=products.find(x=>x.id===i.id);return `<div class="cart-item"><div class="cart-icon">${p.emoji}</div><div class="cart-item-main"><b>${p.name}</b><div class="meta">${money(p.price)} / ${p.unit} • ${p.producer}</div></div><div class="qty"><button onclick="cartQty(${p.id},-10)">−</button><span>${i.qty}</span><button onclick="cartQty(${p.id},10)">+</button></div><b>${money(p.price*i.qty)}</b><button class="btn danger" onclick="removeCart(${p.id})">×</button></div>`}).join("")}</div><div class="card cart-total"><h3>Order Summary</h3><div class="total-row"><span>Items</span><b>${cart.reduce((s,x)=>s+x.qty,0)}</b></div><div class="total-row"><span>Subtotal</span><b>${money(subtotal)}</b></div><div class="total-row"><span>Platform fee</span><b>₹0</b></div><div class="total-row big"><span>Total</span><span>${money(subtotal)}</span></div><button class="btn" style="width:100%" onclick="placeOrder()">Place Bulk Order (Buyer Login Required)</button></div></div>`);
}
function cartQty(id,n){const x=cart.find(i=>i.id===id);x.qty=Math.max(10,x.qty+n);save();render()}
function removeCart(id){cart=cart.filter(i=>i.id!==id);save();render()}
function placeOrder(){
  if(!cart.length)return;
  if(!requireBuyer("#cart"))return;
  let total=cart.reduce((s,i)=>{const p=products.find(x=>x.id===i.id);return s+(p?p.price*i.qty:0)},0);
  let order={id:1024+orders.length,items:[...cart],total,status:"Pending",date:new Date().toLocaleDateString("en-IN"),buyer:currentUser.name,buyerEmail:currentUser.email};
  orders.unshift(order);
  cart=[];
  save();
  go("#order-success/"+order.id);
}

function orderSuccess(id){
const o=orders.find(x=>x.id===Number(id))||orders[0];return `<section class="page"><div class="card success"><div class="success-icon">✓</div><h2>Order Placed Successfully!</h2><p style="color:var(--muted)">Thank you for your order. The producer will confirm it soon.</p><h3>Order #${o.id}</h3><div class="card" style="max-width:500px;margin:20px auto;padding:18px;text-align:left">${o.items.map(i=>{const p=products.find(x=>x.id===i.id);return `<div class="total-row"><span>${p.name} × ${i.qty} ${p.unit}</span><b>${money(p.price*i.qty)}</b></div>`}).join("")}<div class="total-row big"><span>Total</span><b>${money(o.total)}</b></div><div class="total-row"><span>Status</span><span class="status pending">Pending</span></div></div><div class="actions" style="justify-content:center"><a class="btn" href="#buyer-dashboard">View Orders</a><a class="btn secondary" href="#products">Continue Shopping</a></div></div></section>`;
}

function dashboard(role){
  if(role!=="buyer") return producerDashboard();
  if(!isBuyer()){
    return layout("Buyer Login Required",`<div class="card empty"><h3>Please login as a Buyer to view your dashboard.</h3><a class="btn" href="#login">Login as Buyer</a></div>`);
  }

  const myOrders=orders.filter(o=>!o.buyerEmail || o.buyerEmail===currentUser.email);

  return layout("Buyer Dashboard",`
    <div class="section-head">
      <div><h2 style="margin:0">Welcome, ${currentUser.name}</h2><p>Browse products, place bulk orders and track deliveries.</p></div>
      <span class="user-pill">🏪 Buyer</span>
    </div>

    <div class="dashboard-grid">
      <div class="stat"><small>Total Orders</small><div class="num">${myOrders.length}</div></div>
      <div class="stat"><small>Pending</small><div class="num">${myOrders.filter(o=>o.status==="Pending").length}</div></div>
      <div class="stat"><small>Total Spent</small><div class="num">${money(myOrders.reduce((s,o)=>s+o.total,0))}</div></div>
      <div class="stat"><small>Cart Items</small><div class="num">${cart.reduce((s,x)=>s+x.qty,0)}</div></div>
    </div>

    <div class="actions">
      <a class="btn" href="#products">🛍 Browse Products</a>
      <a class="btn secondary" href="#cart">🛒 Open Cart</a>
    </div>

    <div class="card table-card" style="margin-top:22px">
      <div class="section-head"><div><h3 style="margin:0">My Orders</h3><p>Your recent purchases and delivery status.</p></div></div>
      <table class="table"><thead><tr><th>#</th><th>Product</th><th>Quantity</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>
        ${myOrders.length ? myOrders.slice(0,8).map(o=>{
          const p=products.find(x=>x.id===o.items[0].id)||defaultProducts.find(x=>x.id===o.items[0].id);
          return `<tr><td>#${o.id}</td><td>${p?p.name:"Product"}</td><td>${o.items[0].qty} ${p?p.unit:"unit"}</td><td><span class="status pending">${o.status}</span></td><td><a class="btn secondary" href="#tracking/${o.id}" style="padding:7px 10px">Track</a></td></tr>`;
        }).join("") : `<tr><td colspan="5" class="empty">No orders yet. Browse the marketplace to start buying.</td></tr>`}
      </tbody></table>
    </div>
  `);
}

function tracking(id){
const o=orders.find(x=>x.id===Number(id))||{id,items:[{id:1,qty:100}],total:5500};const p=products.find(x=>x.id===o.items[0].id);
return layout(`Order #${o.id}`,`<div class="card track"><div class="section-head"><div><h3 style="margin:0">${p.name} • ${o.items[0].qty} ${p.unit} • ${money(o.total)}</h3><p>Order placed on ${o.date||new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</p></div></div><div class="track-line">${["Order Placed","Confirmed","Packed","Shipped","Delivered"].map((s,i)=>`<div class="track-step ${i<3?"done":""}"><div class="dot">${i<3?"✓":""}</div><b>${s}</b><small>${i<3?["10 Oct, 10:00 AM","10 Oct, 2:00 PM","11 Oct, 9:00 AM"][i]:"—"}</small></div>`).join("")}</div><div class="card" style="padding:16px;background:#f3f8f4;text-align:center">🚚 Your order is being packed. You will be notified once it is shipped.</div></div>`);
}

function render(){
const hash=location.hash||"#home";let content;
if(hash==="#home")content=home();
else if(hash==="#register")content=register();
else if(hash==="#login")content=login();
else if(hash==="#products"||hash.startsWith("#products?"))content=productsPage();
else if(hash==="#auctions")content=auctionPage();
else if(hash.startsWith("#auction/"))content=auctionDetail(hash.split("/")[1]);
else if(hash.startsWith("#product/"))content=productDetail(hash.split("/")[1]);
else if(hash==="#cart")content=cartPage();
else if(hash.startsWith("#order-success/"))content=orderSuccess(hash.split("/")[1]);
else if(hash==="#buyer-dashboard")content=dashboard("buyer");
else if(hash==="#producer-dashboard")content=producerDashboard();
else if(hash.startsWith("#tracking/"))content=tracking(hash.split("/")[1]);
else content=home();
document.getElementById("app").innerHTML=content;updateNav();updateCartCount();window.scrollTo(0,0)
}
window.addEventListener("hashchange",render);window.addEventListener("load",render);
