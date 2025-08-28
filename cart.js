// ===== CART COUNTER =====
const cartCount = document.querySelector('#cart-btn .count');
let cart = JSON.parse(localStorage.getItem('cart')) || [];
cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);



// ===== Toast Message Function =====
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "show";
  setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 2500);
}

// ===== ADD TO CART BUTTONS =====
const addToCartButtons = document.querySelectorAll('.showcase-actions .btn-action');
addToCartButtons.forEach(button => {
  const icon = button.querySelector('ion-icon');
  if (icon && icon.getAttribute('name') === 'bag-add-outline') {
    
    button.addEventListener('click', () => {
      const productTitle = button.closest('.showcase').querySelector('.showcase-title').innerText;
      const existingProduct = cart.find(item => item.name === productTitle);

      if (existingProduct) {
        let confirmAdd = confirm(`${productTitle} is already in the cart.\nDo you want to add more?`);
        if (confirmAdd) {
          existingProduct.qty += 1;
          showToast(`${productTitle} quantity increased in cart ✅`);
        } else {
          return;
        }
      } else {
        cart.push({ name: productTitle, qty: 1 });
        showToast(`${productTitle} added to cart 🛒`);
      }

      const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
      cartCount.textContent = totalQty;
      localStorage.setItem('cart', JSON.stringify(cart));
    });
  }
});
