// Classe principal para gerenciar o site
class BusinessTemplate {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupSmoothScrolling();
        this.setupHeaderScrollEffect();
        this.setupMobileMenu();
        this.setupGalleryModal();
        this.setupFormValidation();
        this.setupScrollAnimations();
        this.setupActiveNavLinks();
    }

    setupEventListeners() {
        // Event listeners principais
        document.addEventListener('DOMContentLoaded', () => {
            this.updateActiveNavLink();
        });

        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    setupSmoothScrolling() {
        // Smooth scrolling para links internos
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupHeaderScrollEffect() {
        const header = document.querySelector('.header');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const nav = document.getElementById('nav');
        
        if (mobileMenuBtn && nav) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenuBtn.classList.toggle('active');
                nav.classList.toggle('active');
            });

            // Fechar menu ao clicar em um link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenuBtn.classList.remove('active');
                    nav.classList.remove('active');
                });
            });

            // Fechar menu ao clicar fora
            document.addEventListener('click', (e) => {
                if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                    mobileMenuBtn.classList.remove('active');
                    nav.classList.remove('active');
                }
            });
        }
    }

    setupGalleryModal() {
        const modal = document.getElementById('gallery-modal');
        const modalImage = document.getElementById('modal-image');
        const closeModal = document.getElementById('close-modal');
        const galleryItems = document.querySelectorAll('.gallery-item');

        if (modal && modalImage && closeModal) {
            galleryItems.forEach(item => {
                item.addEventListener('click', () => {
                    const img = item.querySelector('img');
                    if (img) {
                        modalImage.src = img.src;
                        modalImage.alt = img.alt;
                        modal.style.display = 'block';
                        document.body.style.overflow = 'hidden';
                    }
                });
            });

            // Fechar modal
            const closeModalFn = () => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            };

            closeModal.addEventListener('click', closeModalFn);
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModalFn();
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.style.display === 'block') {
                    closeModalFn();
                }
            });
        }
    }

    setupFormValidation() {
        const form = document.getElementById('contact-form');
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                if (this.validateForm(form)) {
                    this.handleFormSubmission(form);
                }
            });

            // Validação em tempo real
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });

                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                });
            });
        }
    }

    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.getAttribute('name');
        let isValid = true;
        let errorMessage = '';

        // Limpar erro anterior
        this.clearFieldError(field);

        // Validação por tipo de campo
        if (field.hasAttribute('required') && !value) {
            errorMessage = 'Este campo é obrigatório';
            isValid = false;
        } else if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Por favor, insira um email válido';
                isValid = false;
            }
        } else if (fieldName === 'phone' && value) {
            const phoneRegex = /^\(?[0-9]{2}\)?[-. ]?[0-9]{4,5}[-. ]?[0-9]{4}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                errorMessage = 'Por favor, insira um telefone válido';
                isValid = false;
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.classList.add('error-message');
            errorElement.style.color = 'var(--error-color)';
            errorElement.style.fontSize = 'var(--font-size-sm)';
            errorElement.style.marginTop = 'var(--spacing-xs)';
            errorElement.style.display = 'block';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    handleFormSubmission(form) {
        // Simular envio do formulário
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        console.log('Dados do formulário:', data);
        
        // Mostrar mensagem de sucesso
        this.showSuccessMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        
        // Limpar formulário
        form.reset();
        
        // Em um ambiente real, você faria uma requisição AJAX aqui:
        /*
        fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            this.showSuccessMessage('Mensagem enviada com sucesso!');
            form.reset();
        })
        .catch(error => {
            this.showErrorMessage('Erro ao enviar mensagem. Tente novamente.');
        });
        */
    }

    showSuccessMessage(message) {
        this.showNotification(message, 'success');
    }

    showErrorMessage(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        // Remover notificação anterior se existir
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.classList.add('notification', `notification-${type}`);
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: var(--spacing-lg);
            border-radius: var(--radius-lg);
            color: var(--white);
            font-weight: 600;
            z-index: 3000;
            transform: translateX(100%);
            transition: transform var(--transition-base);
            max-width: 400px;
            box-shadow: var(--shadow-lg);
        `;

        if (type === 'success') {
            notification.style.backgroundColor = 'var(--success-color)';
        } else if (type === 'error') {
            notification.style.backgroundColor = 'var(--error-color)';
        }

        notification.textContent = message;
        document.body.appendChild(notification);

        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Remover após 5 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);

        // Observar elementos que devem ser animados
        const animatedElements = document.querySelectorAll(
            '.service-card, .feature, .gallery-item, .contact-item'
        );
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    setupActiveNavLinks() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            this.updateActiveNavLink();
        });
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    handleScroll() {
        // Throttle scroll events para melhor performance
        if (!this.scrollTimeout) {
            this.scrollTimeout = setTimeout(() => {
                this.updateActiveNavLink();
                this.scrollTimeout = null;
            }, 10);
        }
    }

    handleResize() {
        // Throttle resize events
        if (!this.resizeTimeout) {
            this.resizeTimeout = setTimeout(() => {
                // Fechar menu mobile se a tela ficar grande
                if (window.innerWidth > 768) {
                    const nav = document.getElementById('nav');
                    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
                    if (nav && mobileMenuBtn) {
                        nav.classList.remove('active');
                        mobileMenuBtn.classList.remove('active');
                    }
                }
                this.resizeTimeout = null;
            }, 100);
        }
    }
}

// Utilitários para customização fácil
class TemplateCustomizer {
    static setColors(colors) {
        const root = document.documentElement;
        Object.entries(colors).forEach(([property, value]) => {
            root.style.setProperty(`--${property}`, value);
        });
    }

    static setBusinessInfo(info) {
        // Atualizar informações do negócio
        if (info.name) {
            document.querySelector('.logo h1').textContent = info.name;
            document.querySelector('.hero-title').textContent = `Bem-vindo ao ${info.name}`;
        }
        
        if (info.description) {
            document.querySelector('.hero-subtitle').textContent = info.description;
        }

        if (info.contact) {
            // Atualizar informações de contato
            const contactItems = document.querySelectorAll('.contact-item p');
            if (info.contact.address && contactItems[0]) {
                contactItems[0].innerHTML = info.contact.address.replace(/\n/g, '<br>');
            }
            if (info.contact.phone && contactItems[1]) {
                contactItems[1].textContent = info.contact.phone;
            }
            if (info.contact.email && contactItems[2]) {
                contactItems[2].textContent = info.contact.email;
            }
            if (info.contact.hours && contactItems[3]) {
                contactItems[3].innerHTML = info.contact.hours.replace(/\n/g, '<br>');
            }
        }
    }

    static setServices(services) {
        const servicesGrid = document.querySelector('.services-grid');
        if (servicesGrid && services.length > 0) {
            servicesGrid.innerHTML = '';
            services.forEach(service => {
                const serviceCard = this.createServiceCard(service);
                servicesGrid.appendChild(serviceCard);
            });
        }
    }

    static createServiceCard(service) {
        const card = document.createElement('div');
        card.classList.add('service-card');
        card.innerHTML = `
            <div class="service-icon">${service.icon || '🔧'}</div>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            <button class="btn btn-outline">Saiba Mais</button>
        `;
        return card;
    }

    static setGalleryImages(images) {
        const galleryGrid = document.querySelector('.gallery-grid');
        if (galleryGrid && images.length > 0) {
            galleryGrid.innerHTML = '';
            images.forEach((image, index) => {
                const galleryItem = this.createGalleryItem(image, index);
                galleryGrid.appendChild(galleryItem);
            });
        }
    }

    static createGalleryItem(image, index) {
        const item = document.createElement('div');
        item.classList.add('gallery-item');
        item.innerHTML = `
            <img src="${image.url}" alt="${image.alt || `Imagem da galeria ${index + 1}`}" loading="lazy">
            <div class="gallery-overlay">
                <span>Ver Imagem</span>
            </div>
        `;
        return item;
    }
}

// Inicializar o template quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new BusinessTemplate();
    
    // Exemplo de como usar o customizador:
    // TemplateCustomizer.setColors({
    //     'primary-color': '#ff6b6b',
    //     'secondary-color': '#4ecdc4'
    // });
    
    // TemplateCustomizer.setBusinessInfo({
    //     name: 'Minha Empresa',
    //     description: 'A melhor empresa da região',
    //     contact: {
    //         address: 'Rua Nova, 456\nBairro Novo, Cidade - UF\nCEP: 11111-111',
    //         phone: '(11) 88888-8888',
    //         email: 'contato@minhaempresa.com.br',
    //         hours: 'Segunda a Sexta: 9h às 19h\nSábado: 9h às 14h'
    //     }
    // });
});

// Exportar classes para uso externo (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BusinessTemplate, TemplateCustomizer };
}