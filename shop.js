const WILAYAS=[
["01","Adrar",700],["02","Chlef",500],["03","Laghouat",600],["04","Oum El Bouaghi",600],["05","Batna",500],["06","Béjaïa",400],["07","Biskra",600],["08","Béchar",700],["09","Blida",350],["10","Bouira",400],["11","Tamanrasset",900],["12","Tébessa",650],["13","Tlemcen",600],["14","Tiaret",550],["15","Tizi Ouzou",400],["16","Alger",300],["17","Djelfa",600],["18","Jijel",500],["19","Sétif",500],["20","Saïda",600],["21","Skikda",500],["22","Sidi Bel Abbès",550],["23","Annaba",550],["24","Guelma",550],["25","Constantine",500],["26","Médéa",400],["27","Mostaganem",550],["28","M'Sila",550],["29","Mascara",550],["30","Ouargla",650],["31","Oran",500],["32","El Bayadh",650],["33","Illizi",900],["34","Bordj Bou Arréridj",500],["35","Boumerdès",350],["36","El Tarf",600],["37","Tindouf",900],["38","Tissemsilt",550],["39","El Oued",650],["40","Khenchela",600],["41","Souk Ahras",600],["42","Tipaza",400],["43","Mila",500],["44","Aïn Defla",450],["45","Naâma",700],["46","Aïn Témouchent",550],["47","Ghardaïa",650],["48","Relizane",550],["49","Timimoun",800],["50","Bordj Badji Mokhtar",1000],["51","Ouled Djellal",650],["52","Béni Abbès",800],["53","In Salah",850],["54","In Guezzam",950],["55","Touggourt",650],["56","Djanet",950],["57","El M'Ghair",650],["58","El Meniaa",700]
];
const money=n=>new Intl.NumberFormat('fr-DZ').format(Number(n)||0)+" DA";
const getCart=()=>JSON.parse(localStorage.getItem('cart')||'[]');
const saveCart=c=>{localStorage.setItem('cart',JSON.stringify(c));updateCartBadge()};
function updateCartBadge(){const el=document.getElementById('cartBadge');if(el)el.textContent=getCart().reduce((s,x)=>s+x.qty,0)}
function toast(t){const x=document.createElement('div');x.className='toast';x.textContent=t;document.body.appendChild(x);setTimeout(()=>{x.remove()},2200)}
function escapeHtml(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
async function loadHomeProducts(){const {data,error}=await supabaseClient.from('products').select('*').eq('active',true).order('created_at',{ascending:false});const g=document.getElementById('productsGrid');if(error){g.innerHTML='<div class="empty">Impossible de charger les produits.</div>';return}if(!data?.length){g.innerHTML='<div class="empty">Aucun produit pour le moment.</div>';return}g.innerHTML=data.map((p,i)=>`<article class="product-card" style="animation-delay:${i*60}ms"><a href="product.html?id=${p.id}"><div class="product-image">${p.image_url?`<img src="${escapeHtml(p.image_url)}" alt="">`:''}</div><div class="product-info"><h3>${escapeHtml(p.name)}</h3><div class="price">${money(p.price)}</div><div class="muted">${escapeHtml((p.description||'').slice(0,70))}</div></div></a><div class="product-info"><button class="btn btn-primary" style="width:100%" onclick='addToCart(${JSON.stringify({id:p.id,name:p.name,price:p.price,image_url:p.image_url||''})})'>Ajouter au panier</button></div></article>`).join('');updateCartBadge()}
async function loadProductPage(){const id=new URLSearchParams(location.search).get('id');const box=document.getElementById('productBox');if(!id){box.innerHTML='<div class="empty">Produit introuvable.</div>';return}const {data:p,error}=await supabaseClient.from('products').select('*').eq('id',id).single();if(error||!p){box.innerHTML='<div class="empty">Produit introuvable.</div>';return}box.innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:center"><div class="product-image" style="border-radius:18px">${p.image_url?`<img src="${escapeHtml(p.image_url)}" alt="">`:''}</div><div><h1>${escapeHtml(p.name)}</h1><div class="price">${money(p.price)}</div><p class="muted">${escapeHtml(p.description||'')}</p><button class="btn btn-primary" onclick='addToCart(${JSON.stringify({id:p.id,name:p.name,price:p.price,image_url:p.image_url||''})})'>Ajouter au panier</button></div></div>`}
function addToCart(p){let c=getCart(),i=c.findIndex(x=>x.id===p.id);if(i>=0)c[i].qty++;else c.push({...p,qty:1});saveCart(c);toast('Produit ajouté au panier');}
function changeQty(id,d){let c=getCart(),i=c.findIndex(x=>x.id===id);if(i<0)return;c[i].qty+=d;if(c[i].qty<=0)c.splice(i,1);saveCart(c);renderCartPage()}
function removeCart(id){saveCart(getCart().filter(x=>x.id!==id));renderCartPage()}
function cartTotal(){return getCart().reduce((s,x)=>s+x.price*x.qty,0)}
function renderCartPage(){const b=document.getElementById('cartBox'),c=getCart();updateCartBadge();if(!c.length){b.innerHTML='<div class="card empty">Votre panier est vide.<br><br><a class="btn btn-primary" href="index.html">Voir les produits</a></div>';return}b.innerHTML=`<div class="card">${c.map(x=>`<div class="cart-row"><img src="${escapeHtml(x.image_url||'')}" alt=""><div><b>${escapeHtml(x.name)}</b><div class="muted">${money(x.price)} × ${x.qty}</div><div class="qty"><button onclick="changeQty('${x.id}',-1)">−</button><span>${x.qty}</span><button onclick="changeQty('${x.id}',1)">+</button></div></div><div><b>${money(x.price*x.qty)}</b><br><button class="btn btn-red" style="padding:7px 10px;margin-top:6px" onclick="removeCart('${x.id}')">Supprimer</button></div></div>`).join('')}<div style="text-align:right;margin-top:20px"><h3>Total produits : ${money(cartTotal())}</h3><a class="btn btn-primary" href="checkout.html">Passer la commande</a></div></div>`}
async function initCheckout(){
 updateCartBadge();
 const c=getCart(),s=document.getElementById('checkoutSummary'),w=document.getElementById('wilaya'),oldCommune=document.getElementById('commune'),form=document.getElementById('checkoutForm');
 if(!w||!oldCommune||!form)return;

 // Le HTML peut contenir un <input id="commune">.
 // On le remplace réellement par un <select>, car innerHTML ne transforme pas un input.
 let co=oldCommune;
 if(co.tagName.toLowerCase()!=='select'){
   const select=document.createElement('select');
   select.id='commune';
   select.name=co.name||'commune';
   select.required=co.required;
   select.className=co.className||'';
   select.innerHTML='<option value="">Choisir d’abord une wilaya</option>';
   co.replaceWith(select);
   co=select;
 }else{
   co.innerHTML='<option value="">Choisir d’abord une wilaya</option>';
 }

 w.innerHTML='<option value="">Chargement des wilayas...</option>';
 let communesByWilaya={};

 try{
   const response=await fetch('https://raw.githubusercontent.com/othmanus/algeria-cities/master/json/algeria_cities.json',{cache:'no-store'});
   if(!response.ok) throw new Error('HTTP '+response.status);
   const cities=await response.json();

   cities.forEach(city=>{
     const code=String(city.wilaya_code||city.wilaya_code_ascii||'').padStart(2,'0');
     const name=city.commune_name_ascii||city.commune_name||city.name;
     if(!code||!name)return;
     if(!communesByWilaya[code])communesByWilaya[code]=[];
     if(!communesByWilaya[code].includes(name))communesByWilaya[code].push(name);
   });

   Object.values(communesByWilaya).forEach(list=>list.sort((a,b)=>a.localeCompare(b,'fr')));
 }catch(err){
   console.error('Communes:',err);
   // Le menu reste un vrai SELECT même si la source distante échoue.
   co.innerHTML='<option value="">Impossible de charger les communes</option>';
 }

 w.innerHTML='<option value="">Choisir une wilaya</option>'+
   WILAYAS.map(x=>`<option value="${x[0]}">${x[0]} - ${x[1]} — ${money(x[2])}</option>`).join('');

 function loadCommunes(){
   const list=communesByWilaya[w.value]||[];
   if(!list.length){
     co.innerHTML='<option value="">Aucune commune disponible</option>';
     return;
   }
   co.innerHTML='<option value="">Choisir une commune</option>'+
     list.map(x=>`<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join('');
 }

 function summary(){
   const x=WILAYAS.find(v=>v[0]===w.value);
   const shipping=x?x[2]:0;
   s.innerHTML=`<div class="card"><b>Produits : ${money(cartTotal())}</b><br>Livraison : ${money(shipping)}<br><strong>Total : ${money(cartTotal()+shipping)}</strong></div>`;
 }

 w.onchange=()=>{loadCommunes();summary()};
 summary();

 form.onsubmit=async e=>{
   e.preventDefault();
   if(!c.length){alert('Panier vide');return}
   const x=WILAYAS.find(v=>v[0]===w.value);
   if(!x||!co.value){alert('Veuillez choisir une wilaya et une commune.');return}

   const customerName=document.getElementById('customer_name');
   const phoneEl=document.getElementById('phone');
   const addressEl=document.getElementById('address');
   const noteEl=document.getElementById('note');
   const shipping=x[2],total=cartTotal()+shipping;

   const payload={
     customer_name:customerName.value.trim(),
     phone:phoneEl.value.trim(),
     wilaya:w.value+' - '+x[1],
     commune:co.value,
     address:addressEl.value.trim(),
     note:noteEl?noteEl.value.trim():'',
     items:c,
     products_total:cartTotal(),
     shipping_fee:shipping,
     total,
     status:'new'
   };

   const {error}=await supabaseClient.from('orders').insert(payload);
   const m=document.getElementById('checkoutMessage');
   if(error){
     m.className='message error';
     m.textContent=error.message;
     return;
   }

   localStorage.removeItem('cart');
   m.className='message ok';
   m.innerHTML=`Commande enregistrée !<br>Votre commande a bien été enregistrée.`;
   form.reset();
   co.innerHTML='<option value="">Choisir d’abord une wilaya</option>';
   summary();
   updateCartBadge();
 };
}
async function loadMyOrders(){const phone=document.getElementById('profilePhone').value.trim(),b=document.getElementById('myOrders');if(!phone)return;b.innerHTML='<div class="card">Chargement...</div>';const {data,error}=await supabaseClient.from('orders').select('*').eq('phone',phone).order('created_at',{ascending:false});if(error){b.innerHTML='<div class="card message error">La consultation des commandes n’est pas ouverte au public par la sécurité de la base. Utilisez le numéro de commande avec le vendeur.</div>';return}if(!data.length){b.innerHTML='<div class="card empty">Aucune commande trouvée.</div>';return}b.innerHTML=data.map(o=>`<div class="card" style="margin-bottom:12px"><b>Commande ${o.id}</b><p>${new Date(o.created_at).toLocaleString('fr-DZ')}</p><span class="status status-${o.status}">${o.status}</span><h3>${money(o.total)}</h3><div>${escapeHtml(o.wilaya)} · ${escapeHtml(o.commune)}</div></div>`).join('')}
updateCartBadge();if(document.getElementById('productsGrid'))loadHomeProducts();if(document.getElementById('checkoutForm'))initCheckout();if(document.getElementById('cartBox'))renderCartPage();if(document.getElementById('productBox'))loadProductPage();
