
fetch('https://dummyjson.com/products?limit=10')
  .then(response => {
    if (!response.ok) {
      throw new Error('Gagal mengambil data produk');
    }
    return response.json();
  })
  .then(data => {
    console.log('Data produk:', data.products);
  })
  .catch(error => {
    console.error('Terjadi kesalahan:', error);
  });
