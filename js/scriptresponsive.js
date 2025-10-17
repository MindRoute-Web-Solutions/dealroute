// js/scriptresponsive.js - EXPERIÊNCIAS E INTERAÇÕES RESPONSIVAS

// ========== MENU MOBILE ==========

/**
 * Inicializa o toggle do menu mobile
 */
function initializeMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav');
    const body = document.body;
    
    if (!mobileToggle || !nav) return;
    
    mobileToggle.addEventListener('click', function() {
        const isActive = nav.classList.contains('active');
        
        // Alternar menu
        nav.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        body.style.overflow = isActive ? 'auto' : 'hidden';
        
        // Animar hamburger para X
        const spans = mobileToggle.querySelectorAll('span');
        if (nav.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Fechar menu ao clicar em um link
    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            mobileToggle.classList.remove('active');
            body.style.overflow = 'auto';
            
            // Reset hamburger
            const spans = mobileToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

// ========== FOOTER ACCORDION MOBILE ==========

/**
 * Inicializa accordion do footer para mobile
 */
function initializeFooterAccordion() {
    if (window.innerWidth > 768) return;
    
    const footerSections = document.querySelectorAll('.footer-section');
    
    footerSections.forEach((section, index) => {
        // Pular a primeira seção (não deve ser accordion)
        if (index === 0) return;
        
        const title = section.querySelector('.footer-title');
        const links = section.querySelector('.footer-links');
        
        if (!title || !links) return;
        
        // Adicionar ícone de toggle
        title.style.cursor = 'pointer';
        title.style.position = 'relative';
        title.innerHTML += '<span class="accordion-icon">+</span>';
        
        title.addEventListener('click', function() {
            const isActive = this.classList.contains('active');
            
            // Fechar todos os outros
            footerSections.forEach(s => {
                if (s !== section) {
                    const otherTitle = s.querySelector('.footer-title');
                    const otherLinks = s.querySelector('.footer-links');
                    if (otherTitle && otherLinks) {
                        otherTitle.classList.remove('active');
                        otherLinks.style.maxHeight = '0';
                        otherTitle.querySelector('.accordion-icon').textContent = '+';
                    }
                }
            });
            
            // Alternar atual
            this.classList.toggle('active');
            const icon = this.querySelector('.accordion-icon');
            
            if (this.classList.contains('active')) {
                links.style.maxHeight = links.scrollHeight + 'px';
                icon.textContent = '−';
            } else {
                links.style.maxHeight = '0';
                icon.textContent = '+';
            }
        });
        
        // Inicialmente fechado
        links.style.maxHeight = '0';
    });
}

// ========== GALERIA DE IMAGENS RESPONSIVA ==========

/**
 * Inicializa a galeria de imagens do produto
 */
function initializeProductGallery() {
    const mainImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (!mainImage || thumbnails.length === 0) return;
    
    // Função para trocar imagem principal
    function changeMainImage(src, alt) {
        mainImage.style.opacity = '0';
        
        setTimeout(() => {
            mainImage.src = src;
            mainImage.alt = alt;
            mainImage.style.opacity = '1';
        }, 150);
    }
    
    // Event listeners para thumbnails
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Atualizar imagem principal
            changeMainImage(this.src, this.alt);
            
            // Atualizar thumbnails ativos
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
        
        // Touch events para mobile
        thumb.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.click();
        });
    });
    
    // Swipe para mobile na imagem principal
    let touchStartX = 0;
    let touchEndX = 0;
    
    mainImage.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    mainImage.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const activeThumb = document.querySelector('.thumbnail.active');
        let activeIndex = Array.from(thumbnails).indexOf(activeThumb);
        
        if (touchEndX < touchStartX - 50 && activeIndex < thumbnails.length - 1) {
            // Swipe left - próxima imagem
            activeIndex++;
        } else if (touchEndX > touchStartX + 50 && activeIndex > 0) {
            // Swipe right - imagem anterior
            activeIndex--;
        } else {
            return;
        }
        
        const nextThumb = thumbnails[activeIndex];
        changeMainImage(nextThumb.src, nextThumb.alt);
        
        thumbnails.forEach(t => t.classList.remove('active'));
        nextThumb.classList.add('active');
    }
}

// ========== LAZY LOADING OTIMIZADO ==========

/**
 * Inicializa lazy loading para imagens
 */
function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// ========== OBSERVER PARA RESPONSIVIDADE ==========

/**
 * Observa mudanças no viewport e ajusta comportamentos
 */
function initializeViewportObserver() {
    let previousWidth = window.innerWidth;
    
    window.addEventListener('resize', () => {
        const currentWidth = window.innerWidth;
        
        // Re-inicializar footer accordion se mudou para/do mobile
        if ((previousWidth <= 768 && currentWidth > 768) || 
            (previousWidth > 768 && currentWidth <= 768)) {
            initializeFooterAccordion();
        }
        
        previousWidth = currentWidth;
    });
}

// ========== INICIALIZAÇÃO RESPONSIVA ==========

/**
 * Inicializa todas as funcionalidades responsivas
 */
function initializeResponsiveFeatures() {
    initializeMobileMenu();
    initializeFooterAccordion();
    initializeProductGallery();
    initializeLazyLoading();
    initializeViewportObserver();
    
    console.log('🚀 Funcionalidades responsivas inicializadas!');
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initializeResponsiveFeatures);

// Re-inicializar quando a janela for redimensionada
window.addEventListener('resize', () => {
    // Debounce para evitar execução excessiva
    clearTimeout(window.resizingTimeout);
    window.resizingTimeout = setTimeout(initializeFooterAccordion, 250);
});