// js/scriptresponsive.js
// Menu mobile toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }
    
    // Footer accordion para mobile
    const footerTitles = document.querySelectorAll('.footer-title');
    
    if (window.innerWidth <= 768) {
        footerTitles.forEach(title => {
            // Pular o primeiro (não deve ser accordion)
            if (title.parentElement === document.querySelector('.footer-section:first-child')) {
                return;
            }
            
            title.addEventListener('click', function() {
                this.classList.toggle('active');
            });
        });
    }
    
    // Slider de imagens do produto
    const mainImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage && thumbnails.length > 0) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                // Atualizar imagem principal
                mainImage.src = this.src;
                
                // Atualizar thumbnails ativos
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
});