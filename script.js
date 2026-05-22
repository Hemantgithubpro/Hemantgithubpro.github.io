document.addEventListener("DOMContentLoaded", () => {
    initializeTheme();
    initializeNavigation();
    initializeTypingAnimation();
    initializeRevealAnimations();
});

function initializeTheme() {
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = themeToggle?.querySelector("i");
    const storedTheme = localStorage.getItem("theme");
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    const initialTheme = storedTheme || (prefersLight ? "light" : "dark");

    setTheme(initialTheme, themeIcon);

    themeToggle?.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
        const nextTheme = currentTheme === "dark" ? "light" : "dark";

        setTheme(nextTheme, themeIcon);
        localStorage.setItem("theme", nextTheme);
    });
}

function setTheme(theme, icon) {
    document.documentElement.setAttribute("data-theme", theme);

    if (!icon) return;

    icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
}

function initializeNavigation() {
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");
    const sectionLinks = document.querySelectorAll('a[href^="#"]');

    hamburger?.addEventListener("click", () => {
        const isOpen = navMenu?.classList.toggle("active") || false;
        hamburger.classList.toggle("active", isOpen);
        hamburger.setAttribute("aria-expanded", String(isOpen));
        document.body.classList.toggle("menu-open", isOpen);
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            navMenu?.classList.remove("active");
            hamburger?.classList.remove("active");
            hamburger?.setAttribute("aria-expanded", "false");
            document.body.classList.remove("menu-open");
        });
    });

    sectionLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    updateActiveNavLink();
    window.addEventListener("scroll", debounce(updateActiveNavLink, 80), { passive: true });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll(".nav-link");
    let current = "home";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 140;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
            current = section.id;
        }
    });

    navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
}

function initializeTypingAnimation() {
    const typedText = document.getElementById("typed-text");
    const phrases = [
        "full-stack developer.",
        "competitive programmer.",
        "MERN stack builder.",
        "problem solver.",
        "curious learner."
    ];

    if (!typedText) return;

    let phraseIndex = 0;
    let characterIndex = 0;
    let isDeleting = false;

    function type() {
        const phrase = phrases[phraseIndex];
        const visibleText = phrase.slice(0, characterIndex);
        typedText.textContent = visibleText;

        if (!isDeleting && characterIndex < phrase.length) {
            characterIndex += 1;
            window.setTimeout(type, 74);
            return;
        }

        if (!isDeleting && characterIndex === phrase.length) {
            isDeleting = true;
            window.setTimeout(type, 1350);
            return;
        }

        if (isDeleting && characterIndex > 0) {
            characterIndex -= 1;
            window.setTimeout(type, 38);
            return;
        }

        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        window.setTimeout(type, 360);
    }

    type();
}

function initializeRevealAnimations() {
    const revealElements = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
        revealElements.forEach((element) => element.classList.add("visible"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    });

    revealElements.forEach((element, index) => {
        element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
        observer.observe(element);
    });
}

function debounce(callback, wait) {
    let timeoutId;

    return (...args) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => callback.apply(null, args), wait);
    };
}
