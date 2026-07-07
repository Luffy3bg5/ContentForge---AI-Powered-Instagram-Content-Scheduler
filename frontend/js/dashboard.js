/**
 * ContentForge - Dashboard Logic
 * Handles Authentication state, UI population, and mobile interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Page Protection (Auth Check)
    const token = localStorage.getItem("token");
    
    if (!token) {
        // Redirect if not authenticated
        window.location.replace("login.html");
        return; 
    }

    // 2. User Data Population
    const userEmail = localStorage.getItem("userEmail") || "Guest";
    const emailDisplays = document.querySelectorAll(".display-email");
    const avatarInitials = document.querySelectorAll(".avatar-initials");
    
    // Set email text across all designated elements
    emailDisplays.forEach(el => {
        el.textContent = userEmail;
    });

    // Generate and set avatar initial (First letter of email/Guest)
    const initial = userEmail.charAt(0).toUpperCase();
    avatarInitials.forEach(el => {
        el.textContent = initial;
    });


    // 3. Mobile Sidebar Toggle Logic
    const btnMobileMenu = document.getElementById("btnMobileMenu");
    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    const toggleSidebar = () => {
        const isOpen = sidebar.classList.contains("mobile-open");
        
        if (isOpen) {
            sidebar.classList.remove("mobile-open");
            sidebarOverlay.classList.remove("active");
            sidebarOverlay.setAttribute("aria-hidden", "true");
        } else {
            sidebar.classList.add("mobile-open");
            sidebarOverlay.classList.add("active");
            sidebarOverlay.setAttribute("aria-hidden", "false");
        }
    };

    if (btnMobileMenu && sidebar && sidebarOverlay) {
        btnMobileMenu.addEventListener("click", toggleSidebar);
        
        // Close sidebar when clicking outside on mobile
        sidebarOverlay.addEventListener("click", toggleSidebar);
    }


    // 4. Logout Functionality
    const btnLogout = document.getElementById("btnLogout");

    if (btnLogout) {
        btnLogout.addEventListener("click", (e) => {
            e.preventDefault();
            
            // Clear authentication data
            localStorage.removeItem("token");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userId");

            // Redirect to login
            window.location.replace("login.html");
        });
    }

    // 5. Instagram Connection (Version 2 Placeholder)
    const btnConnectInstagram = document.getElementById("btnConnectInstagram");
    
    if (btnConnectInstagram) {
        btnConnectInstagram.addEventListener("click", () => {
            // Create custom toast notification UI
            const toast = document.createElement("div");
            toast.className = "toast-notification";
            toast.textContent = "Instagram integration will be available in Version 2.";
            
            document.body.appendChild(toast);
            
            // Trigger animation
            requestAnimationFrame(() => {
                toast.classList.add("show");
            });
            
            // Remove toast gracefully
            setTimeout(() => {
                toast.classList.remove("show");
                setTimeout(() => toast.remove(), 300); // Allow transition to complete
            }, 3000);
        });
    }

    async  function  loadDashboard(){
        try{
            const  response  = await fetch("http://localhost:5000/api/posts" , {
                headers :{
                    Authorization : `Bearer ${token}`
                }
            });

            const data  =  await response.json() ;

            if(!data.success) return ;

            const posts = data.posts;

            //Statistics 
            const  drafts = posts.filter(post=> post.status == "draft").length ;


            const scheduled = posts.filter(post => post.status === "scheduled").length ;

            const ready = posts.filter(post => post.status === "ready").length ;

            const posted = posts.filter(post => post.status === "posted").length ;

            document.getElementById("draftCount").textContent = drafts;
            document.getElementById("scheduledCount").textContent = scheduled ;
            document.getElementById("readyCount").textContent = ready;
            document.getElementById("postedCount").textContent = posted;
                    }
            catch(error){
                console.error(error);
                
        }
    }
        loadDashboard();
});