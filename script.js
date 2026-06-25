// =========================================
// 1. MENU ANIMATION & INTERACTION LOGIC
// =========================================
const menuToggleBtn = document.querySelector('#menu-toggle-btn');
const underMenu = document.querySelector('#underneath_menu');
const menuItems = document.querySelectorAll('.menu-item');
const menuFloatingImg = document.querySelector('#menu-floating-img');
const body = document.body;

if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        
        // Toggle the class that triggers the CSS transform
        body.classList.toggle('menu-open');

        // Handle Text Change & Scroll Locking
        if (body.classList.contains('menu-open')) {
            menuToggleBtn.textContent = 'CLOSE';
            // Stop Locomotive Scroll so it doesn't glitch while menu is open
            if (typeof locomotiveScroll !== 'undefined') locomotiveScroll.stop();
        } else {
            menuToggleBtn.textContent = 'MENU';
            // Re-enable Locomotive Scroll
            if (typeof locomotiveScroll !== 'undefined') locomotiveScroll.start();
        }
    });
}

// Menu Image Hover Tracking
if (underMenu && menuFloatingImg) {
    underMenu.addEventListener('mousemove', (e) => {
        menuFloatingImg.style.left = `${e.clientX}px`;
        menuFloatingImg.style.top = `${e.clientY}px`;
    });

    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const imgSrc = item.getAttribute('data-image');
            if (imgSrc) {
                menuFloatingImg.src = imgSrc;
                menuFloatingImg.classList.add('active');
            }
        });

        item.addEventListener('mouseleave', () => {
            menuFloatingImg.classList.remove('active');
        });
    });
}

// =========================================
// 2. HERO 3D HOVER EFFECT
// =========================================
const hero_container = document.querySelector('#hero_container');
const heroBox = document.querySelector("#heroImg");

let mouseX = 0;
let mouseY = 0;
let currentX = 0;
let currentY = 0;
let velX = 0;
let prevMouseX = 0;
let rotY = 0;

if (hero_container && heroBox) {
    hero_container.addEventListener('mousemove', (e) => {
        const rect = hero_container.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;

        heroBox.style.display = "block";

        velX = e.clientX - prevMouseX;
        prevMouseX = e.clientX;    
    });

    hero_container.addEventListener('mouseleave', () => {
        heroBox.style.display = "none";
    });

    function animate() {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;
        
        const targetRot = velX * 2.5;
        rotY += (targetRot - rotY) * 0.12;
        velX *= 0.85;
        
        heroBox.style.transform = `perspective(800px) rotateY(${rotY}deg)`;
        heroBox.style.left = `${currentX}px`;
        heroBox.style.top = `${currentY}px`;
        requestAnimationFrame(animate);
    }
    animate();
}

// =========================================
// 3. TEXT TRAIL IMAGE SPAWNER
// =========================================
const trailData = {
    detail: [
        "images/playgroundImg2_1.webp",
        "images/playgroundImg2_2.webp",
        "images/playgroundImg2_3.webp",
        "images/playgroundImg2_4.webp",
        "images/playgroundImg2_5.webp"
    ],
    playground: [
        "images/playgroundImg1.webp",
        "images/playgroundImg2.webp",
        "images/playgroundImg3.webp",
        "images/playgroundImg4.webp",
        "images/playgroundImg5.webp"
    ]
};

const trailContainer = document.getElementById("trail-image-container");
const trailTriggers = document.querySelectorAll(".hover-trigger");

let currentImageIndex = 0;
let loopInterval = null; 
const spawnSpeed = 350; 

if (trailContainer && trailTriggers.length > 0) {
    trailTriggers.forEach(trigger => {
        const type = trigger.getAttribute("data-type");
        const activeImages = trailData[type];

        trigger.addEventListener("mouseenter", (event) => {
            const rect = trigger.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            spawnImageFromWord(activeImages[currentImageIndex], centerX, centerY);
            currentImageIndex = (currentImageIndex + 1) % activeImages.length;

            loopInterval = setInterval(() => {
                spawnImageFromWord(activeImages[currentImageIndex], centerX, centerY);
                currentImageIndex = (currentImageIndex + 1) % activeImages.length;
            }, spawnSpeed);
        });

        trigger.addEventListener("mouseleave", () => {
            clearInterval(loopInterval);
            loopInterval = null;
            currentImageIndex = 0; 
        });
    });

    function spawnImageFromWord(url, x, y) {
        const imgElement = document.createElement("img");
        imgElement.src = url;
        imgElement.classList.add("floating-img");

        imgElement.style.left = `${x}px`;
        imgElement.style.top = `${y}px`;

        const randomRotation = Math.floor(Math.random() * 14) - 7; 
        imgElement.style.setProperty('--rot', `${randomRotation}deg`);

        trailContainer.appendChild(imgElement);

        setTimeout(() => {
            imgElement.classList.add("active");
        }, 20);

        setTimeout(() => {
            imgElement.classList.remove("active");
            setTimeout(() => {
                imgElement.remove();
            }, 400); 
        }, 800); 
    }
}

// =========================================
// 4. GRID CARD VIDEO PREVIEW
// =========================================
const gridCards = document.querySelectorAll('.grid-card');

if (gridCards.length > 0) {
    gridCards.forEach(card => {
        const videoInstance = card.querySelector('.card-hover-video');

        card.addEventListener('mouseenter', () => {
            if (videoInstance) {
                videoInstance.play().catch(error => {
                    console.warn("Autoplay interaction framework bypass validation:", error);
                });
            }
        });

        card.addEventListener('mouseleave', () => {
            if (videoInstance) {
                videoInstance.pause();
                videoInstance.currentTime = 0; 
            }
        });
    });
}