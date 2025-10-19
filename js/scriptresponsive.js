// js/scriptresponsive.js - EXPERIÊNCIAS E INTERAÇÕES RESPONSIVAS

// ========== MENU MOBILE ==========

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
        
        // Criar elemento de ícone
        const accordionIcon = document.createElement('span');
        accordionIcon.className = 'accordion-icon';
        accordionIcon.innerHTML = '+';
        title.appendChild(accordionIcon);
        
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
                        const otherIcon = otherTitle.querySelector('.accordion-icon');
                        if (otherIcon) otherIcon.innerHTML = '+';
                    }
                }
            });
            
            // Alternar atual
            this.classList.toggle('active');
            const icon = this.querySelector('.accordion-icon');
            
            if (this.classList.contains('active')) {
                links.style.maxHeight = links.scrollHeight + 'px';
                icon.innerHTML = '−';
            } else {
                links.style.maxHeight = '0';
                icon.innerHTML = '+';
            }
        });
        
        // Inicialmente fechado
        links.style.maxHeight = '0';
    });
}

// ========== GALERIA DE IMAGENS RESPONSIVA ==========

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

// ========== CARROSSEL MOBILE ==========

function initializeMobileCarousel() {
    if (window.innerWidth > 768) return;
    
    const carousel = document.getElementById('featured-carousel');
    if (!carousel) return;
    
    // Remover setas no mobile
    const prevBtn = document.querySelector('.carrossel-btn.prev');
    const nextBtn = document.querySelector('.carrossel-btn.next');
    
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    
    // Configurar scroll suave
    carousel.style.scrollBehavior = 'smooth';
    carousel.style.scrollSnapType = 'x mandatory';
    
    // Touch events melhorados
    let startX, startY, scrollLeft, isHorizontalScroll;
    
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX - carousel.offsetLeft;
        startY = e.touches[0].pageY - carousel.offsetTop;
        scrollLeft = carousel.scrollLeft;
        isHorizontalScroll = false;
    });
    
    carousel.addEventListener('touchmove', (e) => {
        if (!startX || !startY) return;
        
        const x = e.touches[0].pageX - carousel.offsetLeft;
        const y = e.touches[0].pageY - carousel.offsetTop;
        
        // Determinar se é scroll horizontal ou vertical
        if (!isHorizontalScroll) {
            const diffX = Math.abs(x - startX);
            const diffY = Math.abs(y - startY);
            
            // Se movimento horizontal for maior que vertical, é scroll horizontal
            if (diffX > diffY) {
                isHorizontalScroll = true;
                e.preventDefault();
            }
        }
        
        if (isHorizontalScroll) {
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
        }
    });
    
    carousel.addEventListener('touchend', () => {
        startX = null;
        startY = null;
        isHorizontalScroll = false;
    });
}

// ========== INICIALIZAÇÃO RESPONSIVA ==========

function initializeResponsiveFeatures() {
    initializeMobileMenu();
    initializeFooterAccordion();
    initializeProductGallery();
    initializeMobileCarousel();
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initializeResponsiveFeatures);

// Re-inicializar quando a janela for redimensionada
window.addEventListener('resize', () => {
    clearTimeout(window.resizingTimeout);
    window.resizingTimeout = setTimeout(() => {
        initializeFooterAccordion();
        initializeMobileCarousel();
    }, 250);
});