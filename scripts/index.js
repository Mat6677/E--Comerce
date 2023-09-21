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

// obtencion de productos
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

const productContainer = document.getElementById("product-container");
const $search = document.querySelector("#search");
const $minPrice = document.querySelector("#minPrice");
const $category = document.querySelector("#category");
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
    fetch(filePath)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((jsonData) => {
        createProducts(jsonData.products);
      })
      .catch((error) => console.error("Error fetching JSON file:", error));
    console.log(filters);
  });
});

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
    list.innerHTML += `<div>
        <img src="${product.thumbnail}" />
        <h2>${product.title}</h2>
        <span>Stock: ${product.stock} - $${product.price}</span>
    </div>`;
  });
  list.classList.add("list");

  productContainer.appendChild(list);
}
