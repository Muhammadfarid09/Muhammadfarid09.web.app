document.addEventListener('DOMContentLoaded', () => {

    // --- 0. ระบบ Ethereal Sci-Fi (Particle Network ฉากหลังเรืองแสง) ---
    const canvas = document.getElementById('ethereal-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particlesArray = [];
        const numberOfParticles = 80;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.fillStyle = 'rgba(168, 85, 247, 0.6)'; 
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initCanvas() {
            particlesArray = [];
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
                
                for (let j = i; j < particlesArray.length; j++) {
                    const dx = particlesArray[i].x - particlesArray[j].x;
                    const dy = particlesArray[i].y - particlesArray[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(168, 85, 247, ${1 - distance/120})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateCanvas);
        }

        initCanvas();
        animateCanvas();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initCanvas();
        });
    }

    // --- 1. ระบบ Intro Screen ---
    const intro = document.getElementById('intro-screen');
    const chatContainer = document.querySelector('.ai-chat-container');
    
    if (intro) {
        setTimeout(() => {
            intro.classList.add('fade-out');
            if (chatContainer) chatContainer.classList.add('show');
            if (typeof AOS !== 'undefined') AOS.init({ duration: 1000, once: true });
        }, 2500); 
    } else {
        if (chatContainer) chatContainer.classList.add('show');
    }

    // --- 2. 🟢 ระบบ Continuous Marquee Slider (ไหลไปเรื่อยๆ แบบไร้รอยต่อ) 🟢 ---
    const sliders = document.querySelectorAll('.project-slider');
    
    sliders.forEach(slider => {
        // 1. ก๊อปปี้การ์ดทั้งหมดมาต่อท้าย (Clone) เพื่อให้มันสไลด์วนลูปได้แบบเนียนๆ
        const cards = Array.from(slider.children);
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            slider.appendChild(clone);
        });

        let isDown = false;
        let startX;
        let scrollLeft;
        let animationId;
        
        // 🌟 ตัวแปรปรับความเร็ว: ค่าน้อย = ช้าลง, ค่ามาก = เร็วขึ้น
        let speed = 0.5; // <--- ลองเปลี่ยนเป็น 0.3 หรือ 0.2 ถ้าอยากให้ช้ากว่านี้คั้บ!
        let exactScroll = 0;

        // 2. ฟังก์ชันสั่งให้สไลด์ไหลไปทางซ้ายแบบเนียนกริบ
        const startAutoScroll = () => {
            cancelAnimationFrame(animationId);
            exactScroll = slider.scrollLeft; // จำตำแหน่งล่าสุดไว้
            
            const play = () => {
                // ถ้าสไลด์เลื่อนไปจนถึงครึ่งทาง ให้แอบเด้งกลับมาจุดเริ่มต้นแบบไร้รอยต่อ
                if (slider.scrollLeft >= slider.scrollWidth / 2) {
                    exactScroll = 0;
                    slider.scrollLeft = 0;
                } else {
                    exactScroll += speed; // บวกความเร็วเข้าไปทีละนิด
                    slider.scrollLeft = exactScroll;
                }
                animationId = requestAnimationFrame(play);
            };
            
            play();
        };

        const stopAutoScroll = () => {
            cancelAnimationFrame(animationId);
        };

        // สั่งให้เริ่มไหลทันที
        startAutoScroll();

        // 🖱️ ระบบเมาส์: ชี้ปุ๊บเบรกให้คนอ่าน เอาเมาส์ออกปุ๊บไหลต่อ
        slider.addEventListener('mouseenter', stopAutoScroll);
        slider.addEventListener('mouseleave', () => {
            if (!isDown) {
                slider.style.cursor = 'grab';
                startAutoScroll(); 
            }
        });

        // 🖱️ ระบบ Drag to Scroll สำหรับคนอยากไถเอง
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.style.cursor = 'grabbing';
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            stopAutoScroll(); 
        });
        
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.cursor = 'grab';
            startAutoScroll(); // ปล่อยเมาส์แล้วให้ไหลต่อ
        });
        
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; 
            slider.scrollLeft = scrollLeft - walk;
        });
        
        slider.style.cursor = 'grab';
    });

    // --- 3. ระบบ Smooth Scroll ---
    document.querySelectorAll('nav a, .hero-btns a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const offsetPosition = targetElement.offsetTop - 80;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            }
        });
    });

    // --- 4. ระบบฟอร์ม Contact ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('ขอบคุณคั้บฟารีด! ระบบได้รับข้อมูลโปรเจกต์ของคุณแล้ว (Demo Mode)');
            contactForm.reset();
        });
    }

    // --- 5. ระบบ AI Chatbot ---
    const chatToggle = document.getElementById('ai-chat-toggle');
    const chatWindow = document.getElementById('ai-chat-window');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatInput = document.getElementById('chat-input');
    const sendChatBtn = document.getElementById('send-chat-btn');
    const chatBody = document.getElementById('chat-body');

    if (chatToggle && chatWindow && closeChatBtn) {
        chatToggle.addEventListener('click', () => {
            chatWindow.classList.toggle('hidden');
            const dot = chatToggle.querySelector('.notification-dot');
            if (dot) dot.style.display = 'none';
        });
        closeChatBtn.addEventListener('click', () => chatWindow.classList.add('hidden'));
    }

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message');
        msgDiv.classList.add(sender === 'user' ? 'user-message' : 'ai-message');
        msgDiv.innerHTML = text;
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function handleSendMessage() {
        const text = chatInput.value.trim();
        if (text === '') return;

        addMessage(text, 'user');
        chatInput.value = '';

        setTimeout(() => {
            const responses = [
                "คุณริศเชี่ยวชาญการเขียน PHP, MySQL และทำระบบ ERP ด้วย Odoo ครับ! สนใจจ้างงานไหมคั้บ? 😎",
                "ERROR 404: ความสามารถในการทำงานของคุณไม่พบในระบบ! ล้อเล่นนะครับ คุณดูเหมือนจะเป็นนักพัฒนาที่มีความสามารถมากเลย! 🚀",
            ];
            const randomReply = responses[Math.floor(Math.random() * responses.length)];
            addMessage(randomReply, 'ai');
        }, 1000); 
    }

    if (sendChatBtn && chatInput) {
        sendChatBtn.addEventListener('click', handleSendMessage);
        chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSendMessage(); });
    }

    // --- 6. ระบบพิมพ์ดีดเล่นวน (Typewriter Effect) ---
    const typewriterElement = document.getElementById('typewriter-text');
    if (typewriterElement) {
        const textArray = ["Co-operative Education Student"];
        let textIndex = 0, charIndex = 0, isDeleting = false;

        function typeWriter() {
            const currentWord = textArray[textIndex];
            if (isDeleting) {
                typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;
            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000; isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false; textIndex = (textIndex + 1) % textArray.length; typeSpeed = 500; 
            }
            setTimeout(typeWriter, typeSpeed);
        }
        setTimeout(typeWriter, 1500); 
    }

    console.log("Web Developer Portfolio Engine: Active 🚀");
});
// --- ระบบสลับโหมดมืด/สว่าง (Dark/Light Mode) + LocalStorage ---
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    // 1. เช็คว่าผู้ใช้เคยเปิดโหมดสว่างไว้ไหมตอนเข้าเว็บครั้งก่อน
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
        if(themeBtn) {
            const icon = themeBtn.querySelector('i');
            icon.classList.replace('fa-moon', 'fa-sun');
            icon.style.color = '#fbbf24'; // สีเหลืองพระอาทิตย์
            icon.style.textShadow = '0 0 15px rgba(251, 191, 36, 0.8)';
        }
    }

    // 2. เมื่อกดปุ่มสลับโหมด
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const icon = themeBtn.querySelector('i');
            
            // สลับคลาส light-mode ที่ body
            body.classList.toggle('light-mode');
            
            // เปลี่ยนไอคอนและบันทึกค่าลง LocalStorage
            if (body.classList.contains('light-mode')) {
                icon.classList.replace('fa-moon', 'fa-sun');
                icon.style.color = '#fbbf24';
                icon.style.textShadow = '0 0 15px rgba(251, 191, 36, 0.8)';
                localStorage.setItem('theme', 'light'); // จำว่าเปิดโหมดสว่าง
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
                icon.style.color = ''; 
                icon.style.textShadow = ''; 
                localStorage.setItem('theme', 'dark'); // จำว่าเปิดโหมดมืด
            }
        });
    }
    