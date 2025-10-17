// js/script.js
// Carregar produtos do JSON
async function loadProducts() {
    try {
        const response = await fetch('data/produtos.json');
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        return [];
    }
}

// Exibir produtos na página inicial (apenas os primeiros 4)
async function displayFeaturedProducts() {
    const products = await loadProducts();
    const featuredContainer = document.getElementById('featured-products');
    
    if (!featuredContainer) return;
    
    // Limitar a 4 produtos para a página inicial
    const featuredProducts = products.slice(0, 4);
    
    featuredContainer.innerHTML = featuredProducts.map(product => `
        <div class="product-card">
            <img src="${product.imagens[0]}" alt="${product.nome}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.nome}</h3>
                <p class="product-price">${product.preco}</p>
                <p class="product-description">${product.descricao.substring(0, 100)}...</p>
                <a href="produto.html?id=${product.id}" class="btn btn-primary">Saiba Mais</a>
            </div>
        </div>
    `).join('');
}

// Exibir todos os produtos na página de produtos
async function displayAllProducts() {
    const products = await loadProducts();
    const productsContainer = document.getElementById('all-products');
    
    if (!productsContainer) return;
    
    productsContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.imagens[0]}" alt="${product.nome}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.nome}</h3>
                <p class="product-price">${product.preco}</p>
                <p class="product-description">${product.descricao.substring(0, 100)}...</p>
                <a href="produto.html?id=${product.id}" class="btn btn-primary">Saiba Mais</a>
            </div>
        </div>
    `).join('');
}

// Exibir produto individual
async function displayProduct() {
    // Obter ID do produto da query string
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) {
        document.getElementById('product-details').innerHTML = '<p>Produto não encontrado.</p>';
        return;
    }
    
    const products = await loadProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        document.getElementById('product-details').innerHTML = '<p>Produto não encontrado.</p>';
        return;
    }
    
    // Atualizar título da página
    document.title = `${product.nome} - TechStore`;
    
    // Exibir produto
    const productContainer = document.getElementById('product-details');
    productContainer.innerHTML = `
        <div class="product-gallery">
            <div class="main-image">
                <img src="${product.imagens[0]}" alt="${product.nome}" id="main-product-image">
            </div>
            <div class="thumbnail-images">
                ${product.imagens.map((img, index) => `
                    <img src="${img}" alt="${product.nome}" class="thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
                `).join('')}
            </div>
        </div>
        <div class="product-info">
            <h1 class="product-title">${product.nome}</h1>
            <p class="product-price">${product.preco}</p>
            <div class="product-description">
                <p>${product.descricao}</p>
            </div>
            <a href="${product.link_afiliado}" target="_blank" class="btn btn-primary btn-large">Comprar Agora</a>
        </div>
    `;
    
    // Exibir produtos relacionados (excluindo o produto atual)
    const relatedProducts = products.filter(p => p.id !== productId).slice(0, 4);
    const relatedContainer = document.getElementById('related-products');
    
    if (relatedContainer && relatedProducts.length > 0) {
        relatedContainer.innerHTML = `
            <h2 class="section-title">Produtos Relacionados</h2>
            <div class="products-grid">
                ${relatedProducts.map(p => `
                    <div class="product-card">
                        <img src="${p.imagens[0]}" alt="${p.nome}" class="product-image">
                        <div class="product-info">
                            <h3 class="product-name">${p.nome}</h3>
                            <p class="product-price">${p.preco}</p>
                            <a href="produto.html?id=${p.id}" class="btn btn-primary">Saiba Mais</a>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// Inicializar funções baseadas na página atual
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    
    if (path.endsWith('index.html') || path.endsWith('/')) {
        displayFeaturedProducts();
    } else if (path.endsWith('produtos.html')) {
        displayAllProducts();
    } else if (path.endsWith('produto.html')) {
        displayProduct();
    }
});