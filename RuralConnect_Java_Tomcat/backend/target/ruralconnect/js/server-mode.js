// RuralConnect Java backend bridge
// The existing demo remains usable, while the marketplace can read products from the Java API.
async function loadProductsFromJavaBackend(){
  try{
    const response=await fetch('api/products');
    if(!response.ok) throw new Error('API '+response.status);
    const serverProducts=await response.json();
    if(Array.isArray(serverProducts) && serverProducts.length){
      window.rcServerProducts=serverProducts;
      if(typeof products!=='undefined'){
        products=serverProducts.map(p=>({id:p.id,name:p.name,price:p.price,unit:p.unit,stock:p.stock,category:p.category,emoji:p.emoji,desc:p.desc,producer:p.producer,location:p.location}));
        if(typeof render==='function') render();
      }
    }
  }catch(error){
    console.log('Java backend not connected yet; using demo data.',error);
  }
}
window.addEventListener('load',loadProductsFromJavaBackend);
