const cardapio = document.getElementById("cardapio")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItems = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModal = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarm = document.getElementById("address-warn")

let cart = [];

// Abrir modal do carrinho
cartBtn.addEventListener("click", function(){
    cartModal.style.display = "flex"
    updateCartModal();
})

// Fecha modal quando clicar fora
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

closeModal.addEventListener("click", function(){
    cartModal.style.display = "none"
})

cardapio.addEventListener("click", function(event){
    let parentBtn = event.target.closest(".add-to-cart-btn")

    if(parentBtn){
        const name = parentBtn.getAttribute("data-name")
        const price = parseFloat(parentBtn.getAttribute("data-price"))
        addToCart(name,price)


    }
})

function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        existingItem.quantity += 1;
        
    }else{

        cart.push({
            name,
            price,
            quantity: 1,
        })

    }

    updateCartModal();
}

function updateCartModal(){
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemsElement = document.createElement("div");
        cartItemsElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemsElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>

                    <button class="remove-btn" data-name="${item.name}">
                        Remover
                    </button>
               
            </div>
        `       
        total += item.price * item.quantity;
        cartItems.appendChild(cartItemsElement);
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;

}

cartItems.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-btn" )){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);

    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -=1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarm.classList.add("hidden")
    }

})

checkoutBtn.addEventListener("click", function(){
    const isOpen = checkRestaurantOpen();
    if(!isOpen){
       Toastify({
        text: "Ops o restaurante está fechado!",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "#ef4444",
            },
       }).showToast();
        return;
    }


    if(cart.length === 0) return;
    if (addressInput.value === ""){
        addressWarm.classList.remove("hidden");
        addressInput.classList.add("border-red-500")
        return;
    }

    //Enviar pedido no whata
    const cartItems = cart.map((item) => {
        return (
           ` ${item.name} Quantidade: (${item.quantity}) Preço: R$: ${item.price} |` 
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "99999999999"
                
    window.open( ` https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank" );

    cart = [];
    updateCartModal();
    addressInput.value = "";

})

function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}