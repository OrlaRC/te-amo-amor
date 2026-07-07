const CONFIG = {
    girlfriend: "Kari",
    relationshipDate: "2026-03-07T19:20:00",
    music: "music/dime.mp3"
};

document.addEventListener("DOMContentLoaded", () => {
    initializeApp();
});

function initializeApp() {
    const loader = document.getElementById("loader");
    const app = document.getElementById("app");
    const enterButton = document.getElementById("enterButton");
    const bgMusic = document.getElementById("bgMusic");
    const musicBtn = document.getElementById("musicButton");
    const musicIcon = musicBtn.querySelector(".music-icon");
    const musicOffIcon = musicBtn.querySelector(".music-off");
    const galleryItems = document.querySelectorAll(".gallery-item");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxClose = document.getElementById("lightboxClose");
    const lightboxPrev = document.getElementById("lightboxPrev");
    const lightboxNext = document.getElementById("lightboxNext");
    const lightboxCounter = document.getElementById("lightboxCounter");

    let isPlaying = false;
    let currentPhotoIndex = 0;
    const photoCount = galleryItems.length;

    const validImages = [];

    galleryItems.forEach((item, index) => {
        const img = item.querySelector("img");

        img.addEventListener("error", () => {
            img.style.display = "none";
        });

        img.addEventListener("load", () => {
            validImages[index] = true;
            const placeholder = item.querySelector(".gallery-placeholder");
            if (placeholder) placeholder.style.display = "none";
        });

        if (img.complete && img.naturalWidth > 0) {
            validImages[index] = true;
            const placeholder = item.querySelector(".gallery-placeholder");
            if (placeholder) placeholder.style.display = "none";
        }

        item.addEventListener("click", () => openLightbox(index));
    });

    function openLightbox(index) {
        if (!validImages[index]) return;
        currentPhotoIndex = index;
        const img = galleryItems[index].querySelector("img");
        lightboxImg.src = img.getAttribute("src");
        lightbox.classList.remove("hidden");
        updateCounter();
        document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
        lightbox.classList.add("hidden");
        document.body.style.overflow = "";
    }

    function prevPhoto() {
        let attempts = 0;
        do {
            currentPhotoIndex = (currentPhotoIndex - 1 + photoCount) % photoCount;
            attempts++;
        } while (!validImages[currentPhotoIndex] && attempts < photoCount);
        const img = galleryItems[currentPhotoIndex].querySelector("img");
        if (img && validImages[currentPhotoIndex]) {
            lightboxImg.src = img.getAttribute("src");
            updateCounter();
        }
    }

    function nextPhoto() {
        let attempts = 0;
        do {
            currentPhotoIndex = (currentPhotoIndex + 1) % photoCount;
            attempts++;
        } while (!validImages[currentPhotoIndex] && attempts < photoCount);
        const img = galleryItems[currentPhotoIndex].querySelector("img");
        if (img && validImages[currentPhotoIndex]) {
            lightboxImg.src = img.getAttribute("src");
            updateCounter();
        }
    }

    function updateCounter() {
        lightboxCounter.textContent = `${currentPhotoIndex + 1} / ${photoCount}`;
    }

    lightboxClose.addEventListener("click", closeLightbox);
    lightboxPrev.addEventListener("click", prevPhoto);
    lightboxNext.addEventListener("click", nextPhoto);

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
        if (lightbox.classList.contains("hidden")) return;
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") prevPhoto();
        if (e.key === "ArrowRight") nextPhoto();
    });

    enterButton.addEventListener("click", () => {
        if (navigator.vibrate) navigator.vibrate(30);
        loader.style.opacity = "0";
        loader.style.transition = "opacity .8s ease";
        setTimeout(() => {
            loader.style.display = "none";
            app.classList.remove("hidden");
            document.body.style.overflowY = "auto";
            startMusic();
            startCounter();
            startHearts();
            revealSections();
        }, 800);
    });

    function startMusic() {
        bgMusic.addEventListener("error", () => {
            musicBtn.style.opacity = ".3";
            musicBtn.title = "Agrega un archivo de música en music/song.mp3";
        });
        bgMusic.play().then(() => {
            isPlaying = true;
            musicBtn.classList.add("playing");
        }).catch(() => {});
    }

    musicBtn.addEventListener("click", () => {
        if (isPlaying) {
            bgMusic.pause();
            isPlaying = false;
            musicBtn.classList.remove("playing");
        } else {
            bgMusic.play();
            isPlaying = true;
            musicBtn.classList.add("playing");
        }
        musicIcon.classList.toggle("hidden");
        musicOffIcon.classList.toggle("hidden");
    });

    function startCounter() {
        function updateCounter() {
            const start = new Date(CONFIG.relationshipDate).getTime();
            const now = new Date().getTime();
            let diff = Math.max(0, now - start);
            const days = Math.floor(diff / 86400000);
            diff -= days * 86400000;
            const hours = Math.floor(diff / 3600000);
            diff -= hours * 3600000;
            const minutes = Math.floor(diff / 60000);
            diff -= minutes * 60000;
            const seconds = Math.floor(diff / 1000);
            document.getElementById("days").textContent = String(days).padStart(2, "0");
            document.getElementById("hours").textContent = String(hours).padStart(2, "0");
            document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
            document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
        }
        updateCounter();
        setInterval(updateCounter, 1000);
    }

    function startHearts() {
        const container = document.getElementById("surpriseHearts");
        const symbols = ["❤️", "💖", "💕", "✨", "🌸"];
        setInterval(() => {
            const heart = document.createElement("div");
            heart.className = "heart-float";
            heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            heart.style.left = Math.random() * 90 + "%";
            heart.style.fontSize = (Math.random() * 1.2 + 0.6) + "rem";
            heart.style.animationDuration = (Math.random() * 3 + 3) + "s";
            container.appendChild(heart);
            setTimeout(() => heart.remove(), 6000);
        }, 400);
    }

    function revealSections() {
        const sections = document.querySelectorAll("#app > section");
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => {
            section.style.opacity = "0";
            section.style.transform = "translateY(40px)";
            section.style.transition = "opacity .8s ease, transform .8s ease";
            observer.observe(section);
        });
    }
}
