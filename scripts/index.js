// Carrito
// Obtencion de contenedores y botones
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartBtn = document.querySelector("#cart-btn");
const cartContainer = document.querySelector("#cart");
const totalContainer = document.querySelector("#total");
const buyBtn = document.querySelector("#buy-btn");

// Escucha del click para abrir el carrito
cartBtn.addEventListener("click", () => {
  cartContainer.classList.toggle("active");
  cartBtn.classList.toggle("active");
});

// Escucha del click para comprar
buyBtn.addEventListener("click", () => {
  clearCart();
  Swal.fire({
    position: "center",
    icon: "success",
    title: "Purchase Made",
    showConfirmButton: false,
    timer: 1500,
  });
});

// Funcion para catualizar el precio total
const uploadTotal = () => {
  let total = 0;
  cart.forEach((product) => {
    total += product.price * product.quantity;
  });
  totalContainer.innerText = `$${total}`;
};

// Creacion de los items que hay en carrito
const cartList = document.querySelector("#cart-list");
// Funcion para actualizar el carrito
const uploadCart = () => {
  uploadTotal();
  cartList.innerHTML = "";
  // Si hay elementos se muestran
  if (cart.length > 0) {
    cart.map((prod) => {
      cartList.innerHTML += `
      <div class="cart-item">
        <img src="${prod.thumbnail}" />
        <h2>${prod.title} - $${prod.price}</h2>
        <span>Quantity: ${prod.quantity || 1}</span>
        <section>
          <button class="plus" data-product=${prod.id}>
            <i class="fa-solid fa-plus"></i>
          </button>
          <button class="substract" data-product=${prod.id}>
            <i class="fa-solid fa-minus"></i>
          </button>
        </section>
      </div>`;
    });
  }
  // Si no hay elementos se muestra que no hay
  else {
    cartList.innerHTML = `
      <div>
        <h1>There isn't any products</h1>
      </div>
    `;
  }
  // Obtencion de los botones para modificar las cantidades de los productos
  const plusBts = document.querySelectorAll(".plus");
  const substractBts = document.querySelectorAll(".substract");
  // Escuchas para los botones
  plusBts.forEach((btn) => {
    btn.addEventListener("click", () => {
      plus(btn.dataset.product);
    });
  });
  substractBts.forEach((btn) => {
    btn.addEventListener("click", () => {
      substract(btn.dataset.product);
    });
  });
};
uploadCart();

// Funcion para agregar items al carrito
const addToCart = (product) => {
  cart.push({ ...product[0], quantity: 1 });
  const newCart = JSON.stringify(cart);
  localStorage.setItem("cart", newCart);
  cart = JSON.parse(localStorage.getItem("cart"));
  // Se ponen los nuevos items en el carrito
  uploadCart();
  showProducts();
  Swal.fire({
    position: "top",
    icon: "info",
    title: "Product added",
    showConfirmButton: false,
    timer: 1000,
    width: "25%",
  });
};
// Funcion para aumentar la cantidad de un elemento en el carrito
const plus = (id) => {
  // obtencion del elemento
  const index = cart.findIndex((element) => element.id == id);
  cart[index].quantity++;
  localStorage.setItem("cart", JSON.stringify(cart));

  uploadCart();
};
// Funcion para disminuir la cantidad de un elemento en el carrito
const substract = (id) => {
  // obtencion del elemento
  const index = cart.findIndex((element) => element.id == id);
  const quantity = cart[index].quantity - 1;
  // Verificacion para saber si la cantidad es 0 y si lo es se elimina el elemento del carrito
  if (quantity < 1) {
    removeFromCart([cart[index]]);
    localStorage.setItem("cart", JSON.stringify(cart));
  } else {
    cart[index].quantity--;
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  uploadCart();
};
// Funcion para eliminar items del carrito
const removeFromCart = (product) => {
  const newCart = JSON.stringify(
    cart.filter((prd) => prd.id !== product[0].id)
  );
  localStorage.setItem("cart", newCart);
  cart = JSON.parse(localStorage.getItem("cart"));

  Swal.fire({
    title: "Are you sure about delete this product?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, i'm sure",
    cancelButtonText: "No, cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      // Se ponen los nuevos items en el carrito
      uploadCart();
      showProducts();
      Swal.fire({
        title: "Removed!",
        icon: "Success",
        text: "Product removed",
      });
    }
  });
};

// Funcion para limpiar el carrito
const clearCart = () => {
  const newCart = [];
  localStorage.setItem("cart", JSON.stringify(newCart));
  cart = JSON.parse(localStorage.getItem("cart"));
  uploadCart();
};

// configuracion para la seccion con scroll horizontal
const stickySections = [...document.querySelectorAll(".sticky")];

window.addEventListener("scroll", (e) => {
  for (let i = 0; i < stickySections.length; i++) {
    transform(stickySections[i]);
  }
});

function transform(section) {
  const offSetTop = section.parentElement.offsetTop;
  const scrollSection = section.querySelector(".scroll_section");

  let percentage = ((window.scrollY - offSetTop) / window.innerHeight) * 100;
  percentage = percentage < 0 ? 0 : percentage > 400 ? 400 : percentage;
  scrollSection.style.transform = `translate3d(${-percentage}svw, 0, 0)`;
}

// observer para animacion de las imagenes de la seccion pegada
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.25 }
);

const sections = document.querySelectorAll(".section");

sections.forEach((section) => observer.observe(section));

// creacion de lista de productos
let filters = {
  search: "",
  category: "all",
  minPrice: 0,
};

// Funcion para actualizar los productos
const showProducts = () => {
  const filePath = "./mocks/products.json";
  fetch(filePath)
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((jsonData) => {
      // creacion de los productos en el html
      createProducts(jsonData.products);
    })
    .catch((error) => console.error("Error fetching JSON file:", error));
};
showProducts();

// Creacion de la lista productos
const productContainer = document.getElementById("product-container");
const $search = document.querySelector("#search");
const $minPrice = document.querySelector("#minPrice");
const $category = document.querySelector("#category");
// Filtros
const filtersArray = [$search, $minPrice, $category];
const minPriceValue = document.querySelector("#minPriceValue");
minPriceValue.innerText = `$${$minPrice.value}`;

filtersArray.forEach((filter) => {
  // Esucha de evento change para actualizar los filtros
  filter.addEventListener("change", () => {
    minPriceValue.innerText = `$${$minPrice.value}`;
    filters = {
      search: $search.value,
      minPrice: $minPrice.value,
      category: $category.value,
    };
    showProducts();
    console.log(filters);
  });
});

// Funcion para crear y filtrar los productos
function createProducts(productList) {
  if (productContainer.firstChild)
    productContainer.removeChild(productContainer.firstChild);

  const list = document.createElement("div");

  // filtrado de productos
  const filteredProducts = productList.filter(
    (product) =>
      (filters.category !== "all"
        ? product.category === filters.category
        : product) &&
      (filters.search !== ""
        ? product.title.toLowerCase().includes(filters.search.toLowerCase())
        : product) &&
      product.price > filters.minPrice
  );

  filteredProducts.forEach((product) => {
    list.innerHTML += `
      <div>
        <img src="${product.thumbnail}" />
        <h2>${product.title}</h2>
        <span>Stock: ${product.stock} - $${product.price}</span>
        <button class="add ${
          cart.some((item) => item.id === product.id) ? "on-cart" : ""
        }" data-product=${product.id}>
          <i class="fa-solid fa-${
            cart.some((item) => item.id === product.id) ? "trash" : "cart-plus"
          }"></i>
        </button>
      </div>`;
  });
  list.classList.add("list");

  productContainer.appendChild(list);

  // Escucha de los clicks en los botones para saber cambiar las clases y agregar o remover productos del carrito
  const addBtns = document.querySelectorAll(".add");
  addBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const productToAdd = filteredProducts.filter(
        (prod) => prod.id == btn.dataset.product
      );
      const productToRemove = filteredProducts.filter(
        (prod) => prod.id == btn.dataset.product
      );
      if (cart.some((item) => item.id == btn.dataset.product)) {
        btn.classList.toggle("on-cart");
        removeFromCart(productToRemove);
      } else {
        btn.classList.toggle("on-cart");
        addToCart(productToAdd);
      }
    });
  });
}
