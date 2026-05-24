document.addEventListener('DOMContentLoaded', () => {
    // 1. Language Toggle Logic
    let currentLang = 'zh'; // default
    const langBtn = document.getElementById('lang-switch');
    const elementsToTranslate = document.querySelectorAll('[data-zh][data-ja]');
    const inputsToTranslate = document.querySelectorAll('[data-placeholder-zh][data-placeholder-ja]');

    // Check localStorage for saved preference
    const savedLang = localStorage.getItem('siteLang');
    if (savedLang === 'ja') {
        setLanguage('ja');
    }

    langBtn.addEventListener('click', () => {
        const newLang = currentLang === 'zh' ? 'ja' : 'zh';
        setLanguage(newLang);
    });

    function setLanguage(lang) {
        currentLang = lang;
        langBtn.textContent = lang === 'zh' ? 'JA' : 'CN';
        // HTML doc attr
        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'ja';

        // Update text content
        elementsToTranslate.forEach(el => {
            // we use innerHTML here in case there's nested HTML like the highlight strong tag in the hero
            if (el.dataset[lang]) {
                el.innerHTML = el.dataset[lang];
            }
        });

        // Update placeholders
        inputsToTranslate.forEach(input => {
            const placeholderDatasetAttr = 'placeholder' + (lang === 'zh' ? 'Zh' : 'Ja');
            if (input.dataset[placeholderDatasetAttr]) {
                input.placeholder = input.dataset[placeholderDatasetAttr];
            }
        });

        // Save preference
        localStorage.setItem('siteLang', lang);
    }

    // 2. Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('nav a');

    mobileToggle.addEventListener('click', () => {
        header.classList.toggle('menu-open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (header.classList.contains('menu-open')) {
                header.classList.remove('menu-open');
            }
        });
    });

    // 3. Scroll Effects (Header and Animations)
    const animateElements = document.querySelectorAll('.animate-up');
    
    const handleScroll = () => {
        // Sticky Header shadow
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Active Navigation link
        let currentSection = '';
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 150) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
    };

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // only animate once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    animateElements.forEach(el => observer.observe(el));
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Init

    // 4. Tabs Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active to current
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Video carousel logic
    const videoSlides = document.querySelectorAll('.video-slide');
    const videoDots = document.querySelectorAll('.video-dot');
    const prevVideoBtn = document.getElementById('prev-video');
    const nextVideoBtn = document.getElementById('next-video');

    let currentVideoIndex = 0;

   function showVideo(index) {
        if (!videoSlides.length) return;

        const total = videoSlides.length;
        const prevIndex = (index - 1 + total) % total;
        const nextIndex = (index + 1) % total;

        videoSlides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev', 'next');

            if (i === index) {
                slide.classList.add('active');
            } else if (i === prevIndex) {
                slide.classList.add('prev');
            } else if (i === nextIndex) {
                slide.classList.add('next');
            }

            const video = slide.querySelector('video');
            if (video && i !== index) {
                video.pause();
            }
        });

        videoDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        currentVideoIndex = index;
    }

    if (nextVideoBtn && prevVideoBtn) {
        nextVideoBtn.addEventListener('click', () => {
            const nextIndex = (currentVideoIndex + 1) % videoSlides.length;
            showVideo(nextIndex);
        });

        prevVideoBtn.addEventListener('click', () => {
            const prevIndex = (currentVideoIndex - 1 + videoSlides.length) % videoSlides.length;
            showVideo(prevIndex);
        });
    }

    videoDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = Number(dot.dataset.index);
            showVideo(index);
        });
    });

    showVideo(0);

    // 5. Update footer year
    document.getElementById('year').textContent = new Date().getFullYear();
});
