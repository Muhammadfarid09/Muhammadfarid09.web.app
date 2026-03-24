document.addEventListener('DOMContentLoaded', () => {

    // --- 0. 🟢 เริ่มต้น AOS ทันที (แก้ปัญหาหน้าเว็บขาว) 🟢 ---
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 1000, once: true });
    }

    // เปิดให้แชทบอทแสดงผล
    const chatContainer = document.querySelector('.ai-chat-container');
    if (chatContainer) chatContainer.classList.add('show');

    // --- 1. ระบบ Continuous Marquee Slider (ไหลไปเรื่อยๆ) ---
    const sliders = document.querySelectorAll('.project-slider');
    
    sliders.forEach(slider => {
        const cards = Array.from(slider.children);
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            slider.appendChild(clone);
        });

        let isDown = false;
        let startX;
        let scrollLeft;
        let animationId;
        
        let speed = 0.5; 
        let exactScroll = 0;

        const startAutoScroll = () => {
            cancelAnimationFrame(animationId);
            exactScroll = slider.scrollLeft; 
            
            const play = () => {
                if (slider.scrollLeft >= slider.scrollWidth / 2) {
                    exactScroll = 0;
                    slider.scrollLeft = 0;
                } else {
                    exactScroll += speed; 
                    slider.scrollLeft = exactScroll;
                }
                animationId = requestAnimationFrame(play);
            };
            play();
        };

        const stopAutoScroll = () => cancelAnimationFrame(animationId);

        startAutoScroll();

        slider.addEventListener('mouseenter', stopAutoScroll);
        slider.addEventListener('mouseleave', () => {
            if (!isDown) {
                slider.style.cursor = 'grab';
                startAutoScroll(); 
            }
        });

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
            startAutoScroll(); 
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

    // --- 2. ระบบ Smooth Scroll ---
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

    // --- 3. ระบบฟอร์ม Contact ---
    const contactForm = document.querySelector('.custom-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            // ปล่อยให้ Formspree ทำงานตามปกติ ไม่ต้อง e.preventDefault() แล้วครับ
        });
    }

    // --- 4. ระบบ AI Chatbot ---
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
                "ยังไม่เปิดการใช้งานฟีเจอร์นี้นะครับ แต่ถ้าคุณอยากรู้จักผลงานหรือประสบการณ์ของผมเพิ่มเติม ลองดูในส่วน Projects หรือ Certifications ได้เลยครับ! 😊",
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

    // --- 5. ระบบพิมพ์ดีดเล่นวน (Typewriter Effect) ---
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

    // --- 6. ⭐️ ระบบสลับโหมดมืด/สว่าง (แก้บั๊กให้แล้ว ชัวร์ 100%) ⭐️ ---
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    // เช็กค่าตอนโหลดหน้าเว็บ
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
        if(themeBtn) {
            const icon = themeBtn.querySelector('i');
            icon.classList.remove('fa-moon'); // เปลี่ยนเป็น remove/add แทน replace
            icon.classList.add('fa-sun');
            icon.style.color = '#fbbf24'; 
            icon.style.textShadow = '0 0 15px rgba(251, 191, 36, 0.8)';
        }
    }

    // ตอนกดปุ่มสลับโหมด
    if (themeBtn) {
        themeBtn.addEventListener('click', (e) => {
            e.preventDefault(); // กันไม่ให้หน้าเว็บกระตุกเวลากดปุ่ม
            const icon = themeBtn.querySelector('i');
            body.classList.toggle('light-mode');
            
            if (body.classList.contains('light-mode')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                icon.style.color = '#fbbf24';
                icon.style.textShadow = '0 0 15px rgba(251, 191, 36, 0.8)';
                localStorage.setItem('theme', 'light'); 
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                icon.style.color = ''; 
                icon.style.textShadow = ''; 
                localStorage.setItem('theme', 'dark'); 
            }
        });
    }

    console.log("Web Developer Portfolio Engine: Active 🚀");

    // --- 7. ระบบ Portfolio Tabs (สลับ Projects / Certifications) ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 1. ลบคลาส active ออกจากปุ่มและเนื้อหาทั้งหมด
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // 2. ใส่คลาส active ให้ปุ่มที่โดนกด
            btn.classList.add('active');

            // 3. ดึง id ของเป้าหมายมา แล้วโชว์เนื้อหานั้น
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- 8. ระบบ Modal ป๊อปอัปแกลเลอรีผลงาน (โปรเจกต์ & รูปกิจกรรม) ---
    const modal = document.getElementById('project-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const projectCards = document.querySelectorAll('.open-modal-btn');
    const activityImgs = document.querySelectorAll('.activity-img-click'); // 🟢 เพิ่มตัวจับรูปภาพ
    
    // ดึง Element ใน Modal
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalTech = document.getElementById('modal-tech');
    const modalCounter = document.getElementById('modal-counter');
    const modalBody = document.querySelector('.modal-body'); // 🟢 เพิ่มตัวจับกล่องข้อความ
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    // ตัวแปรเก็บข้อมูลรูปภาพของโปรเจกต์ที่เปิดอยู่
    let projectImages = []; 
    let currentImgIndex = 0; 

    if(modal) {
        // --- 8.1 การทำงานเมื่อกด การ์ดโปรเจกต์ (มีข้อความ) ---
        projectCards.forEach(card => {
            card.addEventListener('click', () => {
                modalBody.style.display = 'block'; // 🟢 โชว์กล่องข้อความ

                const title = card.getAttribute('data-title');
                const rawImages = card.getAttribute('data-img');
                projectImages = rawImages ? rawImages.split(',').map(img => img.trim()) : []; 
                currentImgIndex = 0; 

                const desc = card.getAttribute('data-desc');
                const techs = card.getAttribute('data-tech') ? card.getAttribute('data-tech').split(',').map(tech => tech.trim()) : []; 

                modalTitle.textContent = title;
                modalDesc.textContent = desc;
                
                modalTech.innerHTML = '';
                techs.forEach(tech => {
                    const span = document.createElement('span');
                    span.textContent = tech;
                    modalTech.appendChild(span);
                });

                updateGallery();

                if(projectImages.length > 1) {
                    prevBtn.classList.add('show');
                    nextBtn.classList.add('show');
                } else {
                    prevBtn.classList.remove('show');
                    nextBtn.classList.remove('show');
                }

                modal.classList.add('show');
                document.body.style.overflow = 'hidden'; 
            });
        });

        // --- 8.2 🟢 การทำงานเมื่อกด รูปภาพกิจกรรม (ซ่อนข้อความ) 🟢 ---
        activityImgs.forEach((img, index) => {
            img.addEventListener('click', () => {
                modalBody.style.display = 'none'; // 🟢 ซ่อนกล่องข้อความ

                // ดึง src ของรูปกิจกรรมทั้งหมดมาทำสไลด์
                projectImages = Array.from(activityImgs).map(actImg => actImg.getAttribute('src'));
                currentImgIndex = index; // เริ่มเปิดที่รูปที่กด

                updateGallery();

                if(projectImages.length > 1) {
                    prevBtn.classList.add('show');
                    nextBtn.classList.add('show');
                } else {
                    prevBtn.classList.remove('show');
                    nextBtn.classList.remove('show');
                }

                modal.classList.add('show');
                document.body.style.overflow = 'hidden'; 
            });
        });

        // --- 🖼️ ฟังก์ชันอัปเดตรูปและตัวนับแกลเลอรี 🖼️ ---
        function updateGallery() {
            if(projectImages.length > 0) {
                modalImg.src = projectImages[currentImgIndex]; // อัปเดต Source รูป
                modalCounter.textContent = `${currentImgIndex + 1} / ${projectImages.length}`; // อัปเดตตัวนับ
            } else {
                modalImg.src = ''; // เคลียร์รูป
                modalCounter.textContent = '0 / 0'; // เคลียร์ตัวนับ
            }
        }

        // --- ⚙️ ฟังก์ชันลูกศรสไลด์รูป ซ้าย-ขวา ⚙️ ---
        const navigateGallery = (direction) => {
            if(projectImages.length > 0) {
                currentImgIndex += direction; // อัปเดตดัชนีรูป
                // แก้บั๊ก: วนรูปอัตโนมัติ (Infite Loop)
                if(currentImgIndex < 0) currentImgIndex = projectImages.length - 1; // ย้อนกลับไปรูปสุดท้าย
                if(currentImgIndex >= projectImages.length) currentImgIndex = 0; // ย้อนกลับไปรูปแรก
                updateGallery(); // อัปเดตแกลเลอรี
            }
        };

        prevBtn.addEventListener('click', (e) => { e.stopPropagation(); navigateGallery(-1); }); // กดปุ่มซ้าย
        nextBtn.addEventListener('click', (e) => { e.stopPropagation(); navigateGallery(1); }); // กดปุ่มขวา

        // --- ⚙️ ฟังก์ชันปิด Modal ⚙️ ---
        const closeModal = () => {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            // เคลียร์ข้อมูลรูปภาพหลังปิด
            projectImages = []; 
            modalImg.src = ''; 
        };

        closeModalBtn.addEventListener('click', closeModal);
        
        // กดพื้นที่ว่างข้างนอกเพื่อปิด
        modal.addEventListener('click', (e) => {
            if(e.target === modal || e.target.classList.contains('modal-gallery-wrapper')) closeModal(); 
        });

        // แถม: รองรับการกดปุ่ม Esc เพื่อปิด และปุ่มลูกศรคีย์บอร์ดเพื่อสไลด์รูป
        document.addEventListener('keydown', (e) => {
            if(modal.classList.contains('show')) {
                if(e.key === 'Escape') closeModal(); // กด Esc เพื่อปิด
                if(e.key === 'ArrowLeft') navigateGallery(-1); // กดลูกศรซ้าย
                if(e.key === 'ArrowRight') navigateGallery(1); // กดลูกศรขวา
            }
        });
    }

    console.log("✅ Script Loaded Successfully!");
});