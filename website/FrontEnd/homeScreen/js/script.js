(function ($) {
  "use strict";

  var searchPopup = function () {
    // open search box
    $("#header-nav").on("click", ".search-button", function (e) {
      $(".search-popup").toggleClass("is-visible");
    });

    $("#header-nav").on("click", ".btn-close-search", function (e) {
      $(".search-popup").toggleClass("is-visible");
    });

    $(".search-popup-trigger").on("click", function (b) {
      b.preventDefault();
      $(".search-popup").addClass("is-visible"),
        setTimeout(function () {
          $(".search-popup").find("#search-popup").focus();
        }, 350);
    }),
      $(".search-popup").on("click", function (b) {
        ($(b.target).is(".search-popup-close") ||
          $(b.target).is(".search-popup-close svg") ||
          $(b.target).is(".search-popup-close path") ||
          $(b.target).is(".search-popup")) &&
          (b.preventDefault(), $(this).removeClass("is-visible"));
      }),
      $(document).keyup(function (b) {
        "27" === b.which && $(".search-popup").removeClass("is-visible");
      });
  };
  document
    .querySelector(".search-field")
    .addEventListener("input", function () {
      const value = this.value;

      // Do something with the value
      console.log("User typed:", value);
    });

  var initProductQty = function () {
    $(".product-qty").each(function () {
      var $el_product = $(this);
      var quantity = 0;

      $el_product.find(".quantity-right-plus").click(function (e) {
        e.preventDefault();
        var quantity = parseInt($el_product.find("#quantity").val());
        $el_product.find("#quantity").val(quantity + 1);
      });

      $el_product.find(".quantity-left-minus").click(function (e) {
        e.preventDefault();
        var quantity = parseInt($el_product.find("#quantity").val());
        if (quantity > 0) {
          $el_product.find("#quantity").val(quantity - 1);
        }
      });
    });
  };

  $(document).ready(function () {
    searchPopup();
    initProductQty();

    var swiper = new Swiper(".main-swiper", {
      speed: 500,
      navigation: {
        nextEl: ".swiper-arrow-prev",
        prevEl: ".swiper-arrow-next",
      },
    });

    var swiper = new Swiper(".product-swiper", {
      slidesPerView: 4,
      spaceBetween: 10,
      pagination: {
        el: "#mobile-products .swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        0: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        980: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
      },
    });
    var swiper = new Swiper(".Bracelet", {
      slidesPerView: 4,
      spaceBetween: 10,
      pagination: {
        el: "#Bracelet-products .swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        0: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        980: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
      },
    });

    var swiper = new Swiper(".Earrings", {
      slidesPerView: 4,
      spaceBetween: 10,
      pagination: {
        el: "#Earrings-product .swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        0: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        980: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
      },
    });
    var swiper = new Swiper(".product-watch-swiper", {
      slidesPerView: 4,
      spaceBetween: 10,
      pagination: {
        el: "#smart-watches .swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        0: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        980: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
      },
    });

    var swiper = new Swiper(".testimonial-swiper", {
      loop: true,
      navigation: {
        nextEl: ".swiper-arrow-prev",
        prevEl: ".swiper-arrow-next",
      },
    });
  }); // End of a document ready
})(jQuery);
async function returnQuantity(product_id) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/Home/Quantity`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ product_id }),
    });

    if (response.ok) {
      Quantity = await response.json();
      return Quantity[0];
    } else {
      console.log("Error in response!");
    }
  } catch (error) {
    console.log("Fetch error:", error);
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////
// This to add new product to the list
async function addProductToSwiper(product) {
  const swiperWrapper = document.querySelector(
    ".product-swiper .swiper-wrapper"
  );

  const slide = document.createElement("div");
  slide.classList.add("swiper-slide");
  slide.innerHTML = `
  <div class="card-rotate">
  <a href="#">
    <div class="product-card ${product.quantity === 0 ? "out-of-stock" : ""}">
      <!-- Front Side -->
      <div class="card-face card-front">
        <div class="image-holder">
          <img src="${product.image_path}" alt="${
    product.product_name
  }" class="img-fluid" />
          <span class="card-title text-uppercase image-change">${
            product.quantity
          }</span>
        </div>
        <div class="card-detail d-flex justify-content-between align-items-baseline pt-3">
          <h3 class="card-title text-uppercase">${product.product_name}</h3>
          <span class="item-price text-primary">$${product.total_price}</span>
        </div>
      </div>

      <!-- Back Side -->
      <div class="card-face card-back">
        <div class="p-3 text-start">
          <h5>Details</h5>
          <p><strong>Product Name:</strong> ${product.product_name}</p>
          <p><strong>Price:</strong> $${product.total_price}</p>
          <p><strong>Description:</strong> Kerat: ${
            product.kerat
          }, Factor Type: ${product.main_factor_type}, Weight: ${
    product.weight
  }, Price/G: ${product.price_per_gram}</p>
        </div>
      </div>
    </div>
  </a>

  <!-- Add to Cart Button -->
  ${
    product.quantity > 0
      ? `
  <a href="#" class="btn btn-medium btn-black add-to-cart" data-id="${product.product_id}">
    Add to Cart
    <svg class="cart-outline">
      <use xlink:href="#cart-outline"></use>
    </svg>
  </a>
`
      : ""
  }

  
</div>


  `;
  swiperWrapper.appendChild(slide);
  if (product.quantity == 0) {
    document.querySelector(".add-to-cart").disabled = true;
  }
  const cartButton = slide.querySelector(".add-to-cart");
  if (cartButton) {
    cartButton.addEventListener("click", async function (event) {
      event.preventDefault();
      const product_id = cartButton.getAttribute("data-id");
      const acc_id = getCookie("acc_id");
      if (acc_id) {
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/Home/add-to-cart`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ product_id, acc_id }),
            }
          );

          if (response.ok) {
            console.log(await response.json());
          } else {
            console.log("Error in response!");
          }
        } catch (error) {
          console.log("Fetch error:", error);
        }
      } else {
        console.log("User is not logged in. Redirecting to login page...");
        window.location.href = "../login/login.html";
      }
    });
  }

  if (typeof swiper !== "undefined") {
    swiper.update();
  }
}

async function return_products(product_type) {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/Products/${product_type}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const rawData = await response.json();

    if (response.ok) {
      const keys = [
        "product_id",
        "product_name",
        "product_type",
        "kerat",
        "main_factor_type",
        "weight",
        "price_per_gram",
        "product_discount",
        "total_price",
        "labour_cost",
        "image_id",
        "image_product_id",
        "image_path",
        "storage_id",
        "storage_product_id",
        "quantity",
      ];

      const products = rawData.map((item) => {
        let product = {};
        keys.forEach((key, index) => {
          product[key] = item[index];
        });
        return product;
      });
      return products;
    } else {
      console.log("Error in response!");
      return [];
    }
  } catch (error) {
    console.log("Fetch error:", error);
    return [];
  }
}
async function loadProducts(product_type) {
  const products = await return_products(product_type);
  document
    .querySelector(".rings-products")
    .addEventListener("click", async function (event) {
      event.preventDefault();
      body_divi = document.querySelector(".body-div");
      body_divi.className = "body-div";
      if (body_divi) {
        body_divi.innerHTML = "";
        if (products == 404) {
          body_divi.innerHTML = `<h1 class="card-title text-uppercase shadowed-h">
          No Products Found
        </h1>`;
        } else {
          products.forEach((product) => {
            console.log(product.image_path);
            body_divi.innerHTML += `
       <div class="card-rotate">
  <a href="#">
    <div class="product-card ${product.quantity === 0 ? "out-of-stock" : ""}">
      <!-- Front Side -->
      <div class="card-face card-front">
        <div class="image-holder">
          <img src="${product.image_path}" alt="${
              product.product_name
            }" class="img-fluid" />
          <span class="card-title-right text-uppercase image-change">${
            product.quantity
          }</span>
          <span class="card-title text-uppercase image-change">%${
            product.product_discount * 100
          }</span>
        </div>
        <div class="card-detail d-flex justify-content-between align-items-baseline pt-3">
          <h3 class="card-title text-uppercase">
            <a href="#">${product.product_name}</a>
          </h3>
          <span class="item-price text-primary">$${product.total_price}</span>
        </div>
      </div>

      <!-- Back Side -->
      <div class="card-face card-back">
        <div class="p-3">
          <h3>Details</h3>
          <p>Product Name: ${product.product_name}</p>
          <p>Price: $${product.total_price}</p>
          <p>Description: Kerat: ${product.kerat}, Factor Type: ${
              product.main_factor_type
            }, Weight: ${product.weight}, Price/G: ${product.price_per_gram}</p>
        </div>
      </div>
    </div>
  </a>

  <!-- Add to Cart Button -->
  ${
    product.quantity > 0
      ? `
    <a href="#" class="btn btn-medium btn-black add-to-cart" data-id="${product.product_id}">
      Add to Cart
      <svg class="cart-outline">
        <use xlink:href="#cart-outline"></use>
      </svg>
    </a>
  `
      : ""
  }
  
</div>

      `;
          });
        }
        body_divi.classList.add("bodyDiv");
      }
      const cartButtons = document.querySelectorAll(".add-to-cart");

      cartButtons.forEach((cartButton) => {
        cartButton.addEventListener("click", async function (event) {
          event.preventDefault();

          const product_id = cartButton.getAttribute("data-id");
          const acc_id = getCookie("acc_id");

          if (acc_id) {
            try {
              const response = await fetch(
                `http://127.0.0.1:8000/Home/add-to-cart`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify({ product_id, acc_id }),
                }
              );

              if (response.ok) {
                console.log(await response.json());
              } else {
                console.log("Error in response!");
              }
            } catch (error) {
              console.log("Fetch error:", error);
            }
          } else {
            console.log("User is not logged in. Redirecting to login page...");
            window.location.href = "../login/login.html";
          }
        });
      });
    });
  products.forEach((product) => {
    addProductToSwiper(product);
  });
}

loadProducts("ring");

///////////////////////////////////////////////Necklace/////////////////////////////////////////////////////
function addProductToSwiperNecklace(product) {
  const swiperWrapper = document.querySelector(
    ".product-watch-swiper .swiper-wrapper"
  );

  const slide = document.createElement("div");
  slide.classList.add("swiper-slide");
  slide.innerHTML = `
   <div class="card-rotate">
  <a href="#">
    <div class="product-card ${product.quantity === 0 ? "out-of-stock" : ""}">
      <!-- Front Side -->
      <div class="card-face card-front">
        <div class="image-holder">
          <img src="${product.image_path}" alt="${
    product.product_name
  }" class="img-fluid" />
          <span class="card-title text-uppercase image-change">${
            product.quantity
          }</span>
        </div>
        <div class="card-detail d-flex justify-content-between align-items-baseline pt-3">
          <h3 class="card-title text-uppercase">
            <a href="#">${product.product_name}</a>
          </h3>
          <span class="item-price text-primary">$${product.total_price}</span>
        </div>
      </div>

      <!-- Back Side -->
      <div class="card-face card-back">
        <div class="p-3">
          <h3>Details</h3>
          <p>Product Name: ${product.product_name}</p>
          <p>Price: $${product.total_price}</p>
          <p>Description: Kerat: ${product.kerat}, Factor Type: ${
    product.main_factor_type
  }, Weight: ${product.weight}, Price/G: ${product.price_per_gram}</p>
        </div>
      </div>
    </div>
  </a>

  <!-- Add to Cart Button -->
  ${
    product.quantity > 0
      ? `
  <a href="#" class="btn btn-medium btn-black add-to-cart" data-id="${product.product_id}">
    Add to Cart
    <svg class="cart-outline">
      <use xlink:href="#cart-outline"></use>
    </svg>
  </a>
`
      : ""
  }

</div>



  `;
  if (product.quantity == 0) {
    document.querySelector(".add-to-cart").disabled = true;
  }
  swiperWrapper.appendChild(slide);

  const cartButton = slide.querySelector(".add-to-cart");
  if (cartButton) {
    cartButton.addEventListener("click", async function (event) {
      event.preventDefault();
      const product_id = cartButton.getAttribute("data-id");
      const acc_id = getCookie("acc_id");
      if (acc_id) {
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/Home/add-to-cart`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ product_id, acc_id }),
            }
          );

          if (response.ok) {
            console.log(await response.json());
          } else {
            console.log("Error in response!");
          }
        } catch (error) {
          console.log("Fetch error:", error);
        }
      } else {
        console.log("User is not logged in. Redirecting to login page...");
        window.location.href = "../login/login.html";
      }
    });
  }

  if (typeof swiper !== "undefined") {
    swiper.update();
  }
}
async function loadProductsNecklace(
  product_type1,
  product_type2,
  product_type3
) {
  const products1 = await return_products(product_type1);
  const products2 = await return_products(product_type2);
  const products3 = await return_products(product_type3);
  document
    .querySelector(".necklace-chain-products")
    .addEventListener("click", async function (event) {
      event.preventDefault();
      body_divi = document.querySelector(".body-div");
      body_divi.className = "body-div";
      if (body_divi) {
        body_divi.innerHTML = "";
        if (products1 == 404) {
          body_divi.innerHTML = `<h1 class="card-title text-uppercase shadowed-h">
          No Products Found
        </h1>`;
        } else {
          products1.forEach((product) => {
            console.log(product.image_path);
            body_divi.innerHTML += `
       <div class="card-rotate">
  <a href="#">
    <div class="product-card ${product.quantity === 0 ? "out-of-stock" : ""}">
      <!-- Front Side -->
      <div class="card-face card-front">
        <div class="image-holder">
          <img src="${product.image_path}" alt="${
              product.product_name
            }" class="img-fluid" />
          <span class="card-title-right text-uppercase image-change">${
            product.quantity
          }</span>
          <span class="card-title text-uppercase image-change">%${
            product.product_discount * 100
          }</span>
        </div>
        <div class="card-detail d-flex justify-content-between align-items-baseline pt-3">
          <h3 class="card-title text-uppercase">
            <a href="#">${product.product_name}</a>
          </h3>
          <span class="item-price text-primary">$${product.total_price}</span>
        </div>
      </div>

      <!-- Back Side -->
      <div class="card-face card-back">
        <div class="p-3">
          <h3>Details</h3>
          <p>Product Name: ${product.product_name}</p>
          <p>Price: $${product.total_price}</p>
          <p>Description: Kerat: ${product.kerat}, Factor Type: ${
              product.main_factor_type
            }, Weight: ${product.weight}, Price/G: ${product.price_per_gram}</p>
        </div>
      </div>
    </div>
  </a>

  <!-- Add to Cart Button -->
  ${
    product.quantity > 0
      ? `
    <a href="#" class="btn btn-medium btn-black add-to-cart" data-id="${product.product_id}">
      Add to Cart
      <svg class="cart-outline">
        <use xlink:href="#cart-outline"></use>
      </svg>
    </a>
  `
      : ""
  }
  
</div>

      `;
          });
          products2.forEach((product) => {
            console.log(product.image_path);
            body_divi.innerHTML += `
       <div class="card-rotate">
  <a href="#">
    <div class="product-card ${product.quantity === 0 ? "out-of-stock" : ""}">
      <!-- Front Side -->
      <div class="card-face card-front">
        <div class="image-holder">
          <img src="${product.image_path}" alt="${
              product.product_name
            }" class="img-fluid" />
          <span class="card-title-right text-uppercase image-change">${
            product.quantity
          }</span>
          <span class="card-title text-uppercase image-change">%${
            product.product_discount * 100
          }</span>
        </div>
        <div class="card-detail d-flex justify-content-between align-items-baseline pt-3">
          <h3 class="card-title text-uppercase">
            <a href="#">${product.product_name}</a>
          </h3>
          <span class="item-price text-primary">$${product.total_price}</span>
        </div>
      </div>

      <!-- Back Side -->
      <div class="card-face card-back">
        <div class="p-3">
          <h3>Details</h3>
          <p>Product Name: ${product.product_name}</p>
          <p>Price: $${product.total_price}</p>
          <p>Description: Kerat: ${product.kerat}, Factor Type: ${
              product.main_factor_type
            }, Weight: ${product.weight}, Price/G: ${product.price_per_gram}</p>
        </div>
      </div>
    </div>
  </a>

  <!-- Add to Cart Button -->
  ${
    product.quantity > 0
      ? `
  <a href="#" class="btn btn-medium btn-black add-to-cart" data-id="${product.product_id}">
    Add to Cart
    <svg class="cart-outline">
      <use xlink:href="#cart-outline"></use>
    </svg>
  </a>
`
      : ""
  }

</div>

      `;
          });
          products3.forEach((product) => {
            console.log(product.image_path);
            body_divi.innerHTML += `
       <div class="card-rotate">
  <a href="#">
    <div class="product-card ${product.quantity === 0 ? "out-of-stock" : ""}">
      <!-- Front Side -->
      <div class="card-face card-front">
        <div class="image-holder">
          <img src="${product.image_path}" alt="${
              product.product_name
            }" class="img-fluid" />
          <span class="card-title-right text-uppercase image-change">${
            product.quantity
          }</span>
          <span class="card-title text-uppercase image-change">%${
            product.product_discount * 100
          }</span>
        </div>
        <div class="card-detail d-flex justify-content-between align-items-baseline pt-3">
          <h3 class="card-title text-uppercase">
            <a href="#">${product.product_name}</a>
          </h3>
          <span class="item-price text-primary">$${product.total_price}</span>
        </div>
      </div>

      <!-- Back Side -->
      <div class="card-face card-back">
        <div class="p-3">
          <h3>Details</h3>
          <p>Product Name: ${product.product_name}</p>
          <p>Price: $${product.total_price}</p>
          <p>Description: Kerat: ${product.kerat}, Factor Type: ${
              product.main_factor_type
            }, Weight: ${product.weight}, Price/G: ${product.price_per_gram}</p>
        </div>
      </div>
    </div>
  </a>

  <!-- Add to Cart Button -->
  ${
    product.quantity > 0
      ? `
  <a href="#" class="btn btn-medium btn-black add-to-cart" data-id="${product.product_id}">
    Add to Cart
    <svg class="cart-outline">
      <use xlink:href="#cart-outline"></use>
    </svg>
  </a>
`
      : ""
  }
</div>

      `;
          });
        }
        body_divi.classList.add("bodyDiv");
      }
      const cartButtons = document.querySelectorAll(".add-to-cart");

      cartButtons.forEach((cartButton) => {
        cartButton.addEventListener("click", async function (event) {
          event.preventDefault();

          const product_id = cartButton.getAttribute("data-id");
          const acc_id = getCookie("acc_id");

          if (acc_id) {
            try {
              const response = await fetch(
                `http://127.0.0.1:8000/Home/add-to-cart`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify({ product_id, acc_id }),
                }
              );

              if (response.ok) {
                console.log(await response.json());
              } else {
                console.log("Error in response!");
              }
            } catch (error) {
              console.log("Fetch error:", error);
            }
          } else {
            console.log("User is not logged in. Redirecting to login page...");
            window.location.href = "../login/login.html";
          }
        });
      });
    });

  products1.forEach((product) => {
    addProductToSwiperNecklace(product);
    console.log(product);
  });
  products2.forEach((product) => {
    addProductToSwiperNecklace(product);
  });
  products3.forEach((product) => {
    addProductToSwiperNecklace(product);
  });
}

loadProductsNecklace("Necklace", "Chain", "Pendant");
//////////////////////////////////////Earrings////////////////////////////////////////////
function addProductToSwiperEarrings(product) {
  const swiperWrapper = document.querySelector(".Earrings .swiper-wrapper");

  const slide = document.createElement("div");
  slide.classList.add("swiper-slide");

  slide.innerHTML = `
   <div class="card-rotate">
  <a href="#">
    <div class="product-card ${product.quantity === 0 ? "out-of-stock" : ""}">
      <!-- Front Side -->
      <div class="card-face card-front">
        <div class="image-holder">
          <img src="${product.image_path}" alt="${
    product.product_name
  }" class="img-fluid" />
          <span class="card-title text-uppercase image-change">${
            product.quantity
          }</span>
        </div>
        <div class="card-detail d-flex justify-content-between align-items-baseline pt-3">
          <h3 class="card-title text-uppercase">
            ${product.product_name}
          </h3>
          <span class="item-price text-primary">$${product.total_price}</span>
        </div>
      </div>

      <!-- Back Side -->
      <div class="card-face card-back">
        <div class="p-3">
          <h3>Details</h3>
          <p>Product Name: ${product.product_name}</p>
          <p>Price: $${product.total_price}</p>
          <p>Description: Kerat: ${product.kerat}, Factor Type: ${
    product.main_factor_type
  }, Weight: ${product.weight}, Price/G: ${product.price_per_gram}</p>
        </div>
      </div>
    </div>
  </a>

  <!-- Add to Cart Button (outside flipping area) -->
  ${
    product.quantity > 0
      ? `
  <a href="#" class="btn btn-medium btn-black add-to-cart" data-id="${product.product_id}">
    Add to Cart
    <svg class="cart-outline">
      <use xlink:href="#cart-outline"></use>
    </svg>
  </a>
`
      : ""
  }
</div>

  `;
  if (product.quantity == 0) {
    document.querySelector(".add-to-cart").disabled = true;
  }
  swiperWrapper.appendChild(slide);

  const cartButton = slide.querySelector(".add-to-cart");
  if (cartButton) {
    cartButton.addEventListener("click", async function (event) {
      event.preventDefault();
      const product_id = cartButton.getAttribute("data-id");
      const acc_id = getCookie("acc_id");
      if (acc_id) {
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/Home/add-to-cart`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ product_id, acc_id }),
            }
          );

          if (response.ok) {
            console.log(await response.json());
          } else {
            console.log("Error in response!");
          }
        } catch (error) {
          console.log("Fetch error:", error);
        }
      } else {
        console.log("User is not logged in. Redirecting to login page...");
        window.location.href = "../login/login.html";
      }
    });
  }

  if (typeof swiper !== "undefined") {
    swiper.update();
  }
}
async function loadProductsEarrings(product_type1) {
  const products10 = await return_products(product_type1);
  document
    .querySelector(".Earrings-products")
    .addEventListener("click", async function (event) {
      event.preventDefault();
      body_divi = document.querySelector(".body-div");
      body_divi.className = "body-div";
      if (body_divi) {
        body_divi.innerHTML = "";
        if (products == 404) {
          body_divi.innerHTML = `<h1 class="card-title text-uppercase shadowed-h">
          No Products Found
        </h1>`;
        } else {
          products10.forEach((product) => {
            console.log(product.image_path);
            body_divi.innerHTML += `
       <div class="card-rotate">
  <a href="#">
    <div class="product-card ${product.quantity === 0 ? "out-of-stock" : ""}">
      <!-- Front Side -->
      <div class="card-face card-front">
        <div class="image-holder">
          <img src="${product.image_path}" alt="${
              product.product_name
            }" class="img-fluid" />
          <span class="card-title-right text-uppercase image-change">${
            product.quantity
          }</span>
          <span class="card-title text-uppercase image-change">%${
            product.product_discount * 100
          }</span>
        </div>
        <div class="card-detail d-flex justify-content-between align-items-baseline pt-3">
          <h3 class="card-title text-uppercase">
            <a href="#">${product.product_name}</a>
          </h3>
          <span class="item-price text-primary">$${product.total_price}</span>
        </div>
      </div>

      <!-- Back Side -->
      <div class="card-face card-back">
        <div class="p-3">
          <h3>Details</h3>
          <p>Product Name: ${product.product_name}</p>
          <p>Price: $${product.total_price}</p>
          <p>Description: Kerat: ${product.kerat}, Factor Type: ${
              product.main_factor_type
            }, Weight: ${product.weight}, Price/G: ${product.price_per_gram}</p>
        </div>
      </div>
    </div>
  </a>

  <!-- Add to Cart Button -->
  ${
    product.quantity > 0
      ? `
  <a href="#" class="btn btn-medium btn-black add-to-cart" data-id="${product.product_id}">
    Add to Cart
    <svg class="cart-outline">
      <use xlink:href="#cart-outline"></use>
    </svg>
  </a>
`
      : ""
  }
</div>

      `;
          });
        }
        body_divi.classList.add("bodyDiv");
      }
      const cartButtons = document.querySelectorAll(".add-to-cart");

      cartButtons.forEach((cartButton) => {
        cartButton.addEventListener("click", async function (event) {
          event.preventDefault();

          const product_id = cartButton.getAttribute("data-id");
          const acc_id = getCookie("acc_id");

          if (acc_id) {
            try {
              const response = await fetch(
                `http://127.0.0.1:8000/Home/add-to-cart`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify({ product_id, acc_id }),
                }
              );

              if (response.ok) {
                console.log(await response.json());
              } else {
                console.log("Error in response!");
              }
            } catch (error) {
              console.log("Fetch error:", error);
            }
          } else {
            console.log("User is not logged in. Redirecting to login page...");
            window.location.href = "../login/login.html";
          }
        });
      });
    });
  products10.forEach((product) => {
    addProductToSwiperEarrings(product);
  });
}

loadProductsEarrings("Earrings");
///////////////////////////////////////Bracelet////////////////////////////////////////////
function addProductToSwiperBracelet(product) {
  const swiperWrapper = document.querySelector(".Bracelet .swiper-wrapper");

  const slide = document.createElement("div");
  slide.classList.add("swiper-slide");

  slide.innerHTML = `
    <div class="card-rotate">
  <a href="#">
    <div class="product-card ${product.quantity === 0 ? "out-of-stock" : ""}">
      <!-- Front Side -->
      <div class="card-face card-front">
        <div class="image-holder">
          <img src="${product.image_path}" alt="${
    product.product_name
  }" class="img-fluid" />
          <span class="card-title text-uppercase image-change">${
            product.quantity
          }</span>
        </div>
        <div class="card-detail d-flex justify-content-between align-items-baseline pt-3">
          <h3 class="card-title text-uppercase">
            ${product.product_name}
          </h3>
          <span class="item-price text-primary">$${product.total_price}</span>
        </div>
      </div>

      <!-- Back Side -->
      <div class="card-face card-back">
        <div class="p-3">
          <h3>Details</h3>
          <p>Product Name: ${product.product_name}</p>
          <p>Price: $${product.total_price}</p>
          <p>Description: Kerat: ${product.kerat}, Factor Type: ${
    product.main_factor_type
  }, Weight: ${product.weight}, Price/G: ${product.price_per_gram}</p>
        </div>
      </div>
    </div>
  </a>

  <!-- Add to Cart Button -->
  ${
    product.quantity > 0
      ? `
  <a href="#" class="btn btn-medium btn-black add-to-cart" data-id="${product.product_id}">
    Add to Cart
    <svg class="cart-outline">
      <use xlink:href="#cart-outline"></use>
    </svg>
  </a>
`
      : ""
  }

</div>


  `;
  if (product.quantity == 0) {
    document.querySelector(".add-to-cart").disabled = true;
  }
  swiperWrapper.appendChild(slide);

  const cartButton = slide.querySelector(".add-to-cart");
  if (cartButton) {
    cartButton.addEventListener("click", async function (event) {
      event.preventDefault();
      const product_id = cartButton.getAttribute("data-id");
      const acc_id = getCookie("acc_id");
      if (acc_id) {
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/Home/add-to-cart`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ product_id, acc_id }),
            }
          );

          if (response.ok) {
            console.log(await response.json());
          } else {
            console.log("Error in response!");
          }
        } catch (error) {
          console.log("Fetch error:", error);
        }
      } else {
        console.log("User is not logged in. Redirecting to login page...");
        window.location.href = "../login/login.html";
      }
    });
  }
  if (typeof swiper !== "undefined") {
    swiper.update();
  }
}
async function loadProductsBracelet(product_type1) {
  const products1 = await return_products(product_type1);
  document
    .querySelector(".Bracelet-products")
    .addEventListener("click", async function (event) {
      event.preventDefault();
      body_divi = document.querySelector(".body-div");
      body_divi.className = "body-div";
      if (body_divi) {
        body_divi.innerHTML = "";
        if (products == 404) {
          body_divi.innerHTML = `<h1 class="card-title text-uppercase shadowed-h">
          No Products Found
        </h1>`;
        } else {
          products1.forEach((product) => {
            console.log(product.image_path);
            body_divi.innerHTML += `
       <div class="card-rotate">
  <a href="#">
    <div class="product-card ${product.quantity === 0 ? "out-of-stock" : ""}">
      <!-- Front Side -->
      <div class="card-face card-front">
        <div class="image-holder">
          <img src="${product.image_path}" alt="${
              product.product_name
            }" class="img-fluid" />
          <span class="card-title-right text-uppercase image-change">${
            product.quantity
          }</span>
          <span class="card-title text-uppercase image-change">%${
            product.product_discount * 100
          }</span>
        </div>
        <div class="card-detail d-flex justify-content-between align-items-baseline pt-3">
          <h3 class="card-title text-uppercase">
            <a href="#">${product.product_name}</a>
          </h3>
          <span class="item-price text-primary">$${product.total_price}</span>
        </div>
      </div>

      <!-- Back Side -->
      <div class="card-face card-back">
        <div class="p-3">
          <h3>Details</h3>
          <p>Product Name: ${product.product_name}</p>
          <p>Price: $${product.total_price}</p>
          <p>Description: Kerat: ${product.kerat}, Factor Type: ${
              product.main_factor_type
            }, Weight: ${product.weight}, Price/G: ${product.price_per_gram}</p>
        </div>
      </div>
    </div>
  </a>

  <!-- Add to Cart Button -->
  ${
    product.quantity > 0
      ? `
  <a href="#" class="btn btn-medium btn-black add-to-cart" data-id="${product.product_id}">
    Add to Cart
    <svg class="cart-outline">
      <use xlink:href="#cart-outline"></use>
    </svg>
  </a>
`
      : ""
  }

</div>

      `;
          });
        }
        body_divi.classList.add("bodyDiv");
      }
      const cartButtons = document.querySelectorAll(".add-to-cart");

      cartButtons.forEach((cartButton) => {
        cartButton.addEventListener("click", async function (event) {
          event.preventDefault();

          const product_id = cartButton.getAttribute("data-id");
          const acc_id = getCookie("acc_id");

          if (acc_id) {
            try {
              const response = await fetch(
                `http://127.0.0.1:8000/Home/add-to-cart`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify({ product_id, acc_id }),
                }
              );

              if (response.ok) {
                console.log(await response.json());
              } else {
                console.log("Error in response!");
              }
            } catch (error) {
              console.log("Fetch error:", error);
            }
          } else {
            console.log("User is not logged in. Redirecting to login page...");
            window.location.href = "../login/login.html";
          }
        });
      });
    });
  products1.forEach((product) => {
    addProductToSwiperBracelet(product);
  });
}
loadProductsBracelet("Bracelet");

/////////////////////////////////////////////////////////////////////////

// products.forEach(product => {
//   addProductToSwiper(product.product_url, product.product_name, product.product_price);
//   document.querySelector('.cart-click').addEventListener('click', function(event) {
//   event.preventDefault();

//   const acc_id = getCookie('acc_id');

//   if (acc_id) {
//     console.log('User is logged in, acc_id:', acc_id);
//   } else {
//     console.log('User is not logged in. Redirecting to login page...');
//     window.location.href = "../login/login.html";
//   }
// });

// });

function getCookie(name) {
  let value = "; " + document.cookie;
  let parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
}

// document.querySelector('.cart-click').addEventListener('click', function(event) {
//   event.preventDefault();

//   const acc_id = getCookie('acc_id');

//   if (acc_id) {
//     console.log('User is logged in, acc_id:', acc_id);
//   } else {
//     console.log('User is not logged in. Redirecting to login page...');
//     window.location.href = "../login/login.html";
//   }
// });

let logoutTimer;

function resetTimer() {
  clearTimeout(logoutTimer);
  logoutTimer = setTimeout(logoutUser, 10 * 1000 * 60);
}

["mousemove", "keydown", "click", "scroll"].forEach((event) => {
  window.addEventListener(event, resetTimer);
});

function logoutUser() {
  document.cookie = "acc_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  console.log("You have been logged out due to inactivity.");
  window.location.href = "../login/login.html";
}

resetTimer();

async function checkUserAndRedirect() {
  const acc_id_cookies = getCookie("acc_id");
  const username_banner = document.querySelector(".user-login");
  if (acc_id_cookies) {
    try {
      const response = await fetch("http://127.0.0.1:8000/Home", {
        method: "GET",
        credentials: "include", // To send cookies
      });
      const data_username = await response.json();
      if (response.ok) {
        username_banner.innerHTML = "";
        username_banner.innerHTML = `
        <a href="#" class="username-button">${data_username.Username}</a>
        <a href="#" class="logout-button">Logout</a>
        `;
        document
          .querySelector(".logout-button")
          .addEventListener("click", async function (event) {
            event.preventDefault();

            document.cookie =
              "acc_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie =
              "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.reload();
          });
        document
          .querySelector(".username-button")
          .addEventListener("click", async function (event) {
            event.preventDefault();
            const body_d = document.querySelector(".body-div");
            body_d.innerHTML = `
    <div class="container">
        <header class="header">
            <h1>Welcome back, </h1>
            <p>Your luxury jewelry collection awaits</p>
        </header>

        <div class="grid">
            <!-- Total Money Spent -->
            <div class="card-dashboard spending-card">
                <div class="card-title-dashboard">
                    <i class="fas fa-gem card-icon"></i>
                    Lifetime Investment
                </div>
                <div class="spending-amount">$0</div>
                <div class="spending-details">
                    <div class="detail-item">
                        <span class="detail-number">0</span>
                        <span>Items Purchased</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-number Rank-member">Silver</span>
                        <span>Member Status</span>
                    </div>
                </div>
            </div>

            <!-- Products Purchased -->
            <div class="card-dashboard">
                <div class="card-title-dashboard">
                    <i class="fas fa-shopping-bag card-icon"></i>
                    Recent Purchases
                </div>
                <div class="product-grid-dashboard recent-pachases">
                    
                </div>
            </div>

            <div class="card">
                <div class="card-title">
                    <i class="fas fa-history card-icon"></i>
                    Order History
                </div>
                <div class="timeline">
                    
                </div>
            </div>



            <!-- Monthly Spending Chart -->
            <div class="card-dashboard">
                <div class="card-title-dashboard">
                    <i class="fas fa-chart-bar card-icon"></i>
                    Monthly Spending
                </div>
                <div class="chart-container monthly-total-spent">
                    <div class="chart-bar chart-bar-1" style="height: 10px;">
                        <div class="chart-value">0</div>
                        <div class="chart-label">1</div>
                    </div>
                    <div class="chart-bar chart-bar-2" style="height: 10px;">
                        <div class="chart-value">0</div>
                        <div class="chart-label">2</div>
                    </div>
                    <div class="chart-bar chart-bar-3" style="height: 10px;">
                        <div class="chart-value">0</div>
                        <div class="chart-label">3</div>
                    </div>
                    <div class="chart-bar chart-bar-4" style="height: 10px;">
                        <div class="chart-value">0</div>
                        <div class="chart-label">4</div>
                    </div>
                    <div class="chart-bar chart-bar-5" style="height: 10px;">
                        <div class="chart-value">0</div>
                        <div class="chart-label">5</div>
                    </div>
                    <div class="chart-bar chart-bar-6" style="height: 10px;">
                        <div class="chart-value">0</div>
                        <div class="chart-label">6</div>
                    </div>
                    <div class="chart-bar chart-bar-7" style="height: 10px;">
                        <div class="chart-value">0</div>
                        <div class="chart-label">7</div>
                    </div>
                    <div class="chart-bar chart-bar-8" style="height: 10px;">
                        <div class="chart-value">0</div>
                        <div class="chart-label">8</div>
                    </div>
                    <div class="chart-bar chart-bar-9" style="height: 10px;">
                        <div class="chart-value">0</div>
                        <div class="chart-label">9</div>
                    </div>
                    <div class="chart-bar chart-bar-9" style="height: 10px;">
                        <div class="chart-value">0</div>
                        <div class="chart-label">10</div>
                    </div>
                    <div class="chart-bar chart-bar-10" style="height: 10px;">
                        <div class="chart-value">0</div>
                        <div class="chart-label">11</div>
                    </div>
                    <div class="chart-bar chart-bar-11" style="height: 10px;">
                        <div class="chart-value">0</div>
                        <div class="chart-label">12</div>
                    </div>
                </div>
            </div>

            <!-- Loyalty Status -->
            <div class="card-dashboard loyalty-card">
                <div class="card-title-dashboard">
                    <i class="fas fa-star card-icon"></i>
                </div>
                <div class="loyalty-tier current-member">Gold Member</div>
                <div class="loyalty-points">
                    <div class="points-current">0</div>
                    <div class="points-total">/ 5,000 points</div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%;"></div>
                </div>
                <div class="progress-labels">
                    <span>Current</span>
                    <span class="next-member">Next: Silver</span>
                </div>
            </div>

            <!-- Recommended Products -->
            <div class="card-dashboard recommendations">
                <div class="card-title-dashboard">
                    <i class="fas fa-heart card-icon"></i>
                    Created for You
                </div>
                <div class="recommendations-scroll">
                </div>
            </div>
        </div>
    </div>
          `;
            ///////////////////////////Dashboard Script///////////////////////////////
            const acc_id = getCookie("acc_id");

            if (acc_id) {
              try {
                const response = await fetch(
                  `http://127.0.0.1:8000/total-spending`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ acc_id }),
                  }
                );

                if (response.ok) {
                  rawData = await response.json();
                  TotalSpent = rawData["TotalSpent"][0];
                  NumberItems = rawData["NumberOrders"][0];
                } else {
                  console.log("Error in response!");
                }
              } catch (error) {
                console.log("Fetch error:", error);
              }
              try {
                const response = await fetch(`http://127.0.0.1:8000/ranking`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify({ acc_id }),
                });

                if (response.ok) {
                  rawData_rank = await response.json();
                  rank = rawData_rank["rank"];
                  document.querySelector(".Rank-member").textContent = rank;
                } else {
                  console.log("Error in response!");
                }
              } catch (error) {
                console.log("Fetch error:", error);
              }
              try {
                const response = await fetch(
                  `http://127.0.0.1:8000/recent-parchases`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ acc_id }),
                  }
                );

                if (response.ok) {
                  recent_parchases = await response.json();
                  const upperTag = document.querySelector(".recent-pachases");
                  upperTag.innerHTML = "";
                  recent_parchases.forEach((entry) => {
                    upperTag.innerHTML += `<div class="product-card-dashboard">
                        <div class="product-image-dashboard">
                            <i class="fas fa-ring back-img"><img src="${entry[1]}"/></i>
                        </div>
                        <div class="product-name-dashboard">${entry[0]}</div>
                        <div class="product-price-dashboard">$${entry[2]}</div>
                        <div class="product-date-dashboard">${entry[3]}</div>
                    </div>`;
                  });
                } else {
                  console.log("Error in response!");
                }
              } catch (error) {
                console.log("Fetch error:", error);
              }
            }
            const observerOptions = {
              threshold: 0.1,
              rootMargin: "0px 0px -50px 0px",
            };
            try {
              const response = await fetch(
                `http://127.0.0.1:8000/monthly-spent`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify({ acc_id }),
                }
              );

              if (response.ok) {
                monthly_spent = await response.json();
                const values = [];
                monthly_spent.forEach((entry) => {
                  values.push(parseInt(entry[1]));
                  document.querySelector(
                    `.chart-bar-${entry[0]} .chart-value`
                  ).textContent = "$" + entry[1];
                });
                const max_value = Math.max(...values);
                monthly_spent.forEach((entry) => {
                  const height = (parseInt(entry[1]) / max_value) * 260;
                  document.querySelector(
                    `.chart-bar-${entry[0]}`
                  ).style.height = parseInt(height) + "px";
                });
              } else {
                console.log("Error in response!");
              }
            } catch (error) {
              console.log("Fetch error:", error);
            }
            try {
              const response = await fetch(
                `http://127.0.0.1:8000/ranking-bar`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify({ acc_id }),
                }
              );

              if (response.ok) {
                rawData_Nextrank = await response.json();
                document.querySelector(".current-member").textContent =
                  rawData_Nextrank["rank"];
                document.querySelector(".points-current").textContent =
                  rawData_Nextrank["c_points"];
                document.querySelector(".points-total").textContent =
                  rawData_Nextrank["point"];
                document.querySelector(".next-member").textContent =
                  rawData_Nextrank["next"];
              } else {
                console.log("Error in response!");
              }
            } catch (error) {
              console.log("Fetch error:", error);
            }
            try {
              const response = await fetch(
                `http://127.0.0.1:8000/recomended-products`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                }
              );

              if (response.ok) {
                recomended_products = await response.json();
                const upperTag = document.querySelector(
                  ".recommendations-scroll"
                );
                upperTag.innerHTML = "";
                recomended_products.forEach((entry) => {
                  upperTag.innerHTML += `<div class="recommendation-card">
                        <div class="recommendation-image">
                            <img src="${entry[1]}"/>
                            <i class="fas fa-ring"></i>
                        </div>
                        <div class="recommendation-name">${entry[0]}</div>
                        <div class="recommendation-price">$${entry[2]}</div>
                        <div class="recommendation-rating">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                    </div>`;
                });
              } else {
                console.log("Error in response!");
              }
            } catch (error) {
              console.log("Fetch error:", error);
            }
            try {
              const response = await fetch(
                `http://127.0.0.1:8000/order-history`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify({ acc_id }),
                }
              );

              if (response.ok) {
                // Make cancelOrder global so inline onclick can find it
                window.cancelOrder = async function (order_id) {
                  if (
                    confirm(
                      `Are you sure you want to cancel order ${order_id}?`
                    )
                  ) {
                    try {
                      const response = await fetch(
                        `http://127.0.0.1:8000/cancel-order`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          credentials: "include",
                          body: JSON.stringify({ order_id }),
                        }
                      );

                      if (response.ok) {
                        console.log("Order Cancelled!");
                      } else {
                        console.log("Error in response!");
                      }
                    } catch (error) {
                      console.log("Fetch error:", error);
                    }
                  }
                };

                async function fetchAndBuildTimeline() {
                  const orders_history_ret = await response.json();

                  const timeline = document.querySelector(".timeline");
                  timeline.innerHTML = "";

                  function buildTimeline(timeline, orders_history) {
                    Object.keys(orders_history).forEach((key) => {
                      const status = orders_history[key][0][1].toLowerCase();

                      timeline.innerHTML += `
                          <div class="timeline-item">
                            <div class="order-header">
                              <span class="order-id">${key}</span>
                              <span class="status-badge status-${status}">${orders_history[key][0][1]}</span>
                            </div>
                        `;

                      orders_history[key].forEach((entry) => {
                        timeline.innerHTML += `<p>${entry[0]}</p>`;
                      });

                      if (status !== "delivered" && status !== "cancelled") {
                        const orderNumberMatch = key.match(/#(\d+)-/);
                        const orderNumber = orderNumberMatch
                          ? orderNumberMatch[1]
                          : key; // fallback to key if no match

                        timeline.innerHTML += `
                            <button class="cancel-button" onclick="cancelOrder('${orderNumber}')">Cancel Order</button>
                          `;
                      }

                      timeline.innerHTML += `</div>`;
                    });
                  }

                  buildTimeline(timeline, orders_history_ret);
                }

                fetchAndBuildTimeline();
              } else {
                console.log("Error in response!");
              }
            } catch (error) {
              console.log("Fetch error:", error);
            }
            const observer = new IntersectionObserver((entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  entry.target.style.opacity = "1";
                  entry.target.style.transform = "translateX(0)";
                }
              });
            }, observerOptions);

            // Observe timeline items
            document.querySelectorAll(".timeline-item").forEach((item) => {
              item.style.opacity = "0.3";
              item.style.transform = "translateX(-20px)";
              item.style.transition = "all 0.6s ease-out";
              observer.observe(item);
            });

            // Add staggered animation for cards
            document.querySelectorAll(".card").forEach((card, index) => {
              card.style.animationDelay = `${index * 0.1}s`;
            });

            // Add interactive chart functionality
            document.querySelectorAll(".chart-bar").forEach((bar) => {
              bar.addEventListener("mouseenter", () => {
                bar.style.transform = "scale(1.1)";
                bar.style.filter = "brightness(1.2)";
              });

              bar.addEventListener("mouseleave", () => {
                bar.style.transform = "scale(1)";
                bar.style.filter = "brightness(1)";
              });
            });

            // Smooth scrolling for recommendations
            const recommendationsScroll = document.querySelector(
              ".recommendations-scroll"
            );
            let isScrolling = false;
            // Add sparkle effect to loyalty card
            function createSparkle() {
              const loyaltyCard = document.querySelector(".loyalty-card");
              const sparkle = document.createElement("div");
              sparkle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--gold);
                border-radius: 50%;
                pointer-events: none;
                animation: sparkleFloat 2s ease-out forwards;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
            `;

              loyaltyCard.appendChild(sparkle);

              setTimeout(() => {
                sparkle.remove();
              }, 2000);
            }

            // Add sparkle animation keyframes
            const style = document.createElement("style");
            style.textContent = `
            @keyframes sparkleFloat {
                0% {
                    opacity: 1;
                    transform: translateY(0) scale(0);
                }
                50% {
                    opacity: 1;
                    transform: translateY(-20px) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-40px) scale(0);
                }
            }
        `;
            document.head.appendChild(style);

            // Create sparkles periodically
            setInterval(createSparkle, 3000);

            // Add hover effects to product cards
            document
              .querySelectorAll(".product-card, .recommendation-card")
              .forEach((card) => {
                card.addEventListener("mouseenter", () => {
                  card.style.transform = "scale(1.05) translateY(-5px)";
                  card.style.boxShadow = "var(--shadow-medium)";
                });

                card.addEventListener("mouseleave", () => {
                  card.style.transform = "scale(1) translateY(0)";
                  card.style.boxShadow = "";
                });
              });

            // Add click animation to cards
            document.querySelectorAll(".card").forEach((card) => {
              card.addEventListener("click", () => {
                card.style.transform = "scale(0.98)";
                setTimeout(() => {
                  card.style.transform = "";
                }, 150);
              });
            });

            // Progress bar animation on scroll
            const progressBar = document.querySelector(".progress-fill");
            const progressObserver = new IntersectionObserver(
              (entries) => {
                entries.forEach((entry) => {
                  if (entry.isIntersecting) {
                    progressBar.style.width =
                      (parseInt(rawData_Nextrank["c_points"]) /
                        parseInt(rawData_Nextrank["point"])) *
                        100 +
                      "%";
                  }
                });
              },
              { threshold: 0.5 }
            );

            progressObserver.observe(progressBar);

            // Add subtle floating animation to icons
            document.querySelectorAll(".card-icon").forEach((icon, index) => {
              icon.style.animation = `float 3s ease-in-out infinite ${
                index * 0.5
              }s`;
            });

            // Add floating animation keyframes
            const floatStyle = document.createElement("style");
            floatStyle.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-3px); }
            }
        `;
            document.head.appendChild(floatStyle);

            // Add loading animation for spending amount
            const spendingAmount = document.querySelector(".spending-amount");
            let currentAmount = 0;
            const targetAmount = TotalSpent;
            const increment = targetAmount / 100;

            function animateCounter() {
              if (currentAmount < targetAmount) {
                currentAmount += increment;
                spendingAmount.textContent = `${Math.floor(
                  currentAmount
                ).toLocaleString()}`;
                requestAnimationFrame(animateCounter);
              } else {
                spendingAmount.textContent = `$${targetAmount.toLocaleString()}`;
              }
            }

            // Start counter animation after page load
            setTimeout(() => {
              animateCounter();
            }, 1000);

            // Add smooth reveal animation for grid items
            document
              .querySelectorAll(".grid > .card")
              .forEach((card, index) => {
                card.style.opacity = "0";
                card.style.transform = "translateY(50px)";

                setTimeout(() => {
                  card.style.transition =
                    "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
                  card.style.opacity = "1";
                  card.style.transform = "translateY(0)";
                }, index * 200);
              });

            // Add parallax effect to header
            window.addEventListener("scroll", () => {
              const scrolled = window.pageYOffset;
              const header = document.querySelector(".header");
              header.style.transform = `translateY(${scrolled * 0.5}px)`;
              header.style.opacity = 1 - scrolled / 300;
            });

            // Add touch-friendly interactions for mobile
            if ("ontouchstart" in window) {
              document
                .querySelectorAll(".card, .product-card, .recommendation-card")
                .forEach((element) => {
                  element.addEventListener("touchstart", () => {
                    element.style.transform = "scale(0.95)";
                  });

                  element.addEventListener("touchend", () => {
                    setTimeout(() => {
                      element.style.transform = "";
                    }, 150);
                  });
                });
            }
            document.querySelector(".detail-number").textContent = NumberItems;

            ///////////////////////////End Dashboard Script///////////////////////////////
          });
      } else {
        console.error("response error!");
      }
    } catch (error) {
      console.error("Error redirecting to Home:", error);
    }
  } else {
    username_banner.innerHTML = "";
    username_banner.innerHTML = `
    <a href="/login/login.html" class="login-user">
      <svg class="user">
        <use xlink:href="#user"></use>
      </svg>
    </a>
    `;
  }
}

checkUserAndRedirect();

//////////////////////////Card Script/////////////////////////////////
const cartButton = document.querySelector(".cart-button");

cartButton.addEventListener("click", async function (event) {
  event.preventDefault();
  const acc_id = getCookie("acc_id");

  if (!acc_id) {
    console.log("User is not logged in. Redirecting to login page...");
    window.location.href = "../login/login.html";
    return;
  }

  const body_div = document.querySelector(".body-div");
  body_div.innerHTML = `
    <div class="cart-container">
        <div class="cart-header">
            <div>Product</div>
            <div>Price</div>
            <div>Quantity</div>
            <div>Subtotal</div>
            <div>Actions</div>
        </div>
        <div id="cart-items"></div>
        <div class="cart-total">
            Total: $<span id="total-price">0.00</span>
            <button 
                    class="remove-btn checkout cb-mg" 
                >Checkout</button>
        </div>
    </div>
  `;
  body_div.classList.add("body-card");
  //////////////////////Checkout/////////////////////
  const checkoutButton = document.querySelector(".checkout");
  if (checkoutButton) {
    checkoutButton.addEventListener("click", async function (event) {
      event.preventDefault();
      body_div.innerHTML = `
    <div class="payment-container">
        <h1 class="form-title">Complete Payment</h1>
        
        <div class="success-message" id="successMessage">
            Payment processed successfully! Thank you for your purchase.
        </div>
        <div class="fail-message" id="failMessage">
            Payment processed Failed! Try Again Later.
        </div>

        <form id="paymentForm">
            <div class="form-group">
                <label for="fullName">Full Name</label>
                <input type="text" id="fullName" name="fullName" required>
                <div class="error-message" id="fullNameError">Please enter your full name</div>
            </div>

            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" required readonly>
                <div class="error-message" id="emailError">Please enter a valid email address</div>
            </div>

            <div class="form-group">
                <label for="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" required>
                <div class="error-message" id="phoneError">Please enter a valid phone number</div>
            </div>

            <div class="form-group">
                <label for="address">Shipping Address</label>
                <input type="text" id="address" name="address" required>
                <div class="error-message" id="addressError">Please enter your shipping address</div>
            </div>

            <div class="form-group">
                <label for="cardNumber">Credit Card Number</label>
                <input type="text" id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" required>
                <div class="error-message" id="cardNumberError">Please enter a valid card number</div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="expiry">Expiration Date</label>
                    <input type="text" id="expiry" name="expiry" placeholder="MM/YY" required>
                    <div class="error-message" id="expiryError">Please enter MM/YY format</div>
                </div>
                <div class="form-group">
                    <label for="cvv">CVV</label>
                    <input type="text" id="cvv" name="cvv" placeholder="123" required>
                    <div class="error-message" id="cvvError">Please enter a valid CVV</div>
                </div>
            </div>

            <button type="submit" class="pay-button" id="payButton" style="font-family=Poppins">
                <div class="loading" id="loading"></div>
                <span id="buttonText">Pay Now</span>
            </button>

            <div class="security-info">
                <svg class="security-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.4 16,13V16C16,17.4 15.4,18 14.8,18H9.2C8.6,18 8,17.4 8,16V13C8,12.4 8.6,11.5 9.2,11.5V10C9.2,8.6 10.6,7 12,7M12,8.2C11,8.2 10.2,9 10.2,10V11.5H13.8V10C13.8,9 13,8.2 12,8.2Z"/>
                </svg>
                Your payment information is secure
            </div>
        </form>
    </div>
    `;

      body_div.classList.remove("body-card");
      body_div.classList.add("body-checkout");
      const acc_id = getCookie("acc_id");
      try {
        const response = await fetch("http://127.0.0.1:8000/checkout-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ acc_id }),
        });
        const AccountData = await response.json();
        if (response.status == 404) {
          alert("No Data in Cart!");
          window.location.href = "/homeScreen/index.html";
        }
        console.log(AccountData);
        if (response.ok) {
          if (!AccountData || AccountData.length === 0) {
            console.log("No Data Returned");
            return;
          }
          const Name = document.querySelector(".form-group #fullName");
          const Email = document.querySelector(".form-group #email");
          Name.value = `${AccountData[0]} ${AccountData[1]}`;
          Email.value = `${AccountData[2]}`;
          if (Email.readOnly) {
            Email.style.backgroundColor = "#e9ecef";
            Email.style.color = "#6c757d";
            Email.cursor = "not-allowed";
          }
        } else {
          console.log("Error in response!");
        }
      } catch (error) {
        console.log("Fetch error:", error);
      }
      // Form validation and formatting
      const form = document.getElementById("paymentForm");
      const inputs = form.querySelectorAll("input");
      const payButton = document.getElementById("payButton");
      const loading = document.getElementById("loading");
      const buttonText = document.getElementById("buttonText");
      const successMessage = document.getElementById("successMessage");
      const failMessage = document.getElementById("failMessage");
      // Card number formatting
      document
        .getElementById("cardNumber")
        .addEventListener("input", function (e) {
          let value = e.target.value.replace(/\s/g, "").replace(/[^0-9]/gi, "");
          let formattedValue = value.match(/.{1,4}/g)?.join(" ") || value;
          if (formattedValue.length > 19)
            formattedValue = formattedValue.substring(0, 19);
          e.target.value = formattedValue;
        });

      // Expiry date formatting
      document.getElementById("expiry").addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length >= 2) {
          value = value.substring(0, 2) + "/" + value.substring(2, 4);
        }
        e.target.value = value;
      });

      // CVV formatting
      document.getElementById("cvv").addEventListener("input", function (e) {
        e.target.value = e.target.value.replace(/\D/g, "").substring(0, 4);
      });

      // Phone formatting
      document.getElementById("phone").addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length >= 6) {
          value = value.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
        } else if (value.length >= 3) {
          value = value.replace(/(\d{3})(\d{0,3})/, "($1) $2");
        }
        e.target.value = value;
      });

      // Real-time validation
      inputs.forEach((input) => {
        input.addEventListener("blur", validateField);
        input.addEventListener("input", clearError);
      });

      function validateField(e) {
        const field = e.target;
        const fieldName = field.name;
        let isValid = true;

        // Clear previous error
        clearError(e);

        switch (fieldName) {
          case "fullName":
            isValid = field.value.trim().length >= 2;
            break;
          case "email":
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
            break;
          case "phone":
            isValid = field.value.replace(/\D/g, "").length >= 10;
            break;
          case "address":
            isValid = field.value.trim().length >= 5;
            break;
          case "cardNumber":
            isValid = field.value.replace(/\s/g, "").length >= 13;
            break;
          case "expiry":
            const expiry = field.value.split("/");
            if (expiry.length === 2) {
              const month = parseInt(expiry[0]);
              const year = parseInt("20" + expiry[1]);
              const now = new Date();
              const expDate = new Date(year, month - 1);
              isValid = month >= 1 && month <= 12 && expDate > now;
            } else {
              isValid = false;
            }
            break;
          case "cvv":
            isValid = field.value.length >= 3;
            break;
        }

        if (!isValid) {
          showError(field, fieldName);
        }

        return isValid;
      }

      function showError(field, fieldName) {
        field.classList.add("error");
        document.getElementById(fieldName + "Error").classList.add("show");
      }

      function clearError(e) {
        const field = e.target;
        const fieldName = field.name;
        field.classList.remove("error");
        document.getElementById(fieldName + "Error").classList.remove("show");
      }

      // Form submission
      form.addEventListener("submit", async function (e) {
        e.preventDefault();

        let isFormValid = true;
        inputs.forEach((input) => {
          if (!validateField({ target: input })) {
            isFormValid = false;
          }
        });

        if (isFormValid) {
          payButton.disabled = true;
          loading.style.display = "inline-block";
          buttonText.textContent = "Processing...";
          const acc_id = getCookie("acc_id");
          let resp = 0;
          try {
            const checkout_values = {
              acc_id_n: acc_id,
              fullName: document.querySelector("#fullName").value,
              email: document.querySelector("#email").value,
              phone: document.querySelector("#phone").value.replace(/\D/g, ""),
              address: document.querySelector("#address").value,
              cardNumber: document
                .querySelector("#cardNumber")
                .value.replace(/\s+/g, ""),
              expiry: document.querySelector("#expiry").value,
              cvv: document.querySelector("#cvv").value,
            };
            const response = await fetch(
              "http://127.0.0.1:8000/checkout-data-database",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(checkout_values),
              }
            );
            if (response.ok) {
              valueResponed = await response.json();
              console.log(valueResponed);
              console.log("Payment Completed");
              resp = 200;
            } else {
              console.log(await response.json());
              console.log("Error in response!");
              resp = 500;
            }
          } catch (error) {
            console.log("Fetch error:", error);
            resp = 500;
          }
          // Simulate payment processing
          setTimeout(() => {
            // Hide loading state
            payButton.disabled = false;
            loading.style.display = "none";
            buttonText.textContent = "Pay Now";
            if (resp == 200) {
              // Show success message
              successMessage.style.display = "block";
              form.style.display = "none";
              setTimeout(() => {
                body_div.className = "body-div";
                body_div.innerHTML = ` 
                <div class="receipt-container fade-in">
        <div class="receipt-header">
            <h1 class="shop-name">ALAMEERA</h1>
            <p class="shop-tagline">Timeless Elegance & Luxury</p>
        </div>

        <div class="receipt-info">
            <div class="receipt-details">
                <div class="detail-item-receipt">
                    <span class="detail-label">Receipt #:</span>
                    <span class="detail-value" id="receipt-number">${
                      Object.keys(valueResponed)[1]
                    }</span>
                </div>
                <div class="detail-item-receipt">
                    <span class="detail-label">Customer:</span>
                    <span class="detail-value">${
                      valueResponed["personal_details"][0]
                    }</span>
                </div>
                <div class="detail-item-receipt">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value" id="receipt-date"></span>
                </div>
                <div class="detail-item-receipt">
                    <span class="detail-label">Payment:</span>
                    <span class="detail-value">${
                      valueResponed["personal_details"][1]
                    }</span>
                </div>
                <div class="detail-item-receipt">
                    <span class="detail-label">Location:</span>
                    <span class="detail-value">${
                      valueResponed["Location"]
                    }</span>
                </div>
            </div>
        </div>

        <div class="items-section">
            <h2 class="section-title">Purchased Items</h2>
            <div id="items-container"></div>
        </div>

        <div class="total-section">
            <div class="total-row subtotal">
                <span>Subtotal:</span>
                <span id="subtotal">$0.00</span>
            </div>
            <div class="total-row final-total">
                <span class="total-label">Total:</span>
                <span id="final-total">$0.00</span>
            </div>
        </div>

        <div class="thank-you">
            <p>Thank you for choosing ALAMEERA. Your satisfaction is our commitment to excellence.</p>
        </div>
    </div>`;

                function generateStars(rating) {
                  let starsHTML = "";
                  const fullStars = Math.floor(rating);
                  const hasHalfStar = rating % 1 !== 0;

                  for (let i = 0; i < fullStars; i++) {
                    starsHTML += '<span class="star filled">★</span>';
                  }

                  if (hasHalfStar) {
                    starsHTML += '<span class="star half">★</span>';
                  }

                  const emptyStars = 5 - Math.ceil(rating);
                  for (let i = 0; i < emptyStars; i++) {
                    starsHTML += '<span class="star">★</span>';
                  }

                  return starsHTML;
                }

                function formatCurrency(amount) {
                  return new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(amount);
                }

                function generateReceipt() {
                  const itemsContainer =
                    document.getElementById("items-container");
                  let subtotal = 0;

                  // Set current date
                  const currentDate = new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });
                  document.getElementById("receipt-date").textContent =
                    currentDate;
                  console.log(valueResponed[Object.keys(valueResponed)[1]]);
                  // Generate items
                  valueResponed[Object.keys(valueResponed)[1]].forEach(
                    (entry) => {
                      const itemTotal = parseInt(entry[2]) * parseInt(entry[1]);
                      subtotal += itemTotal;

                      itemsContainer.innerHTML += `
                    <div class="item" style="animation-delay: ${0.1}s">
                        <div class="item-header">
                            <h3 class="item-name">${entry[0]}</h3>
                            <div class="item-price">${formatCurrency(
                              itemTotal
                            )}</div>
                        </div>
                        <div class="item-details">
                            <div class="item-detail">
                                <svg class="detail-icon" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V7l-7-5z"/>
                                </svg>
                                <span class="quantity-badge">Qty: ${
                                  entry[2]
                                }</span>
                            </div>
                            <div class="item-detail">
                                <svg class="detail-icon" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
                                </svg>
                                <span>${formatCurrency(entry[1])} each</span>
                            </div>
                        </div>
                        <div class="rating" data-rating="0">
                            <span class="star" data-value="1">&#9733;</span>
                            <span class="star" data-value="2">&#9733;</span>
                            <span class="star" data-value="3">&#9733;</span>
                            <span class="star" data-value="4">&#9733;</span>
                            <span class="star" data-value="5">&#9733;</span>
                            <span class="rating-value" style="margin-left: 8px; color: #666; font-size: 0.9rem;">(0)</span>
                        </div>
                    </div>
                `;
                    }
                  );

                  // Calculate totals
                  // Attach event listeners to each rating block
                  document.querySelectorAll(".rating").forEach((ratingDiv) => {
                    const stars = ratingDiv.querySelectorAll(".star");
                    const ratingValueSpan =
                      ratingDiv.querySelector(".rating-value");

                    stars.forEach((star) => {
                      star.addEventListener("click", () => {
                        const selectedRating = parseInt(star.dataset.value);
                        ratingDiv.setAttribute("data-rating", selectedRating);
                        ratingValueSpan.textContent = `(${selectedRating})`;

                        // Update star styles
                        stars.forEach((s) => {
                          s.classList.remove("selected");
                          if (parseInt(s.dataset.value) <= selectedRating) {
                            s.classList.add("selected");
                          }
                        });

                        // Optional: Log product and rating
                        const productName = ratingDiv
                          .closest(".item")
                          .querySelector(".item-name").textContent;
                        const order_id = valueResponed["order_id"];

                        let product_id = null; // declare outside the loop

                        valueResponed[Object.keys(valueResponed)[1]].forEach(
                          (new_value) => {
                            if (new_value[0] == productName) {
                              product_id = new_value[3];
                              async function submitCheckout() {
                                try {
                                  const response = await fetch(
                                    "http://127.0.0.1:8000/edit-rating",
                                    {
                                      method: "POST",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      credentials: "include",
                                      body: JSON.stringify({
                                        order_id,
                                        product_id,
                                        rating: selectedRating,
                                      }),
                                    }
                                  );

                                  if (response.ok) {
                                    console.log("Rating Edited!");
                                  } else {
                                    console.log("Error in response!");
                                  }
                                } catch (error) {
                                  console.log("Fetch error:", error);
                                }
                              }
                              submitCheckout();
                            }
                          }
                        );

                        console.log(
                          `User rated ${productName} (Product ID: ${product_id}, Order ID: ${order_id}): ${selectedRating}`
                        );
                      });
                    });
                  });

                  const finalTotal = subtotal;

                  // Update totals
                  document.getElementById("subtotal").textContent =
                    formatCurrency(subtotal);
                  document.getElementById("final-total").textContent =
                    formatCurrency(finalTotal);
                }
                generateReceipt();

                // Add stagger animation to items
                const items = document.querySelectorAll(".item");
                items.forEach((item, index) => {
                  item.style.animationDelay = `${index * 0.1}s`;
                  item.classList.add("fade-in");
                });
              }, 3000);
            } else {
              failMessage.style.display = "block";
              form.style.display = "none";
            }
            // Scroll to top
            document.querySelector(".payment-container").scrollIntoView({
              behavior: "smooth",
            });
          }, 2000);
        }
      });

      // Add subtle animations on focus
      inputs.forEach((input) => {
        input.addEventListener("focus", function () {
          this.parentElement.style.transform = "translateY(-2px)";
        });

        input.addEventListener("blur", function () {
          this.parentElement.style.transform = "translateY(0)";
        });
      });
      ////////////////End of Checkout///////////////////////////
    });
  }
  let cartItems = [];

  try {
    const response = await fetch(`http://127.0.0.1:8000/cartProducts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ acc_id }),
    });

    const rawData = await response.json();

    if (response.ok) {
      if (!rawData || rawData.length === 0) {
        console.log("No Data in cart");
        return;
      }

      const keys = [
        "product_id",
        "product_type",
        "discount",
        "total_price",
        "image_path",
        "quantity",
      ];

      cartItems = rawData.map((item) => {
        const product = {};
        keys.forEach((key, index) => {
          product[key] = item[index];
        });
        return product;
      });

      const cartItemsContainer = document.getElementById("cart-items");
      const totalPriceElement = document.getElementById("total-price");

      async function renderCart(items) {
        cartItemsContainer.innerHTML = "";

        items.forEach((item) => {
          const subtotal = (item.total_price * item.quantity).toFixed(2);

          const cartItemElement = document.createElement("div");
          cartItemElement.classList.add("cart-item");

          cartItemElement.innerHTML = `
          <div class="cart-item-details">
              <img src="${item.image_path}" alt="${item.product_type}">
              <span>${item.product_type}</span>
          </div>
          <div>$${item.total_price.toFixed(2)}</div>
          <div>${item.quantity}</div>
          <div>$${subtotal}</div>
          <div>
              <button class="remove-btn" data-id="${
                item.product_id
              }">Remove</button>
          </div>
        `;

          cartItemsContainer.appendChild(cartItemElement);
        });

        updateTotalPrice();
        addEventListeners(); // Add event listeners after rendering
      }

      function updateTotalPrice() {
        const total = cartItems.reduce(
          (sum, item) => sum + item.total_price * item.quantity,
          0
        );
        totalPriceElement.textContent = total.toFixed(2);
      }

      function addEventListeners() {
        // Remove item from cart and sync with backend
        document.querySelectorAll(".remove-btn").forEach((button) => {
          button.addEventListener("click", async (e) => {
            e.preventDefault();

            const product_id = e.target.getAttribute("data-id");
            const acc_id = parseInt(getCookie("acc_id"));

            try {
              const response = await fetch(
                "http://127.0.0.1:8000/removeFromCart",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify({ product_id, acc_id }),
                }
              );

              if (response.ok) {
                console.log("Item removed successfully");

                // Remove item from UI and re-render
                cartItems = cartItems.filter(
                  (item) => item.product_id != product_id
                );
                renderCart(cartItems);
              } else {
                console.log(response);
                console.log("Failed to remove item");
              }
            } catch (error) {
              console.log("Fetch error:", error);
            }
          });
        });

        // Quantity input (if used in your layout)
        document.querySelectorAll(".quantity-input").forEach((input) => {
          input.addEventListener("change", (e) => {
            const itemId = parseInt(e.target.dataset.id);
            const newQuantity = parseInt(e.target.value);
            const itemToUpdate = cartItems.find(
              (item) => item.product_id === itemId
            );
            if (itemToUpdate) {
              itemToUpdate.quantity = Math.max(1, newQuantity);
              renderCart(cartItems);
            }
          });
        });
      }

      renderCart(cartItems);
    } else {
      console.log("Error in response!");
    }
  } catch (error) {
    console.log("Fetch error:", error);
  }
});

//////////////////////////End Card Script/////////////////////////////////
async function return_products_searched(Search_value) {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/Products/Search/${Search_value}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const rawData = await response.json();

    if (response.ok) {
      const keys = [
        "product_id",
        "product_name",
        "product_type",
        "kerat",
        "main_factor_type",
        "weight",
        "price_per_gram",
        "product_discount",
        "total_price",
        "labour_cost",
        "image_id",
        "image_product_id",
        "image_path",
      ];

      const products = rawData.map((item) => {
        let product = {};
        keys.forEach((key, index) => {
          product[key] = item[index];
        });
        return product;
      });

      return products;
    } else {
      console.log("Error in response!");
      return [];
    }
  } catch (error) {
    console.log("Fetch error:", error);
    return [];
  }
}

SearchForm = document.querySelector(".search-form");
const products = SearchForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  body_divi = document.querySelector(".body-div");
  if (body_divi) {
    body_divi.innerHTML = "";
    search_val = document.querySelector(".search-field").value;
    const products = await return_products_searched(search_val);
    products.forEach((product) => {
      console.log(product.image_path);
      body_divi.innerHTML += `
        <div class="card-rotate">
  <a href="#">
  <div class="product-card ${product.quantity === 0 ? "out-of-stock" : ""}">
    <!-- Front Side -->
    <div class="card-face card-front">
      <div class="image-holder">
        <img src="${product.image_path}" alt="${
        product.product_name
      }" class="img-fluid" />
      </div>
      <div class="card-detail d-flex justify-content-between align-items-baseline pt-3">
        <h3 class="card-title text-uppercase">
          ${product.product_name}
        </h3>
        <span class="item-price text-primary">$${product.total_price}</span>
      </div>
    </div>

    <!-- Back Side -->
    <div class="card-face card-back">
      <div class="p-3 text-start">
        <h5>Details</h5>
        <p><strong>Product Name:</strong> ${product.product_name}</p>
        <p><strong>Price:</strong> $${product.total_price}</p>
        <p><strong>Description:</strong>Kerat: ${product.kerat}, Factor Type: ${
        product.main_factor_type
      }, Weight: ${product.weight}, Price/G: ${product.price_per_gram}</p>
      </div>
    </div>
  </div>

  <!-- Add to Cart Button -->
  ${
    product.quantity > 0
      ? `
  <a href="#" class="btn btn-medium btn-black add-to-cart" data-id="${product.product_id}">
    Add to Cart
    <svg class="cart-outline">
      <use xlink:href="#cart-outline"></use>
    </svg>
  </a>
`
      : ""
  }

</div>

      `;
    });
  }
  body_divi.classList.add("bodyDiv");
  $(".search-popup").removeClass("is-visible");
});

document
  .querySelector(".cat-list")
  .addEventListener("click", async function (event) {
    event.preventDefault();
    console.log("Here");
    // Check if an <a> was clicked
    if (event.target.tagName === "A") {
      const searchValue = event.target.textContent.trim(); // or event.target.title
      body_divi = document.querySelector(".body-div");
      if (body_divi) {
        body_divi.innerHTML = "";
        const products = await return_products_searched(searchValue);
        products.forEach((product) => {
          console.log(product.image_path);
          body_divi.innerHTML += `
        <div class="card-rotate">
  <a href="#">
  <div class="product-card ${product.quantity === 0 ? "out-of-stock" : ""}">
    <!-- Front Side -->
    <div class="card-face card-front">
      <div class="image-holder">
        <img src="${product.image_path}" alt="${
            product.product_name
          }" class="img-fluid" />
      </div>
      <div class="card-detail d-flex justify-content-between align-items-baseline pt-3">
        <h3 class="card-title text-uppercase">
          ${product.product_name}
        </h3>
        <span class="item-price text-primary">$${product.total_price}</span>
      </div>
    </div>

    <!-- Back Side -->
    <div class="card-face card-back">
      <div class="p-3 text-start">
        <h5>Details</h5>
        <p><strong>Product Name:</strong> ${product.product_name}</p>
        <p><strong>Price:</strong> $${product.total_price}</p>
        <p><strong>Description:</strong>Kerat: ${product.kerat}, Factor Type: ${
            product.main_factor_type
          }, Weight: ${product.weight}, Price/G: ${product.price_per_gram}</p>
      </div>
    </div>
  </div>

  <!-- Add to Cart Button -->
 ${
   product.quantity > 0
     ? `
  <a href="#" class="btn btn-medium btn-black add-to-cart" data-id="${product.product_id}">
    Add to Cart
    <svg class="cart-outline">
      <use xlink:href="#cart-outline"></use>
    </svg>
  </a>
`
     : ""
 }

</div>

      `;
        });
      }
      body_divi.classList.add("bodyDiv");
      $(".search-popup").removeClass("is-visible");
    }
  });

//////////////////Discounted Products///////////////////////
async function return_products_Discounted() {
  try {
    const response = await fetch(`http://127.0.0.1:8000/Home/Discounts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 404) {
      return 404;
    }

    const rawData = await response.json();
    if (response.ok) {
      const keys = [
        "product_id",
        "product_name",
        "product_type",
        "kerat",
        "main_factor_type",
        "weight",
        "price_per_gram",
        "product_discount",
        "total_price",
        "labour_cost",
        "image_id",
        "image_product_id",
        "image_path",
        "storage_id",
        "product_id",
        "quantity",
      ];

      const products = rawData.map((item) => {
        let product = {};
        keys.forEach((key, index) => {
          product[key] = item[index];
        });
        return product;
      });

      return products;
    } else {
      console.log("Error in response!");
      return [];
    }
  } catch (error) {
    console.log("Fetch error:", error);
    return [];
  }
}
document
  .querySelector(".Discounts")
  .addEventListener("click", async function (event) {
    event.preventDefault();
    body_divi = document.querySelector(".body-div");
    body_divi.className = "body-div";
    if (body_divi) {
      body_divi.innerHTML = "";
      const products = await return_products_Discounted();
      if (products == 404) {
        body_divi.innerHTML = `<h1 class="card-title text-uppercase shadowed-h">
          No Products Found
        </h1>`;
      } else {
        products.forEach((product) => {
          console.log(product.image_path);
          body_divi.innerHTML += `
       <div class="card-rotate">
  <a href="#">
    <div class="product-card ${product.quantity === 0 ? "out-of-stock" : ""}">
      <!-- Front Side -->
      <div class="card-face card-front">
        <div class="image-holder">
          <img src="${product.image_path}" alt="${
            product.product_name
          }" class="img-fluid" />
          <span class="card-title-right text-uppercase image-change">${
            product.quantity
          }</span>
          <span class="card-title text-uppercase image-change">%${
            product.product_discount * 100
          }</span>
        </div>
        <div class="card-detail d-flex justify-content-between align-items-baseline pt-3">
          <h3 class="card-title text-uppercase">
            <a href="#">${product.product_name}</a>
          </h3>
          <span class="item-price text-primary">$${product.total_price}</span>
        </div>
      </div>

      <!-- Back Side -->
      <div class="card-face card-back">
        <div class="p-3">
          <h3>Details</h3>
          <p>Product Name: ${product.product_name}</p>
          <p>Price: $${product.total_price}</p>
          <p>Description: Kerat: ${product.kerat}, Factor Type: ${
            product.main_factor_type
          }, Weight: ${product.weight}, Price/G: ${product.price_per_gram}</p>
        </div>
      </div>
    </div>
  </a>

  <!-- Add to Cart Button -->
  ${
    product.quantity > 0
      ? `
  <a href="#" class="btn btn-medium btn-black add-to-cart" data-id="${product.product_id}">
    Add to Cart
    <svg class="cart-outline">
      <use xlink:href="#cart-outline"></use>
    </svg>
  </a>
`
      : ""
  }

</div>

      `;
        });
      }
      body_divi.classList.add("bodyDiv");
    }
    const cartButtons = document.querySelectorAll(".add-to-cart");

    cartButtons.forEach((cartButton) => {
      cartButton.addEventListener("click", async function (event) {
        event.preventDefault();

        const product_id = cartButton.getAttribute("data-id");
        const acc_id = getCookie("acc_id");

        if (acc_id) {
          try {
            const response = await fetch(
              `http://127.0.0.1:8000/Home/add-to-cart`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ product_id, acc_id }),
              }
            );

            if (response.ok) {
              console.log(await response.json());
            } else {
              console.log("Error in response!");
            }
          } catch (error) {
            console.log("Fetch error:", error);
          }
        } else {
          console.log("User is not logged in. Redirecting to login page...");
          window.location.href = "../login/login.html";
        }
      });
    });
  });
/////////////wallet Balance add/////////////////////
const acc_id = getCookie("acc_id");

if (acc_id) {
  document.querySelector(
    ".Services-list"
  ).innerHTML = `<a class="nav-link me-4 Services" href="#company-services"
                    >Services</a
                  >`;
  const anchor_wallet = document.querySelector(".Services");
  anchor_wallet.addEventListener("click", async function (event) {
    event.preventDefault();
    const body_div = document.querySelector(".body-div");
    async function new_wallet_balance() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/Home/${acc_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 404) {
          return 404;
        }

        const rawData = await response.json();
        if (response.ok) {
          console.log(rawData["wallet_balance"]);
          return rawData["wallet_balance"];
        } else {
          console.log("Error in response!");
          return [];
        }
      } catch (error) {
        console.log("Fetch error:", error);
        return [];
      }
    }
    body_div.innerHTML = `
    <div class="container">
        <div class="header">
            <div class="logo">✨ ALAMEERA Jewelry</div>
            <div class="subtitle">Luxury Collection & Fine Craftsmanship</div>
        </div>

        <div class="wallet-card">
            <div class="balance-section">
                <div class="balance-label">Current Wallet Balance</div>
                <div class="balance-amount" id="balanceAmount"></div>
            </div>

            <div class="recharge-section">
                <div class="section-title">Select Recharge Amount</div>
                <div class="recharge-buttons">
                    <button class="recharge-btn" value="100">Add $100</button>
                    <button class="recharge-btn" value="200">Add $200</button>
                    <button class="recharge-btn" value="500">Add $500</button>
                    <button class="recharge-btn" value="1000">Add $1000</button>
                </div>
            </div>
        </div>

        <div class="footer">
            Secure payments • Premium service
        </div>
    </div>

    <div class="confirmation" id="confirmation"></div>
  `;
    body_div.classList.add("body-wallet");
    let currentBalance = await new_wallet_balance();
    const balanceElement = document.getElementById("balanceAmount");
    const confirmationElement = document.getElementById("confirmation");

    function initializeBalance() {
      updateBalanceDisplay();
    }

    function addToWallet(amount) {
      currentBalance += amount;
      updateBalanceDisplay();
      showConfirmation(`$${amount} added to your wallet!`);
    }

    function resetWallet() {
      currentBalance = 0;
      updateBalanceDisplay();
      showConfirmation("Wallet balance reset to $0");
    }

    function updateBalanceDisplay() {
      balanceElement.classList.add("updating");

      setTimeout(() => {
        balanceElement.textContent = `$${currentBalance.toLocaleString()}`;
        balanceElement.classList.remove("updating");
      }, 150);
    }

    function showConfirmation(message) {
      confirmationElement.textContent = message;
      confirmationElement.classList.add("show");

      setTimeout(() => {
        confirmationElement.classList.remove("show");
      }, 3000);
    }

    // Initialize the wallet on page load
    initializeBalance();
    const recharge_buttons = document.querySelectorAll(".recharge-btn");

    recharge_buttons.forEach((button) => {
      button.addEventListener("click", async function (event) {
        event.preventDefault();
        const amount = parseInt(event.target.value);
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/Home/check-balance-add`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ acc_id, amount }),
            }
          );

          if (response.status === 200) {
            currentBalance = await new_wallet_balance();
            updateBalanceDisplay();
            showConfirmation(
              `Money Added to Account Balance By your VISA: ${amount} Added!`
            );
          } else if (response.status === 404) {
            body_div.innerHTML = `
    <div class="payment-container">
        <h1 class="form-title">Complete Payment</h1>
        
        <div class="success-message" id="successMessage">
            Payment processed successfully! Thank you for your purchase.
        </div>
        <div class="fail-message" id="failMessage">
            Payment processed Failed! Try Again Later.
        </div>

        <form id="paymentForm">
            <div class="form-group">
                <label for="fullName">Full Name</label>
                <input type="text" id="fullName" name="fullName" required>
                <div class="error-message" id="fullNameError">Please enter your full name</div>
            </div>

            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" required readonly>
                <div class="error-message" id="emailError">Please enter a valid email address</div>
            </div>

            <div class="form-group">
                <label for="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" required>
                <div class="error-message" id="phoneError">Please enter a valid phone number</div>
            </div>

            <div class="form-group">
                <label for="address">Shipping Address</label>
                <input type="text" id="address" name="address" required>
                <div class="error-message" id="addressError">Please enter your shipping address</div>
            </div>

            <div class="form-group">
                <label for="cardNumber">Credit Card Number</label>
                <input type="text" id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" required>
                <div class="error-message" id="cardNumberError">Please enter a valid card number</div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="expiry">Expiration Date</label>
                    <input type="text" id="expiry" name="expiry" placeholder="MM/YY" required>
                    <div class="error-message" id="expiryError">Please enter MM/YY format</div>
                </div>
                <div class="form-group">
                    <label for="cvv">CVV</label>
                    <input type="text" id="cvv" name="cvv" placeholder="123" required>
                    <div class="error-message" id="cvvError">Please enter a valid CVV</div>
                </div>
            </div>

            <button type="submit" class="pay-button" id="payButton" style="font-family=Poppins">
                <div class="loading" id="loading"></div>
                <span id="buttonText">Pay Now</span>
            </button>

            <div class="security-info">
                <svg class="security-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.4 16,13V16C16,17.4 15.4,18 14.8,18H9.2C8.6,18 8,17.4 8,16V13C8,12.4 8.6,11.5 9.2,11.5V10C9.2,8.6 10.6,7 12,7M12,8.2C11,8.2 10.2,9 10.2,10V11.5H13.8V10C13.8,9 13,8.2 12,8.2Z"/>
                </svg>
                Your payment information is secure
            </div>
        </form>
    </div>
    `;

            body_div.classList.remove("body-card");
            body_div.classList.add("body-checkout");
            const acc_id = getCookie("acc_id");
            try {
              const response = await fetch(
                "http://127.0.0.1:8000/checkout-balance",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify({ acc_id }),
                }
              );
              const AccountData = await response.json();
              console.log(AccountData);
              if (response.ok) {
                if (!AccountData || AccountData.length === 0) {
                  console.log("No Data Returned");
                  return;
                }
                const Name = document.querySelector(".form-group #fullName");
                const Email = document.querySelector(".form-group #email");
                Name.value = `${AccountData[0]} ${AccountData[1]}`;
                Email.value = `${AccountData[2]}`;
                if (Email.readOnly) {
                  Email.style.backgroundColor = "#e9ecef";
                  Email.style.color = "#6c757d";
                  Email.cursor = "not-allowed";
                }
              } else {
                console.log("Error in response!");
              }
            } catch (error) {
              console.log("Fetch error:", error);
            }
            // Form validation and formatting
            const form = document.getElementById("paymentForm");
            const inputs = form.querySelectorAll("input");
            const payButton = document.getElementById("payButton");
            const loading = document.getElementById("loading");
            const buttonText = document.getElementById("buttonText");
            const successMessage = document.getElementById("successMessage");
            const failMessage = document.getElementById("failMessage");
            // Card number formatting
            document
              .getElementById("cardNumber")
              .addEventListener("input", function (e) {
                let value = e.target.value
                  .replace(/\s/g, "")
                  .replace(/[^0-9]/gi, "");
                let formattedValue = value.match(/.{1,4}/g)?.join(" ") || value;
                if (formattedValue.length > 19)
                  formattedValue = formattedValue.substring(0, 19);
                e.target.value = formattedValue;
              });

            // Expiry date formatting
            document
              .getElementById("expiry")
              .addEventListener("input", function (e) {
                let value = e.target.value.replace(/\D/g, "");
                if (value.length >= 2) {
                  value = value.substring(0, 2) + "/" + value.substring(2, 4);
                }
                e.target.value = value;
              });

            // CVV formatting
            document
              .getElementById("cvv")
              .addEventListener("input", function (e) {
                e.target.value = e.target.value
                  .replace(/\D/g, "")
                  .substring(0, 4);
              });

            // Phone formatting
            document
              .getElementById("phone")
              .addEventListener("input", function (e) {
                let value = e.target.value.replace(/\D/g, "");
                if (value.length >= 6) {
                  value = value.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
                } else if (value.length >= 3) {
                  value = value.replace(/(\d{3})(\d{0,3})/, "($1) $2");
                }
                e.target.value = value;
              });

            // Real-time validation
            inputs.forEach((input) => {
              input.addEventListener("blur", validateField);
              input.addEventListener("input", clearError);
            });

            function validateField(e) {
              const field = e.target;
              const fieldName = field.name;
              let isValid = true;

              // Clear previous error
              clearError(e);

              switch (fieldName) {
                case "fullName":
                  isValid = field.value.trim().length >= 2;
                  break;
                case "email":
                  isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
                  break;
                case "phone":
                  isValid = field.value.replace(/\D/g, "").length >= 10;
                  break;
                case "address":
                  isValid = field.value.trim().length >= 5;
                  break;
                case "cardNumber":
                  isValid = field.value.replace(/\s/g, "").length >= 13;
                  break;
                case "expiry":
                  const expiry = field.value.split("/");
                  if (expiry.length === 2) {
                    const month = parseInt(expiry[0]);
                    const year = parseInt("20" + expiry[1]);
                    const now = new Date();
                    const expDate = new Date(year, month - 1);
                    isValid = month >= 1 && month <= 12 && expDate > now;
                  } else {
                    isValid = false;
                  }
                  break;
                case "cvv":
                  isValid = field.value.length >= 3;
                  break;
              }

              if (!isValid) {
                showError(field, fieldName);
              }

              return isValid;
            }

            function showError(field, fieldName) {
              field.classList.add("error");
              document
                .getElementById(fieldName + "Error")
                .classList.add("show");
            }

            function clearError(e) {
              const field = e.target;
              const fieldName = field.name;
              field.classList.remove("error");
              document
                .getElementById(fieldName + "Error")
                .classList.remove("show");
            }

            // Form submission
            form.addEventListener("submit", async function (e) {
              e.preventDefault();

              let isFormValid = true;
              inputs.forEach((input) => {
                if (!validateField({ target: input })) {
                  isFormValid = false;
                }
              });

              if (isFormValid) {
                payButton.disabled = true;
                loading.style.display = "inline-block";
                buttonText.textContent = "Processing...";
                const acc_id = getCookie("acc_id");
                let resp = 0;
                try {
                  const checkout_values = {
                    acc_id_n: acc_id,
                    fullName: document.querySelector("#fullName").value,
                    email: document.querySelector("#email").value,
                    phone: document
                      .querySelector("#phone")
                      .value.replace(/\D/g, ""),
                    address: document.querySelector("#address").value,
                    cardNumber: document
                      .querySelector("#cardNumber")
                      .value.replace(/\s+/g, ""),
                    expiry: document.querySelector("#expiry").value,
                    cvv: document.querySelector("#cvv").value,
                    amount_n: amount,
                  };
                  const response = await fetch(
                    "http://127.0.0.1:8000/add-balance",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      credentials: "include",
                      body: JSON.stringify(checkout_values),
                    }
                  );
                  if (response.ok) {
                    console.log("Payment Completed");
                    resp = 200;
                  } else {
                    console.log(await response.json());
                    console.log("Error in response!");
                    resp = 500;
                  }
                } catch (error) {
                  console.log("Fetch error:", error);
                  resp = 500;
                }
                // Simulate payment processing
                setTimeout(() => {
                  // Hide loading state
                  payButton.disabled = false;
                  loading.style.display = "none";
                  buttonText.textContent = "Pay Now";
                  if (resp == 200) {
                    // Show success message
                    successMessage.style.display = "block";
                    form.style.display = "none";
                  } else {
                    failMessage.style.display = "block";
                    form.style.display = "none";
                  }
                  // Scroll to top
                  document.querySelector(".payment-container").scrollIntoView({
                    behavior: "smooth",
                  });
                }, 2000);
              }
            });

            // Add subtle animations on focus
            inputs.forEach((input) => {
              input.addEventListener("focus", function () {
                this.parentElement.style.transform = "translateY(-2px)";
              });

              input.addEventListener("blur", function () {
                this.parentElement.style.transform = "translateY(0)";
              });
            });
          }
        } catch (error) {
          console.log("Fetch error:", error);
        }
      });
    });
  });
}
async function most_frequent_product() {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/most-frequent-product`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      most_frequent_product = await response.json();
      document.querySelector(".img-product-most-sold").src =
        most_frequent_product[2];
      document.querySelector(".price-product-most-sold").textContent =
        "$" + most_frequent_product[1];
      document.querySelector(".product-type-sold").textContent =
        most_frequent_product[0];
    } else {
      console.log("Error in response!");
    }
  } catch (error) {
    console.log("Fetch error:", error);
  }
}

most_frequent_product();

async function most_rating_product() {
  try {
    const response = await fetch(`http://127.0.0.1:8000/most-rating-product`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      most_rating_product = await response.json();
      console.log(response);
      document.querySelector(".img-product-most-rating").src =
        most_rating_product[2];
      document.querySelector(".price-product-most-rating").textContent =
        "$" + most_rating_product[1];
      document.querySelector(".product-type-rating").textContent =
        most_rating_product[0];
    } else {
      console.log("Error in response!");
    }
  } catch (error) {
    console.log("Fetch error:", error);
  }
}

most_rating_product();

async function SoldProductAllTime() {
  document.querySelector(".third-products-type").innerHTML = `
<div class="chart-container monthly-total-spent">
                    <div class="chart-bar chart-bar-RING" style="height: 10px;">
                        <div class="chart-value">0</div>
                        <div class="chart-label">RING</div>
                    </div>
                    <div class="chart-bar chart-bar-NECKLACE" style="height: 10px;">
                        <div class="chart-value">0</div>
                        <div class="chart-label">NECKLACE</div>
                    </div>
                    <div class="chart-bar chart-bar-CHAIN" style="height: 10px;">
                        <div class="chart-value">0</div>
                        <div class="chart-label">CHAIN</div>
                    </div>
                    <div class="chart-bar chart-bar-PENDANT" style="height: 10px;">
                        <div class="chart-value">0</div>
                        <div class="chart-label">PENDANT</div>
                    </div>
                    <div class="chart-bar chart-bar-EARRINGS" style="height: 10px;">
                        <div class="chart-value">0</div>
                        <div class="chart-label">EARRINGS</div>
                    </div>
                    <div class="chart-bar chart-bar-BRACELET" style="height: 10px;">
                        <div class="chart-value">0</div>
                        <div class="chart-label">BRACELET</div>
                    </div>
                </div>
`;
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/products-sold-by-category`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      products_sold = await response.json();
      const values = [];
      products_sold.forEach((entry) => {
        const category = entry[0].toUpperCase();
        const totalSold = entry[1];
        values.push(parseInt(totalSold));

        const chartValueElem = document.querySelector(
          `.chart-bar-${category} .chart-value`
        );
        if (chartValueElem) {
          chartValueElem.textContent = totalSold;
        } else {
          console.warn(`No element found for category: ${category}`);
        }
      });
      const max_value = Math.max(...values);
      products_sold.forEach((entry) => {
        const category = entry[0].toUpperCase();
        const height = (parseInt(entry[1]) / max_value) * 260;

        const chartBarElem = document.querySelector(`.chart-bar-${category}`);
        if (chartBarElem) {
          chartBarElem.style.height = height + "px";
        } else {
          console.warn(`No element found for category: ${category}`);
        }
      });
    } else {
      console.log("Error in response!");
    }
  } catch (error) {
    console.log("Fetch error:", error);
  }
}

SoldProductAllTime();
