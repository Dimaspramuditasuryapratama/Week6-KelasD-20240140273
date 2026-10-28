
/**
 * @file form.js — validasi form dan pembuat caption produk.
 */

const templates = {
  promo: (nama, harga, tag) => `🔥 PROMO SPESIAL HARI INI! 🔥

Kenalan dengan ${nama} — produk yang wajib kamu coba!

💜 Harga spesial: ${harga}
✨ Pilihan menarik untuk melengkapi harimu.
📦 Pesan sekarang sebelum kehabisan!

Jangan sampai ketinggalan. Hubungi kami untuk informasi dan pemesanan.

#Promo #${tag} #Diskon #BelanjaHemat`,

  santai: (nama, harga, tag) => `Hai bestie! 👋✨

Lagi cari ${nama}? Pas banget, kamu mampir ke tempat yang tepat 😎

Cukup ${harga} untuk membawa produk ini pulang. Cocok buat dipakai sendiri atau jadi hadiah buat orang tersayang 🎁

Yuk, chat kalau mau tanya-tanya dulu!

#${tag} #RekomendasiProduk #RacunBelanja #WorthIt`,

  formal: (nama, harga, tag) => `Kami memperkenalkan ${nama}, pilihan tepat untuk Anda.

Harga: ${harga}

Kami berkomitmen memberikan pengalaman berbelanja yang nyaman dengan informasi produk yang jelas dan layanan yang responsif.

Untuk pemesanan dan informasi lebih lanjut, silakan hubungi kami melalui pesan langsung. Terima kasih atas kepercayaan Anda.

#${tag} #ProdukBerkualitas #BelanjaAman`
};

const form = document.getElementById("form");
const captionOutput = document.getElementById("caption");
const copyButton = document.getElementById("copyButton");
const copyStatus = document.getElementById("copyStatus");

// Aturan validasi input
const rules = {
  nama: (value) => {
    const name = value.trim();

    if (!name) return "Nama produk wajib diisi.";
    if (name.length < 3) return "Nama produk minimal 3 karakter.";
    if (name.length > 60) return "Nama produk maksimal 60 karakter.";
    if (!/\p{L}/u.test(name)) {
      return "Nama produk harus mengandung huruf.";
    }

    return "";
  },

  harga: (value) => {
    if (!value) return "Harga wajib diisi.";

    const number = Number(value);

    if (!Number.isInteger(number)) {
      return "Harga harus berupa angka bulat.";
    }

    if (number < 1000) return "Harga minimal Rp 1.000.";

    if (number > 100000000) {
      return "Harga maksimal Rp 100.000.000.";
    }

    return "";
  }
};

// Validasi satu input
function validate(id) {
  const input = document.getElementById(id);
  const message = rules[id](input.value);

  document.getElementById(`${id}-error`).textContent = message;

  input.setAttribute(
    "aria-invalid",
    message ? "true" : "false"
  );

  return !message;
}

// Periksa input saat pengguna mengetik
Object.keys(rules).forEach((id) => {
  document.getElementById(id).addEventListener("input", () => {
    validate(id);
    copyStatus.textContent = "";
  });
});

// Proses pembuatan caption
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const invalidIds = Object.keys(rules)
    .filter((id) => !validate(id));

  if (invalidIds.length) {
    document.getElementById(invalidIds[0]).focus();
    captionOutput.value = "";
    return;
  }

  const nama = document.getElementById("nama").value.trim();

  const harga = Number(
    document.getElementById("harga").value
  ).toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  });

  const template = document.getElementById("template").value;

  const tag = nama
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .trim()
    .split(/\s+/)
    .map((word) =>
      word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join("");

  captionOutput.value = templates[template](nama, harga, tag);

  copyStatus.textContent = "Caption berhasil dibuat.";
});

// Tombol salin caption
copyButton.addEventListener("click", async () => {
  if (!captionOutput.value.trim()) {
    copyStatus.textContent = "Buat caption terlebih dahulu.";
    return;
  }

  try {
    await navigator.clipboard.writeText(captionOutput.value);
    copyStatus.textContent = "Caption berhasil disalin!";

  } catch {
    captionOutput.focus();
    captionOutput.select();

    const copied = document.execCommand("copy");

    copyStatus.textContent = copied
      ? "Caption berhasil disalin!"
      : "Pilih teks caption lalu salin secara manual.";
  }
});
