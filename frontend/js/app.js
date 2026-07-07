// ContentForge Application Interactivity

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. MOBILE NAVIGATION HAMBURGER
    // -------------------------------------------------------------
    const hamburgerToggle = document.getElementById('hamburger-toggle');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    
    if (hamburgerToggle && mobileNavOverlay) {
        hamburgerToggle.addEventListener('click', () => {
            hamburgerToggle.classList.toggle('active');
            mobileNavOverlay.classList.toggle('active');
            
            // Prevent body scrolling when mobile nav is open
            if (mobileNavOverlay.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close mobile nav when clicking a link
        const mobileLinks = mobileNavOverlay.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerToggle.classList.remove('active');
                mobileNavOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Header scroll background effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
            header.style.boxShadow = 'none';
        }
    });

    // -------------------------------------------------------------
    // 2. HERO WORKFLOW SIMULATOR
    // -------------------------------------------------------------
    // Mockup elements
    const simCaption = document.getElementById('sim-caption');
    const simHashtags = document.getElementById('sim-hashtags');
    const simImage = document.getElementById('sim-image');
    const simImageLoader = document.getElementById('sim-image-loader');
    const simSuccessPill = document.getElementById('mockup-success-pill');
    
    const schedMon = document.getElementById('sched-mon');
    const schedWed = document.getElementById('sched-wed');
    const schedFri = document.getElementById('sched-fri');
    const scheduleItems = [schedMon, schedWed, schedFri];
    
    // Step Cards
    const stepCards = [
        document.getElementById('step-1'),
        document.getElementById('step-2'),
        document.getElementById('step-3'),
        document.getElementById('step-4')
    ];

    let activeStep = 1;
    let simulatorInterval = null;
    let isUserInteracting = false;

    // Data for the simulation steps
    const simulationData = {
        step1: {
            caption: "Planning my next moves...",
            tags: [],
            image: "assets/images/coffee.png",
            highlightSched: null,
            showSuccess: false
        },
        step2: {
            caption: "Slow mornings & good coffee. Taking it one sip at a time today. What's fueling your Monday?",
            tags: ["#coffeelover", "#slowliving", "#mondaymood", "#cafevibes"],
            image: "assets/images/coffee.png",
            highlightSched: null,
            showSuccess: false
        },
        step3: {
            caption: "Slow mornings & good coffee. Taking it one sip at a time today. What's fueling your Monday?",
            tags: ["#coffeelover", "#slowliving", "#mondaymood", "#cafevibes"],
            image: "assets/images/coffee.png", // Spinner runs in step 3
            highlightSched: null,
            showSuccess: false
        },
        step4: {
            caption: "Slow mornings & good coffee. Taking it one sip at a time today. What's fueling your Monday?",
            tags: ["#coffeelover", "#slowliving", "#mondaymood", "#cafevibes"],
            image: "assets/images/coffee.png",
            highlightSched: schedMon, // Activates Mon 9:00 AM
            showSuccess: true
        }
    };

    function updateStepCardUI(stepNum) {
        stepCards.forEach((card, index) => {
            if (card) {
                if (index + 1 === stepNum) {
                    card.classList.add('active-step');
                } else {
                    card.classList.remove('active-step');
                }
            }
        });
    }

    function runSimulationStep(stepNum) {
        activeStep = stepNum;
        updateStepCardUI(stepNum);

        if (stepNum === 1) {
            // Step 1: Input text / Typing simulation
            simSuccessPill.classList.remove('active');
            scheduleItems.forEach(item => item.classList.remove('active'));
            
            simHashtags.style.opacity = '0';
            simHashtags.innerHTML = '';
            
            // Simulating typing
            const textToType = simulationData.step1.caption;
            simCaption.innerHTML = '<span class="typing-cursor">|</span>';
            let charIndex = 0;
            
            function typeChar() {
                if (charIndex < textToType.length) {
                    simCaption.innerHTML = textToType.substring(0, charIndex + 1) + '<span class="typing-cursor">|</span>';
                    charIndex++;
                    setTimeout(typeChar, 50);
                } else {
                    simCaption.innerHTML = textToType;
                }
            }
            typeChar();
            
        } else if (stepNum === 2) {
            // Step 2: Generation complete (Captions & Hashtags appear)
            simSuccessPill.classList.remove('active');
            scheduleItems.forEach(item => item.classList.remove('active'));
            
            simCaption.innerHTML = simulationData.step2.caption;
            
            // Render tags with animation
            simHashtags.innerHTML = '';
            simHashtags.style.opacity = '1';
            simulationData.step2.tags.forEach((tag, idx) => {
                const span = document.createElement('span');
                span.className = 'tag';
                span.textContent = tag;
                span.style.opacity = '0';
                span.style.transform = 'translateY(5px)';
                span.style.transition = 'all 0.3s ease';
                span.style.transitionDelay = `${idx * 0.1}s`;
                simHashtags.appendChild(span);
                
                // Trigger reflow
                setTimeout(() => {
                    span.style.opacity = '1';
                    span.style.transform = 'translateY(0)';
                }, 50);
            });
            
        } else if (stepNum === 3) {
            // Step 3: Visual Concept creation
            simSuccessPill.classList.remove('active');
            scheduleItems.forEach(item => item.classList.remove('active'));
            
            // Display tags statically
            simCaption.innerHTML = simulationData.step2.caption;
            simHashtags.innerHTML = simulationData.step2.tags.map(t => `<span class="tag">${t}</span>`).join('');
            simHashtags.style.opacity = '1';
            
            // Trigger image loader
            simImageLoader.classList.add('active');
            setTimeout(() => {
                simImageLoader.classList.remove('active');
                simImage.src = simulationData.step3.image;
            }, 800);
            
        } else if (stepNum === 4) {
            // Step 4: Schedule post & Publish
            simCaption.innerHTML = simulationData.step4.caption;
            simHashtags.innerHTML = simulationData.step4.tags.map(t => `<span class="tag">${t}</span>`).join('');
            simHashtags.style.opacity = '1';
            simImage.src = simulationData.step4.image;
            
            // Animate schedule slot active
            scheduleItems.forEach(item => item.classList.remove('active'));
            simulationData.step4.highlightSched.classList.add('active');
            
            // Show Success Pill
            setTimeout(() => {
                simSuccessPill.classList.add('active');
            }, 300);
        }
    }

    // Auto loop function
    function startAutoplay() {
        if (isUserInteracting) return;
        simulatorInterval = setInterval(() => {
            let nextStep = activeStep + 1;
            if (nextStep > 4) nextStep = 1;
            runSimulationStep(nextStep);
        }, 5500);
    }

    // Click step to simulate
    stepCards.forEach(card => {
        if (card) {
            card.addEventListener('click', () => {
                isUserInteracting = true;
                clearInterval(simulatorInterval);
                const stepVal = parseInt(card.getAttribute('data-step'));
                runSimulationStep(stepVal);
                
                // Resume autoplay after 12 seconds of inactivity
                clearTimeout(window.simulatorTimeout);
                window.simulatorTimeout = setTimeout(() => {
                    isUserInteracting = false;
                    startAutoplay();
                }, 12000);
            });
        }
    });

    // Schedule items click in mockup
    scheduleItems.forEach(item => {
        if (item) {
            item.addEventListener('click', () => {
                scheduleItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                // Custom trigger success banner on click
                simSuccessPill.classList.remove('active');
                setTimeout(() => {
                    const schedText = item.querySelector('.day').textContent + " " + item.querySelector('.time').textContent;
                    document.querySelector('.published-title').textContent = "Scheduled for " + schedText;
                    document.querySelector('.likes-sub').textContent = "Content ready to publish!";
                    simSuccessPill.classList.add('active');
                }, 300);
            });
        }
    });

    // Start simulation
    runSimulationStep(1);
    startAutoplay();


    // -------------------------------------------------------------
    // 3. STATS COUNT-UP ANIMATION (IntersectionObserver)
    // -------------------------------------------------------------
    const statNums = document.querySelectorAll('.stat-num');
    
    function animateCounters() {
        statNums.forEach(numElement => {
            const target = parseInt(numElement.getAttribute('data-target'));
            let count = 0;
            const duration = 2000; // 2 seconds
            const frameRate = 1000 / 60; // 60 FPS
            const stepValue = target / (duration / frameRate);
            
            const counterInterval = setInterval(() => {
                count += stepValue;
                if (count >= target) {
                    numElement.textContent = formatNumber(target) + "+";
                    clearInterval(counterInterval);
                } else {
                    numElement.textContent = formatNumber(Math.floor(count)) + "+";
                }
            }, frameRate);
        });
    }

    function formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(0) + "K";
        }
        return num.toString();
    }

    // Intersection observer config
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, { threshold: 0.3 });

    const statsRow = document.querySelector('.stats-row');
    if (statsRow) {
        statsObserver.observe(statsRow);
    }


    // -------------------------------------------------------------
    // 4. INTERACTIVE SANDBOX MODAL
    // -------------------------------------------------------------
    const sandboxModal = document.getElementById('sandbox-modal');
    const openSandboxBtn1 = document.getElementById('cta-start-creating');
    const openSandboxBtnsGlobal = document.querySelectorAll('.get-started-btn');
    const closeSandboxBtn = document.getElementById('close-sandbox');
    const generatorForm = document.getElementById('sandbox-generator-form');
    const postIdeaTextarea = document.getElementById('post-idea');
    const suggestionBtns = document.querySelectorAll('.suggestion-tag-btn');
    
    // Preview sandbox variables
    const previewCaption = document.getElementById('preview-caption');
    const previewHashtags = document.getElementById('preview-hashtags');
    const previewImage = document.getElementById('preview-image');
    const previewImageLoader = document.getElementById('preview-image-loader');
    const previewStatusBadge = document.getElementById('preview-status-badge');
    const previewSuccessPill = document.getElementById('preview-success-pill');
    const sandboxScheduleBtn = document.getElementById('sandbox-schedule-btn');
    const schedDaySelect = document.getElementById('sched-day');
    const successScheduleTime = document.getElementById('success-schedule-time');

    // Theme URLs mapping
    const themeImages = {
        coffee: 'assets/images/coffee.png',
        tech: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=600&auto=format&fit=crop',
        nature: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=600&auto=format&fit=crop',
        fitness: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop'
    };

    // Open/Close sandbox modal
    function openSandbox() {
        sandboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSandbox() {
        sandboxModal.classList.remove('active');
        if (!mobileNavOverlay.classList.contains('active')) {
            document.body.style.overflow = '';
        }
    }

    if (openSandboxBtn1) openSandboxBtn1.addEventListener('click', openSandbox);
    openSandboxBtnsGlobal.forEach(btn => btn.addEventListener('click', openSandbox));
    if (closeSandboxBtn) closeSandboxBtn.addEventListener('click', closeSandbox);

    // Suggestion quick tags
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            postIdeaTextarea.value = btn.textContent;
            postIdeaTextarea.focus();
        });
    });

    // Simulated responses NLP generator
    function generateMockContent(prompt, tone) {
        const text = prompt.toLowerCase();
        
        let caption = "";
        let tags = [];

        // Check keywords
        if (text.includes("coffee") || text.includes("cafe") || text.includes("morning") || text.includes("sunday") || text.includes("slow")) {
            if (tone === "aesthetic") {
                caption = "Slow mornings & sun-dappled tables. Taking it one sip at a time. May your day be as rich as this blend. ✨☕️";
            } else if (tone === "energetic") {
                caption = "Up and early! Fueling the grind with fresh brew and big ambitions. Let's make this day count! ☕️🔥";
            } else if (tone === "professional") {
                caption = "Interesting fact: Studies show a structured morning ritual increases overall focus by 23%. Here is how I set up my calendar. 📝";
            } else {
                caption = "Just coffee, notebook, and good vibes. Happy morning everyone! ☀️";
            }
            tags = ["#coffeelover", "#slowmornings", "#cafevibes", "#journaling", "#morningroutine"];
            
        } else if (text.includes("code") || text.includes("coding") || text.includes("program") || text.includes("tech") || text.includes("workspace")) {
            if (tone === "aesthetic") {
                caption = "Workspace aesthetics. Finding rhythm in the lines of code. Cozy workspace vibes tonight. 💻🌌";
            } else if (tone === "energetic") {
                caption = "Building things that matter! Debugging late, pushing commits. The hustle never stops. Let's build! 🚀💻";
            } else if (tone === "professional") {
                caption = "Clean code is not written overnight. Refactoring this module to improve speed and scale. Developer thoughts. ⚙️";
            } else {
                caption = "Code, coffee, repeat. Debugging some features today. Wish me luck! ☕️💻";
            }
            tags = ["#developer", "#codinglife", "#workspacesetup", "#programmer", "#techstack"];

        } else if (text.includes("gym") || text.includes("workout") || text.includes("fitness") || text.includes("run") || text.includes("active") || text.includes("healthy")) {
            if (tone === "aesthetic") {
                caption = "Movement is medicine. Honouring my body today with a mindful sweat. Feeling strong and centered. 🌿💪";
            } else if (tone === "energetic") {
                caption = "No excuses! Earned, not given. Crush your workouts today, let's smash those goals! ⚡️🏋️‍♂️";
            } else if (tone === "professional") {
                caption = "Tips for recovery: Hydrate, sleep, and never skip active stretching. Your muscles will thank you. 🧬";
            } else {
                caption = "Pre-workout is hitting. Time to sweat! Happy Tuesday team. 🏋️‍♂️";
            }
            tags = ["#fitnessjourney", "#workoutmotivation", "#sweatsession", "#healthylifestyle", "#activebody"];

        } else if (text.includes("nature") || text.includes("hiking") || text.includes("sunshine") || text.includes("travel") || text.includes("peace")) {
            if (tone === "aesthetic") {
                caption = "Nature is not a place to visit, it is home. Finding absolute tranquility in the greenery today. 🌲✨";
            } else if (tone === "energetic") {
                caption = "Out exploring! Breathtaking views, fresh air, and absolute wonders. Go outside today! 🏔️🌲";
            } else if (tone === "professional") {
                caption = "Why ecotherapy works: Being around green space reduces cortisol levels significantly. Highly recommend. 🍃";
            } else {
                caption = "Wandering around in the mountains today. Absolutely stunning view! 🌲";
            }
            tags = ["#naturelovers", "#adventurevisuals", "#freshair", "#scenicviews", "#outdoorturn"];
        } else {
            // General Fallback
            if (tone === "aesthetic") {
                caption = `Capturing the little things today. Let's make every moment an artistic outline. ✨ | Prompt: "${prompt}"`;
            } else if (tone === "energetic") {
                caption = `Let's make it happen! Take action on your goals today and watch the magic unfold! 🚀 | Prompt: "${prompt}"`;
            } else if (tone === "professional") {
                caption = `A structured approach ensures reliable output. Here is a breakdown of my current ideas. 📊 | Prompt: "${prompt}"`;
            } else {
                caption = `Just another day creating and designing. What are you working on? | Prompt: "${prompt}"`;
            }
            tags = ["#creativity", "#contentcreation", "#productivity", "#dailyvlog"];
        }

        return { caption, tags };
    }

    // Handle Sandbox Submission
    if (generatorForm) {
        generatorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const promptValue = postIdeaTextarea.value;
            const toneValue = document.getElementById('post-tone').value;
            const imageStyle = document.getElementById('post-image-style').value;
            const submitBtn = document.getElementById('sandbox-submit-btn');

            // Set button to loading
            submitBtn.textContent = "Forging Content...";
            submitBtn.disabled = true;

            // Trigger loader in preview
            previewImageLoader.classList.add('active');
            previewSuccessPill.classList.remove('active');

            setTimeout(() => {
                // Generate content
                const data = generateMockContent(promptValue, toneValue);

                // Update Preview Card
                previewCaption.textContent = data.caption;
                previewHashtags.innerHTML = data.tags.map(t => `<span class="tag">${t}</span>`).join('');
                
                // Update Theme Image
                previewImage.src = themeImages[imageStyle] || themeImages.coffee;
                
                // Hide loader
                previewImageLoader.classList.remove('active');

                // Update Status Badge
                previewStatusBadge.textContent = "Ready";
                previewStatusBadge.className = "preview-badge-status ready";

                // Enable scheduling
                sandboxScheduleBtn.removeAttribute('disabled');
                sandboxScheduleBtn.className = "btn btn-primary btn-block btn-glow";
                sandboxScheduleBtn.textContent = "Schedule Post";

                // Reset submit button
                submitBtn.textContent = "Generate Post Preview";
                submitBtn.disabled = false;

            }, 1200);
        });
    }

    // Schedule sandbox post
    if (sandboxScheduleBtn) {
        sandboxScheduleBtn.addEventListener('click', () => {
            const timeValue = schedDaySelect.value;
            
            // Show Success Pill
            successScheduleTime.textContent = `Active: ${timeValue}`;
            previewSuccessPill.classList.add('active');

            // Update status badge
            previewStatusBadge.textContent = "Scheduled";
            previewStatusBadge.className = "preview-badge-status ready";

            // Update schedule button
            sandboxScheduleBtn.textContent = "Scheduled Successfully! 🎉";
            sandboxScheduleBtn.setAttribute('disabled', 'true');
            sandboxScheduleBtn.className = "btn btn-secondary btn-block disabled";
        });
    }


    // -------------------------------------------------------------
    // 5. DEMO TOUR MODAL
    // -------------------------------------------------------------
    const demoModal = document.getElementById('demo-modal');
    const watchDemoBtn = document.getElementById('cta-watch-demo');
    const closeDemoBtn = document.getElementById('close-demo');
    const tourStepTabs = document.querySelectorAll('.tour-step-tab');
    const tourSlides = document.querySelectorAll('.tour-slide');
    const tourPrevBtn = document.getElementById('tour-prev-btn');
    const tourNextBtn = document.getElementById('tour-next-btn');
    
    let currentSlide = 0;

    function openDemo() {
        demoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        setSlide(0);
    }

    function closeDemo() {
        demoModal.classList.remove('active');
        if (!mobileNavOverlay.classList.contains('active')) {
            document.body.style.overflow = '';
        }
    }

    if (watchDemoBtn) watchDemoBtn.addEventListener('click', openDemo);
    if (closeDemoBtn) closeDemoBtn.addEventListener('click', closeDemo);

    function setSlide(index) {
        currentSlide = index;

        // Update tabs active state
        tourStepTabs.forEach((tab, i) => {
            if (i === index) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Update slides active state
        tourSlides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Update navigation buttons
        if (index === 0) {
            tourPrevBtn.setAttribute('disabled', 'true');
        } else {
            tourPrevBtn.removeAttribute('disabled');
        }

        if (index === tourSlides.length - 1) {
            tourNextBtn.textContent = "Finish Tour";
        } else {
            tourNextBtn.textContent = "Next Step";
        }
    }

    // Step tabs click
    tourStepTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            setSlide(index);
        });
    });

    // Prev / Next click
    if (tourPrevBtn) {
        tourPrevBtn.addEventListener('click', () => {
            if (currentSlide > 0) {
                setSlide(currentSlide - 1);
            }
        });
    }

    if (tourNextBtn) {
        tourNextBtn.addEventListener('click', () => {
            if (currentSlide < tourSlides.length - 1) {
                setSlide(currentSlide + 1);
            } else {
                closeDemo();
            }
        });
    }
});
