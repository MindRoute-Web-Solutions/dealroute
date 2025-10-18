// js/script.js - FUNÇÕES GLOBAIS E PRINCIPAIS ATUALIZADAS

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

// ========== FUNÇÕES DO CARROSSEL ==========

/**
 * Exibe produtos em destaque no carrossel
 */
async function displayFeaturedProducts() {
    const products = await loadProducts();
    
    const carouselContainer = document.getElementById('featured-carousel');
    const secondaryContainer = document.getElementById('secondary-products');
    
    if (!carouselContainer) return;
    
    // Mostrar loading
    carouselContainer.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Carregando produtos em destaque...</p>
        </div>
    `;
    
    // Separar produtos: primeiros 10 vão para o carrossel, resto para grid
    const featuredProducts = products.slice(0, 10);
    const secondaryProducts = products.slice(10);
    
    // Carrossel Principal (até 10 produtos)
    setTimeout(() => {
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
        
        // Inicializar funcionalidades do carrossel
        initializeCarousel();
    }, 500);
    
    // Grid Secundário (produtos 11+)
    if (secondaryProducts.length > 0 && secondaryContainer) {
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
    } else if (secondaryContainer) {
        secondaryContainer.innerHTML = '';
    }
}

/**
 * Inicializa a funcionalidade do carrossel
 */
function initializeCarousel() {
    const carousel = document.getElementById('featured-carousel');
    const prevBtn = document.querySelector('.carrossel-btn.prev');
    const nextBtn = document.querySelector('.carrossel-btn.next');
    
    if (!carousel || !prevBtn || !nextBtn) return;
    
    const scrollAmount = 320; // Largura do item + gap
    
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
    
    // Mostrar/ocultar botões baseado na posição do scroll
    function updateButtonVisibility() {
        const isAtStart = carousel.scrollLeft === 0;
        const isAtEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 10;
        
        prevBtn.style.display = isAtStart ? 'none' : 'flex';
        nextBtn.style.display = isAtEnd ? 'none' : 'flex';
    }
    
    carousel.addEventListener('scroll', updateButtonVisibility);
    updateButtonVisibility(); // Estado inicial
    
    // Touch swipe para mobile
    let isDown = false;
    let startX;
    let scrollLeft;
    
    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
        carousel.style.cursor = 'grabbing';
    });
    
    carousel.addEventListener('mouseleave', () => {
        isDown = false;
        carousel.style.cursor = 'grab';
    });
    
    carousel.addEventListener('mouseup', () => {
        isDown = false;
        carousel.style.cursor = 'grab';
    });
    
    carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
    });
    
    // Touch events para mobile
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });
    
    carousel.addEventListener('touchmove', (e) => {
        if (!carousel) return;
        const x = e.touches[0].pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
    });
}

// ========== FUNÇÕES DE EXIBIÇÃO ==========

/**
 * Exibe todos os produtos na página de produtos
 */
async function displayAllProducts() {
    const products = await loadProducts();
    const productsContainer = document.getElementById('all-products');
    
    if (!productsContainer) return;
    
    // Mostrar loading
    productsContainer.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Carregando produtos...</p>
        </div>
    `;
    
    setTimeout(() => {
        productsContainer.innerHTML = products.map(product => `
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
    }, 500);
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
    
    // Mostrar loading
    productContainer.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Carregando produto...</p>
        </div>
    `;
    
    const product = await getProductById(productId);
    
    if (!product) {
        productContainer.innerHTML = '<p class="error-message">Produto não encontrado.</p>';
        return;
    }
    
    // Atualizar título da página
    document.title = `${product.nome} - DealRoute`;
    
    // Atualizar meta description para SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', `${product.nome} - ${product.descricao.substring(0, 160)}...`);
    }
    
    // Adicionar schema markup para SEO
    addProductSchema(product);
    
    // Calcular desconto se houver preço antigo
    const discount = product.precoAntigo ? calculateDiscount(product.precoAntigo, product.preco) : null;
    
    // Exibir produto
    setTimeout(() => {
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
                
                ${product.especificacoes ? `
                <div class="product-specs">
                    <h3 class="specs-title">Especificações Técnicas</h3>
                    <ul class="specs-list">
                        ${product.especificacoes.map(spec => `
                            <li>
                                <span class="spec-name">${spec.nome}</span>
                                <span class="spec-value">${spec.valor}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                ` : ''}
                
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
    }, 500);
}

/**
 * Adiciona schema markup para SEO
 */
function addProductSchema(product) {
    const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.nome,
        "description": product.descricao,
        "image": product.imagens,
        "offers": {
            "@type": "Offer",
            "price": product.preco.replace('R$', '').replace('.', '').replace(',', '.').trim(),
            "priceCurrency": "BRL",
            "availability": "https://schema.org/InStock",
            "priceValidUntil": "2024-12-31"
        }
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
}

/**
 * Calcula o percentual de desconto
 */
function calculateDiscount(oldPrice, currentPrice) {
    const old = parseFloat(oldPrice.replace('R$', '').replace('.', '').replace(',', '.').trim());
    const current = parseFloat(currentPrice.replace('R$', '').replace('.', '').replace(',', '.').trim());
    return Math.round(((old - current) / old) * 100);
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

/**
 * Inicializa sistema de busca e filtros
 */
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

/**
 * Filtra produtos baseado na busca e categoria
 */
async function filterProducts() {
    const products = await loadProducts();
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

/**
 * Exibe produtos filtrados
 */
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
    
    // Atualizar contador de resultados
    if (resultsCounter) {
        resultsCounter.textContent = `${filteredProducts.length} produto(s) encontrado(s)`;
    }
}

// ========== BOTÕES FLUTUANTES - APENAS MOBILE ==========

/**
 * Inicializa botões flutuantes APENAS para mobile
 */
function initializeFloatingButtons() {
    // Verificar se é mobile
    if (window.innerWidth > 768) return;
    
    // Botão Voltar ao Topo
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'floating-btn back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.setAttribute('aria-label', 'Voltar ao topo');
    backToTopBtn.style.display = 'none'; // Inicialmente escondido
    
    // Botão WhatsApp
    const whatsappBtn = document.createElement('button');
    whatsappBtn.className = 'floating-btn whatsapp';
    whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
    whatsappBtn.setAttribute('aria-label', 'Fale conosco no WhatsApp');
    
    // Container dos botões
    const floatingContainer = document.createElement('div');
    floatingContainer.className = 'floating-buttons';
    floatingContainer.appendChild(backToTopBtn);
    floatingContainer.appendChild(whatsappBtn);
    
    document.body.appendChild(floatingContainer);
    
    // Funcionalidade Voltar ao Topo
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Mostrar/ocultar botão Voltar ao Topo baseado no scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    // Funcionalidade WhatsApp
    whatsappBtn.addEventListener('click', () => {
        const phoneNumber = '5511999999999'; // Substitua pelo seu número
        const message = 'Olá! Gostaria de mais informações sobre os produtos.';
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    });
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
        initializeProductFilters();
    } else if (path.endsWith('produto.html')) {
        displayProduct();
    }
    
    // Inicializar componentes globais
    initializeFloatingButtons();
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initializePage);

// Re-inicializar botões flutuantes quando a tela for redimensionada
window.addEventListener('resize', () => {
    // Remover botões flutuantes existentes
    const existingFloatingButtons = document.querySelector('.floating-buttons');
    if (existingFloatingButtons) {
        existingFloatingButtons.remove();
    }
    
    // Re-inicializar botões flutuantes (só cria se for mobile)
    initializeFloatingButtons();
});