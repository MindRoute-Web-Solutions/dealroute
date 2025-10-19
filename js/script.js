// js/script.js - VERSÃO SIMPLIFICADA E GARANTIDA

// ========== FUNÇÕES BÁSICAS ==========
function loadProducts() {
    console.log('📦 Carregando produtos...');
    if (typeof productsData !== 'undefined') {
        console.log('✅', productsData.length, 'produtos carregados');
        return productsData;
    }
    console.error('❌ productsData não encontrado');
    return [];
}

function getProductById(id) {
    const products = loadProducts();
    return products.find(product => product.id === parseInt(id));
}

// ========== EXIBIÇÃO DE PRODUTOS ==========
function displayAllProducts() {
    console.log('🎯 Exibindo todos os produtos...');
    const container = document.getElementById('all-products');
    const resultsCounter = document.getElementById('results-counter');
    
    if (!container) {
        console.error('❌ Container #all-products não encontrado');
        return;
    }
    
    const products = loadProducts();
    console.log('📋 Produtos para exibir:', products.length);
    
    if (resultsCounter) {
        resultsCounter.textContent = `${products.length} produto(s) encontrado(s)`;
    }
    
    if (products.length === 0) {
        container.innerHTML = '<p class="error-message">Nenhum produto encontrado.</p>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.imagens[0]}" alt="${product.nome}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.nome}</h3>
                <div class="product-price-container">
                    <span class="product-price-current">${product.preco}</span>
                    ${product.precoAntigo ? `<span class="product-price-old">${product.precoAntigo}</span>` : ''}
                </div>
                <p class="product-description">${product.descricaoCurta}</p>
                <div class="product-actions">
                    <a href="produto.html?id=${product.id}" class="btn btn-primary">Saiba Mais</a>
                </div>
            </div>
        </div>
    `).join('');
    
    console.log('✅ Produtos exibidos com sucesso!');
}

function displayFeaturedProducts() {
    console.log('🎯 Exibindo produtos em destaque...');
    const container = document.getElementById('featured-carousel');
    
    if (!container) {
        console.error('❌ Container #featured-carousel não encontrado');
        return;
    }
    
    const products = loadProducts().slice(0, 3);
    console.log('📋 Produtos em destaque:', products.length);
    
    container.innerHTML = products.map(product => `
        <div class="carrossel-item">
            <div class="product-card">
                <img src="${product.imagens[0]}" alt="${product.nome}" class="product-image">
                <div class="product-info">
                    <h3 class="product-name">${product.nome}</h3>
                    <div class="product-price-container">
                        <span class="product-price-current">${product.preco}</span>
                        ${product.precoAntigo ? `<span class="product-price-old">${product.precoAntigo}</span>` : ''}
                    </div>
                    <p class="product-description">${product.descricaoCurta}</p>
                    <div class="product-actions">
                        <a href="produto.html?id=${product.id}" class="btn btn-primary">Saiba Mais</a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    console.log('✅ Produtos em destaque exibidos!');
}

// ========== INICIALIZAÇÃO ==========
function initializePage() {
    console.log('🚀 Inicializando página...');
    const path = window.location.pathname;
    
    if (path.endsWith('index.html') || path.endsWith('/')) {
        displayFeaturedProducts();
    } else if (path.endsWith('produtos.html')) {
        displayAllProducts();
    }
    
    console.log('✅ Página inicializada com sucesso!');
}

// INICIAR TUDO
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Carregado - Iniciando script...');
    initializePage();
});

// DEBUG FINAL
window.addEventListener('load', function() {
    console.log('🏁 Página totalmente carregada');
    console.log('=================================');
});