        document.addEventListener('DOMContentLoaded', () => {
                    // Configuração do Tailwind para usar a fonte Inter e as cores da sua identidade visual
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                    },
                    colors: {
                        brand: {
                            'primary': '#E57373', // Coral/Salmão para destaques e botões
                            'primary-light': '#FDEBE9',
                            'dark': '#5D4037',      // Marrom escuro para textos principais
                            'light': '#FDF8F5',     // Fundo principal (branco-gelo)
                            'extralight': '#FBF6F3'
                        }
                    },
                    boxShadow: {
                        'glow': '0 0 20px rgba(229, 115, 115, 0.3)', // Efeito de brilho com a cor primária
                    }
                }
            }
        }
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');
            const menuOverlay = document.getElementById('menu-overlay');
            const menuLinks = mobileMenu.querySelectorAll('a');

            const toggleMenu = () => {
                const isOpen = mobileMenuButton.classList.contains('menu-open');
                
                // Bloqueia/desbloqueia o scroll da página
                document.body.style.overflow = isOpen ? '' : 'hidden';

                mobileMenuButton.classList.toggle('menu-open');

                if (!isOpen) {
                    // Abrir menu
                    menuOverlay.classList.remove('opacity-0', 'pointer-events-none');
                    mobileMenu.classList.remove('translate-x-full');
                    
                    // Animação de entrada dos links
                    menuLinks.forEach((link, index) => {
                        link.style.transitionDelay = `${(index + 1) * 75}ms`;
                        link.style.opacity = '1';
                        link.style.transform = 'translateY(0)';
                    });

                } else {
                    // Fechar menu
                    menuOverlay.classList.add('opacity-0', 'pointer-events-none');
                    mobileMenu.classList.add('translate-x-full');
                    
                    // Reseta os estilos dos links para a próxima vez que abrir
                    menuLinks.forEach(link => {
                        link.style.opacity = '0';
                        link.style.transform = 'translateY(15px)';
                    });
                }
            };

            mobileMenuButton.addEventListener('click', toggleMenu);
            menuOverlay.addEventListener('click', toggleMenu);
            menuLinks.forEach(link => link.addEventListener('click', toggleMenu));

            // --- Scripts existentes ---
            const header = document.getElementById('main-header');
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('nav a.nav-link');

            window.addEventListener('scroll', () => {
                if (window.scrollY > 20) {
                    header.classList.add('shadow-md', 'border-b', 'border-gray-200/50');
                    header.classList.replace('bg-brand-light/80', 'bg-brand-light/95');
                } else {
                    header.classList.remove('shadow-md', 'border-b', 'border-gray-200/50');
                    header.classList.replace('bg-brand-light/95', 'bg-brand-light/80');
                }
            });

            const observerOptions = { root: null, rootMargin: '0px', threshold: 0.4 };
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        navLinks.forEach(link => {
                            link.classList.remove('active', 'text-brand-dark');
                            if (link.getAttribute('href') === `#${id}`) {
                                link.classList.add('active', 'text-brand-dark');
                            }
                        });
                    }
                });
            }, observerOptions);
            sections.forEach(section => { observer.observe(section); });

            const fadeUpElements = document.querySelectorAll('.fade-in-up');
            const fadeUpObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        fadeUpObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            fadeUpElements.forEach(el => { fadeUpObserver.observe(el); });
        });