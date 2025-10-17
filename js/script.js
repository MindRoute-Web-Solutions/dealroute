// js/script.js - FUNÇÕES GLOBAIS E PRINCIPAIS

// ========== FUNÇÕES DE CARREGAMENTO DE PRODUTOS ==========

/**
 * Carrega todos os produtos disponíveis
 * @returns {Array} Lista de produtos
 */
async function loadProducts() {
    return typeof productsData !== 'undefined' ? productsData : [];
}

/**
 * Encontra um produto pelo ID
 * @param {number} id - ID do produto
 * @returns {Object} Produto encontrado
 */
async function getProductById(id) {
    const products = await loadProducts();
    return products.find(product => product.id === parseInt(id));
}

/**
 * Filtra produtos por categoria
 * @param {string} category - Categoria para filtrar
 * @returns {Array} Produtos da categoria
 */
async function getProductsByCategory(category) {
    const products = await loadProducts();
    return products.filter(product => product.categoria === category);
}

// ========== FUNÇÕES DE EXIBIÇÃO ==========

/**
 * Exibe produtos em destaque na página inicial
 */
async function displayFeaturedProducts() {
    const products = await loadProducts();
    const featuredContainer = document.getElementById('featured-products');
    
    if (!featuredContainer) return;
    
    // Limitar a 4 produtos para a página inicial
    const featuredProducts = products.slice(0, 4);
    
    featuredContainer.innerHTML = featuredProducts.map(product => `
        <div class="product-card">
            <img src="${product.imagens[0]}" alt="${product.nome}" class="product-image" loading="lazy">
            <div class="product-info">
                <h3 class="product-name">${product.nome}</h3>
                <p class="product-price">${product.preco}</p>
                <p class="product-description">${product.descricao.substring(0, 100)}...</p>
                <a href="produto.html?id=${product.id}" class="btn btn-primary">Saiba Mais</a>
            </div>
        </div>
    `).join('');
}

/**
 * Exibe todos os produtos na página de produtos
 */
async function displayAllProducts() {
    const products = await loadProducts();
    const productsContainer = document.getElementById('all-products');
    
    if (!productsContainer) return;
    
    productsContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.imagens[0]}" alt="${product.nome}" class="product-image" loading="lazy">
            <div class="product-info">
                <h3 class="product-name">${product.nome}</h3>
                <p class="product-price">${product.preco}</p>
                <p class="product-description">${product.descricao.substring(0, 100)}...</p>
                <a href="produto.html?id=${product.id}" class="btn btn-primary">Saiba Mais</a>
            </div>
        </div>
    `).join('');
}

/**
 * Exibe um produto individual na página de produto
 */
async function displayProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    const productContainer = document.getElementById('product-details');
    
    if (!productId) {
        productContainer.innerHTML = '<p class="error-message">Produto não encontrado.</p>';
        return;
    }
    
    const product = await getProductById(productId);
    
    if (!product) {
        productContainer.innerHTML = '<p class="error-message">Produto não encontrado.</p>';
        return;
    }
    
    // Atualizar título da página
    document.title = `${product.nome} - TechStore`;
    
    // Atualizar meta description para SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', `${product.nome} - ${product.descricao.substring(0, 160)}...`);
    }
    
    // Exibir produto
    productContainer.innerHTML = `
        <div class="product-gallery">
            <div class="main-image">
                <img src="${product.imagens[0]}" alt="${product.nome}" id="main-product-image" loading="eager">
            </div>
            <div class="thumbnail-images">
                ${product.imagens.map((img, index) => `
                    <img src="${img}" alt="${product.nome} - Imagem ${index + 1}" class="thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}" loading="lazy">
                `).join('')}
            </div>
        </div>
        <div class="product-info">
            <h1 class="product-title">${product.nome}</h1>
            <p class="product-price">${product.preco}</p>
            <div class="product-description">
                <p>${product.descricao}</p>
            </div>
            <a href="${product.link_afiliado}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-large">Comprar Agora</a>
        </div>
    `;
    
    // Exibir produtos relacionados
    await displayRelatedProducts(productId, product.categoria);
}

/**
 * Exibe produtos relacionados
 * @param {number} currentProductId - ID do produto atual
 * @param {string} category - Categoria para filtro
 */
async function displayRelatedProducts(currentProductId, category) {
    const relatedContainer = document.getElementById('related-products');
    
    if (!relatedContainer) return;
    
    // Buscar produtos da mesma categoria, excluindo o atual
    const relatedProducts = await getProductsByCategory(category);
    const filteredProducts = relatedProducts.filter(product => product.id !== currentProductId).slice(0, 4);
    
    if (filteredProducts.length === 0) {
        // Se não houver produtos na mesma categoria, mostrar produtos aleatórios
        const allProducts = await loadProducts();
        const randomProducts = allProducts
            .filter(product => product.id !== currentProductId)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
        
        if (randomProducts.length > 0) {
            relatedContainer.innerHTML = `
                <h2 class="section-title">Você Também Pode Gostar</h2>
                <div class="products-grid">
                    ${randomProducts.map(product => `
                        <div class="product-card">
                            <img src="${product.imagens[0]}" alt="${product.nome}" class="product-image" loading="lazy">
                            <div class="product-info">
                                <h3 class="product-name">${product.nome}</h3>
                                <p class="product-price">${product.preco}</p>
                                <a href="produto.html?id=${product.id}" class="btn btn-primary">Saiba Mais</a>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        return;
    }
    
    relatedContainer.innerHTML = `
        <h2 class="section-title">Produtos Relacionados</h2>
        <div class="products-grid">
            ${filteredProducts.map(product => `
                <div class="product-card">
                    <img src="${product.imagens[0]}" alt="${product.nome}" class="product-image" loading="lazy">
                    <div class="product-info">
                        <h3 class="product-name">${product.nome}</h3>
                        <p class="product-price">${product.preco}</p>
                        <a href="produto.html?id=${product.id}" class="btn btn-primary">Saiba Mais</a>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ========== INICIALIZAÇÃO GLOBAL ==========

/**
 * Inicializa as funções baseadas na página atual
 */
function initializePage() {
    const path = window.location.pathname;
    
    if (path.endsWith('index.html') || path.endsWith('/')) {
        displayFeaturedProducts();
    } else if (path.endsWith('produtos.html')) {
        displayAllProducts();
    } else if (path.endsWith('produto.html')) {
        displayProduct();
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initializePage);