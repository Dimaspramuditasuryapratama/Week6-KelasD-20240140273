
/**
 * @file index.js — katalog produk NovaStore.
 * Mengambil data dari DummyJSON API, menampilkan gambar produk,
 * serta mendukung pencarian, filter kategori, dan muat ulang.
 */

const API_URL = "https://dummyjson.com/products?limit=100";

const statusEl = document.getElementById("status");
const gridEl = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const reloadButton = document.getElementById("reloadButton");
const resultCount = document.getElementById("resultCount");

let allProducts = [];

function formatPrice(usd) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(usd);
}

function renderProducts(products) {
  gridEl.innerHTML = "";
  resultCount.textContent = `${products.length} produk`;

  if (products.length === 0) {
    statusEl.textContent =
      "Produk tidak ditemukan. Coba kata kunci lain.";
    statusEl.classList.remove("error");
    statusEl.style.display = "block";

    gridEl.innerHTML =
      '<div class="empty-state">Belum ada produk yang cocok dengan pencarianmu.</div>';
    return;
  }

  statusEl.style.display = "none";

  const fragment = document.createDocumentFragment();

  products.forEach((product, index) => {
    const card = document.createElement("article");
    card.className = "card";
    card.style.animationDelay =
      `${Math.min(index % 12, 11) * 45}ms`;

    const isLowStock = product.stock < 10;

    const badge = document.createElement("span");
    badge.className = `stock-badge${isLowStock ? " low" : ""}`;
    badge.textContent = isLowStock ? "Stok menipis" : "Tersedia";

    // Membuat gambar produk
    const thumbWrap = document.createElement("div");
    thumbWrap.className = "thumb-wrap";

    const image = document.createElement("img");
    image.src = product.thumbnail;
    image.alt = product.title;
    image.loading = "lazy";
    image.decoding = "async";
    image.className = "image-loading";

    // Gambar muncul setelah selesai dimuat
    image.addEventListener("load", () => {
      image.classList.remove("image-loading");
    }, { once: true });

    image.addEventListener("error", () => {
      image.classList.remove("image-loading");
      image.alt = "Gambar produk tidak tersedia";
      image.style.opacity = "0.35";
    }, { once: true });

    thumbWrap.appendChild(image);

    // Informasi produk
    const body = document.createElement("div");
    body.className = "body";

    const category = document.createElement("div");
    category.className = "category";
    category.textContent = product.category || "Produk";

    const title = document.createElement("h3");
    title.textContent = product.title;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent =
      `${product.brand || "Tanpa merek"} · stok ${product.stock}`;

    // Harga, diskon, dan rating
    const footerRow = document.createElement("div");
    footerRow.className = "footer-row";

    const price = document.createElement("div");
    price.className = "price-tag";
    price.append(document.createTextNode(formatPrice(product.price)));

    const discount = document.createElement("span");
    discount.className = "discount";
    discount.textContent =
      `Diskon ${Math.round(product.discountPercentage)}%`;

    price.appendChild(discount);

    const rating = document.createElement("div");
    rating.className = "rating";
    rating.textContent = `★ ${Number(product.rating).toFixed(1)}`;

    footerRow.append(price, rating);
    body.append(category, title, meta, footerRow);
    card.append(badge, thumbWrap, body);

    fragment.appendChild(card);
  });

  gridEl.appendChild(fragment);
}

function populateCategoryOptions(products) {
  const currentValue = categorySelect.value;

  const categories = [
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    )
  ].sort();

  categorySelect.innerHTML =
    '<option value="">Semua kategori</option>';

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category.replaceAll("-", " ");
    categorySelect.appendChild(option);
  });

  if (categories.includes(currentValue)) {
    categorySelect.value = currentValue;
  }
}

function applyFilters() {
  const keyword = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;

  const filtered = allProducts.filter((product) => {
    const searchableText =
      `${product.title} ${product.brand || ""} ${product.category || ""}`
        .toLowerCase();

    return searchableText.includes(keyword) &&
      (!category || product.category === category);
  });

  renderProducts(filtered);
}

async function fetchProducts() {
  reloadButton.disabled = true;
  reloadButton.classList.add("is-loading");

  reloadButton.querySelector(".reload-icon").textContent = "↻";

  statusEl.textContent = "Sedang mengambil produk terbaru...";
  statusEl.classList.remove("error");
  statusEl.style.display = "block";

  gridEl.innerHTML = "";
  resultCount.textContent = "Memuat...";

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Permintaan gagal (${response.status})`);
    }

    const data = await response.json();

    if (!Array.isArray(data.products)) {
      throw new Error("Format data produk tidak sesuai.");
    }

    allProducts = data.products;

    populateCategoryOptions(allProducts);
    applyFilters();

  } catch (error) {
    statusEl.textContent =
      `Gagal memuat produk: ${error.message}. Periksa koneksi internet lalu coba lagi.`;

    statusEl.classList.add("error");
    statusEl.style.display = "block";
    resultCount.textContent = "Data belum tersedia";

    console.error("Fetch error:", error);

  } finally {
    reloadButton.disabled = false;
    reloadButton.classList.remove("is-loading");
  }
}

// Event pencarian dan filter
searchInput.addEventListener("input", applyFilters);
categorySelect.addEventListener("change", applyFilters);

// Tombol muat ulang produk
reloadButton.addEventListener("click", fetchProducts);

// Ambil data saat halaman dibuka
document.addEventListener("DOMContentLoaded", fetchProducts);

app.use(express.static('public'))