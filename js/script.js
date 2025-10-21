// js/script.js - FUNÇÕES COMPLETAS E CORRIGIDAS

// ========== FUNÇÕES DE CARREGAMENTO DE PRODUTOS ==========

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

function getProductsByCategory(category) {
    const products = loadProducts();
    return products.filter(product => product.categoria === category);
}

// ========== FUNÇÕES DO CARROSSEL ==========

function displayFeaturedProducts() {
    console.log('🎯 Exibindo produtos em destaque...');
    const carouselContainer = document.getElementById('featured-carousel');
    const secondaryContainer = document.getElementById('secondary-products');
    
    if (!carouselContainer) {
        console.error('❌ Container #featured-carousel não encontrado');
        return;
    }
    
    const products = loadProducts();
    console.log('📋 Total de produtos:', products.length);
    
    // Separar produtos: primeiros 4 para carrossel principal, resto para carrossel secundário
    const featuredProducts = products.slice(0, 4);
    const secondaryProducts = products.slice(4);
    
    // Carrossel Principal
    carouselContainer.innerHTML = featuredProducts.map(product => `
        <div class="carrossel-item">
            <div class="product-card">
                <img src="${product.imagens[0]}" alt="${product.nome}" class="product-image" loading="lazy">
                <div class="product-info">
                    <h3 class="product-name">${product.nome}</h3>
                    <div class="product-price-container">
                        <span class="product-price-current">${product.preco}</span>
                        ${product.precoAntigo ? `<span class="product-price-old">${product.precoAntigo}</span>` : ''}
                    </div>
                    <p class="product-description">${product.descricaoCurta || product.descricao.substring(0, 70)}...</p>
                    ${product.caracteristicas ? `
                    <div class="product-features">
                        ${product.caracteristicas.slice(0, 2).map(caracteristica => `
                            <div class="product-feature">
                                <i class="fas fa-check"></i>
                                <span>${caracteristica}</span>
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                    <div class="product-actions">
                        <a href="produto.html?id=${product.id}" class="btn btn-primary">Saiba Mais</a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Carrossel Secundário (Mais Produtos em Destaque)
    if (secondaryProducts.length > 0 && secondaryContainer) {
        // Desktop: Carrossel com setas, Mobile: Grid
        if (window.innerWidth > 768) {
            secondaryContainer.innerHTML = `
                <h3 class="section-subtitle">Mais Produtos em Destaque</h3>
                <div class="carrossel-container secondary-carousel">
                    <button class="carrossel-btn prev secondary-prev" aria-label="Produtos anteriores">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    
                    <div class="carrossel secondary-carrossel" id="secondary-carousel">
                        ${secondaryProducts.map(product => `
                            <div class="carrossel-item">
                                <div class="product-card">
                                    <img src="${product.imagens[0]}" alt="${product.nome}" class="product-image" loading="lazy">
                                    <div class="product-info">
                                        <h3 class="product-name">${product.nome}</h3>
                                        <div class="product-price-container">
                                            <span class="product-price-current">${product.preco}</span>
                                            ${product.precoAntigo ? `<span class="product-price-old">${product.precoAntigo}</span>` : ''}
                                        </div>
                                        <p class="product-description">${product.descricaoCurta || product.descricao.substring(0, 80)}...</p>
                                        ${product.caracteristicas ? `
                                        <div class="product-features">
                                            ${product.caracteristicas.slice(0, 2).map(caracteristica => `
                                                <div class="product-feature">
                                                    <i class="fas fa-check"></i>
                                                    <span>${caracteristica}</span>
                                                </div>
                                            `).join('')}
                                        </div>
                                        ` : ''}
                                        <div class="product-actions">
                                            <a href="produto.html?id=${product.id}" class="btn btn-primary">Saiba Mais</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <button class="carrossel-btn next secondary-next" aria-label="Próximos produtos">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            `;
            
            // Inicializar carrossel secundário para desktop
            initializeSecondaryCarousel();
        } else {
            // Mobile: Grid normal
            secondaryContainer.innerHTML = `
                <h3 class="section-subtitle">Mais Produtos em Destaque</h3>
                <div class="products-grid">
                    ${secondaryProducts.map(product => `
                        <div class="product-card">
                            <img src="${product.imagens[0]}" alt="${product.nome}" class="product-image" loading="lazy">
                            <div class="product-info">
                                <h3 class="product-name">${product.nome}</h3>
                                <div class="product-price-container">
                                    <span class="product-price-current">${product.preco}</span>
                                    ${product.precoAntigo ? `<span class="product-price-old">${product.precoAntigo}</span>` : ''}
                                </div>
                                <p class="product-description">${product.descricaoCurta || product.descricao.substring(0, 80)}...</p>
                                ${product.caracteristicas ? `
                                <div class="product-features">
                                    ${product.caracteristicas.slice(0, 2).map(caracteristica => `
                                        <div class="product-feature">
                                            <i class="fas fa-check"></i>
                                            <span>${caracteristica}</span>
                                        </div>
                                    `).join('')}
                                </div>
                                ` : ''}
                                <div class="product-actions">
                                    <a href="produto.html?id=${product.id}" class="btn btn-primary">Saiba Mais</a>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    } else if (secondaryContainer) {
        secondaryContainer.innerHTML = '';
    }
    
    // Inicializar carrossel principal
    initializeCarousel();
    console.log('✅ Produtos em destaque exibidos!');
}

function initializeCarousel() {
    const carousel = document.getElementById('featured-carousel');
    const prevBtn = document.querySelector('.carrossel-btn.prev');
    const nextBtn = document.querySelector('.carrossel-btn.next');
    
    if (!carousel || !prevBtn || !nextBtn) return;
    
    const scrollAmount = 320;
    
    prevBtn.addEventListener('click', () => {
        carousel.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });
    
    nextBtn.addEventListener('click', () => {
        carousel.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
    
    function updateButtonVisibility() {
        const isAtStart = carousel.scrollLeft === 0;
        const isAtEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 10;
        
        prevBtn.style.display = isAtStart ? 'none' : 'flex';
        nextBtn.style.display = isAtEnd ? 'none' : 'flex';
    }
    
    carousel.addEventListener('scroll', updateButtonVisibility);
    updateButtonVisibility();
}

// Adicione esta nova função para o carrossel secundário
function initializeSecondaryCarousel() {
    const carousel = document.getElementById('secondary-carousel');
    const prevBtn = document.querySelector('.secondary-carousel .prev');
    const nextBtn = document.querySelector('.secondary-carousel .next');
    
    if (!carousel || !prevBtn || !nextBtn) return;
    
    const scrollAmount = 320;
    
    prevBtn.addEventListener('click', () => {
        carousel.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });
    
    nextBtn.addEventListener('click', () => {
        carousel.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
    
    function updateButtonVisibility() {
        const isAtStart = carousel.scrollLeft === 0;
        const isAtEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 10;
        
        prevBtn.style.display = isAtStart ? 'none' : 'flex';
        nextBtn.style.display = isAtEnd ? 'none' : 'flex';
    }
    
    carousel.addEventListener('scroll', updateButtonVisibility);
    updateButtonVisibility();
}

// ========== FUNÇÕES DE EXIBIÇÃO ==========

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
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>Nenhum produto encontrado</h3>
                <p>Tente ajustar os termos da busca ou filtros.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.imagens[0]}" alt="${product.nome}" class="product-image" loading="lazy">
            <div class="product-info">
                <h3 class="product-name">${product.nome}</h3>
                <div class="product-price-container">
                    <span class="product-price-current">${product.preco}</span>
                    ${product.precoAntigo ? `<span class="product-price-old">${product.precoAntigo}</span>` : ''}
                </div>
                <p class="product-description">${product.descricaoCurta || product.descricao.substring(0, 80)}...</p>
                ${product.caracteristicas ? `
                <div class="product-features">
                    ${product.caracteristicas.slice(0, 2).map(caracteristica => `
                        <div class="product-feature">
                            <i class="fas fa-check"></i>
                            <span>${caracteristica}</span>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                <div class="product-actions">
                    <a href="produto.html?id=${product.id}" class="btn btn-primary">Saiba Mais</a>
                </div>
            </div>
        </div>
    `).join('');
    
    // Inicializar filtros
    initializeProductFilters();
    console.log('✅ Todos os produtos exibidos!');
}

function displayProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    const productContainer = document.getElementById('product-details');
    
    if (!productId) {
        if (productContainer) {
            productContainer.innerHTML = '<p class="error-message">Produto não encontrado.</p>';
        }
        return;
    }
    
    const product = getProductById(productId);
    
    if (!product || !productContainer) {
        productContainer.innerHTML = '<p class="error-message">Produto não encontrado.</p>';
        return;
    }
    
    // Atualizar título da página
    document.title = `${product.nome} - DealRoute`;
    
    // Calcular desconto
    const discount = product.precoAntigo ? calculateDiscount(product.precoAntigo, product.preco) : null;
    
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
        <div class="product-info-detailed">
            <h1 class="product-title">${product.nome}</h1>
            
            <div class="product-pricing">
                ${product.precoAntigo ? `
                    <span class="price-old">${product.precoAntigo}</span>
                    ${discount ? `<span class="discount-badge">${discount}% OFF</span>` : ''}
                ` : ''}
                <span class="price-current">${product.preco}</span>
            </div>
            
            <div class="product-description-detailed">
                <p>${product.descricao}</p>
            </div>
            
            ${product.caracteristicas ? `
            <div class="product-features-detailed">
                <h3 class="specs-title">Principais Características</h3>
                <div class="features-grid">
                    ${product.caracteristicas.map(caracteristica => `
                        <div class="feature-item">
                            <i class="fas fa-check"></i>
                            <span class="feature-text">${caracteristica}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            <a href="${product.link_afiliado}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-large">
                <i class="fas fa-shopping-cart"></i> Comprar Agora
            </a>
        </div>
    `;
    
    // Exibir produtos relacionados
    displayRelatedProducts(productId, product.categoria);
    console.log('✅ Página do produto exibida!');
}

function calculateDiscount(oldPrice, currentPrice) {
    const old = parseFloat(oldPrice.replace('R$', '').replace('.', '').replace(',', '.').trim());
    const current = parseFloat(currentPrice.replace('R$', '').replace('.', '').replace(',', '.').trim());
    return Math.round(((old - current) / old) * 100);
}

function displayRelatedProducts(currentProductId, category) {
    const relatedContainer = document.getElementById('related-products');
    
    if (!relatedContainer) return;
    
    const relatedProducts = getProductsByCategory(category);
    const filteredProducts = relatedProducts.filter(product => product.id !== currentProductId).slice(0, 4);
    
    if (filteredProducts.length === 0) {
        const allProducts = loadProducts();
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
                                <div class="product-price-container">
                                    <span class="product-price-current">${product.preco}</span>
                                    ${product.precoAntigo ? `<span class="product-price-old">${product.precoAntigo}</span>` : ''}
                                </div>
                                <div class="product-actions">
                                    <a href="produto.html?id=${product.id}" class="btn btn-primary">Saiba Mais</a>
                                </div>
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
                        <div class="product-price-container">
                            <span class="product-price-current">${product.preco}</span>
                            ${product.precoAntigo ? `<span class="product-price-old">${product.precoAntigo}</span>` : ''}
                        </div>
                        <div class="product-actions">
                            <a href="produto.html?id=${product.id}" class="btn btn-primary">Saiba Mais</a>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ========== SISTEMA DE BUSCA E FILTROS ==========

function initializeProductFilters() {
    const searchInput = document.getElementById('product-search');
    const categoryFilter = document.getElementById('category-filter');
    
    if (searchInput) {
        let timeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(filterProducts, 300);
        });
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
}

function filterProducts() {
    const products = loadProducts();
    const searchTerm = document.getElementById('product-search')?.value.toLowerCase() || '';
    const category = document.getElementById('category-filter')?.value || '';
    
    const filtered = products.filter(product => {
        const matchesSearch = product.nome.toLowerCase().includes(searchTerm) || 
                            product.descricao.toLowerCase().includes(searchTerm) ||
                            product.descricaoCurta.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || product.categoria === category;
        return matchesSearch && matchesCategory;
    });
    
    displayFilteredProducts(filtered);
}

function displayFilteredProducts(filteredProducts) {
    const productsContainer = document.getElementById('all-products');
    const resultsCounter = document.getElementById('results-counter');
    
    if (!productsContainer) return;
    
    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>Nenhum produto encontrado</h3>
                <p>Tente ajustar os termos da busca ou filtros.</p>
            </div>
        `;
    } else {
        productsContainer.innerHTML = filteredProducts.map(product => `
            <div class="product-card">
                <img src="${product.imagens[0]}" alt="${product.nome}" class="product-image" loading="lazy">
                <div class="product-info">
                    <h3 class="product-name">${product.nome}</h3>
                    <div class="product-price-container">
                        <span class="product-price-current">${product.preco}</span>
                        ${product.precoAntigo ? `<span class="product-price-old">${product.precoAntigo}</span>` : ''}
                    </div>
                    <p class="product-description">${product.descricaoCurta || product.descricao.substring(0, 80)}...</p>
                    ${product.caracteristicas ? `
                    <div class="product-features">
                        ${product.caracteristicas.slice(0, 2).map(caracteristica => `
                            <div class="product-feature">
                                <i class="fas fa-check"></i>
                                <span>${caracteristica}</span>
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                    <div class="product-actions">
                        <a href="produto.html?id=${product.id}" class="btn btn-primary">Saiba Mais</a>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    if (resultsCounter) {
        resultsCounter.textContent = `${filteredProducts.length} produto(s) encontrado(s)`;
    }
}

// ========== BOTÕES FLUTUANTES ==========

function initializeFloatingButtons() {
    if (window.innerWidth > 768) return;
    
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'floating-btn back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.setAttribute('aria-label', 'Voltar ao topo');
    backToTopBtn.style.display = 'none';
    
    const whatsappBtn = document.createElement('button');
    whatsappBtn.className = 'floating-btn whatsapp';
    whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
    whatsappBtn.setAttribute('aria-label', 'Fale conosco no WhatsApp');
    
    const floatingContainer = document.createElement('div');
    floatingContainer.className = 'floating-buttons';
    floatingContainer.appendChild(backToTopBtn);
    floatingContainer.appendChild(whatsappBtn);
    
    document.body.appendChild(floatingContainer);
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    whatsappBtn.addEventListener('click', () => {
        const phoneNumber = '5511999999999';
        const message = 'Olá! Gostaria de mais informações sobre os produtos.';
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    });
}

// ========== INICIALIZAÇÃO GLOBAL ==========

function initializePage() {
    console.log('🚀 Inicializando página...');
    const path = window.location.pathname;
    
    if (path.endsWith('index.html') || path.endsWith('/')) {
        displayFeaturedProducts();
    } else if (path.endsWith('produtos.html')) {
        displayAllProducts();
    } else if (path.endsWith('produto.html')) {
        displayProduct();
    }
    
    initializeFloatingButtons();
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