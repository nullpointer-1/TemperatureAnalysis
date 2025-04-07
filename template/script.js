document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll("nav ul li a");

    navLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent default jump

            const targetId = link.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 60, // Adjusts for fixed navbar height
                    behavior: "smooth" // Enables smooth scrolling
                });
            }
        });
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const text = "{ *ptr = NULL; }";
    let typingElement = document.querySelector(".typing");
    let logoElement = document.querySelector(".logo");

    function startTypingAnimation() {
        let i = 0;
        typingElement.innerHTML = "";
        typingElement.style.display = "inline-block";
        typingElement.style.opacity = "1";
        logoElement.style.display = "none";
        logoElement.style.opacity = "0";

        // Typing effect animation
        function typeWriter() {
            if (i < text.length) {
                typingElement.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                setTimeout(() => {
                    // Glitch effect during transition
                    gsap.to(".typing", { duration: 0.1, x: -5, repeat: 4, yoyo: true, opacity: 0.9 });
                    gsap.to(".typing", { duration: 0.1, scale: 1.1, filter: "blur(0px)", delay: 0.2 });
                    gsap.to(".typing", { duration: 0.2, scale: 0.9, filter: "blur(0px)", delay: 0.4 });
                    gsap.to(".typing", { duration: 0.3, opacity: 0, delay: 0.6 });

                    setTimeout(() => {
                        // Logo reveal effect
                        gsap.fromTo(".logo", 
                            { opacity: 0, scale: 0.6,  }, 
                            { opacity: 1, scale: 1,  duration: 0.5 }
                        );
                        logoElement.style.display = "block";

                        setTimeout(() => {
                            // Fade out logo and restart animation
                            gsap.to(".logo", { duration: 0.5, opacity: 0, scale: 0.9 });
                            setTimeout(startTypingAnimation, 1000); // Restart typing effect
                        }, 2500); // Show logo for 2.5 seconds before restarting
                    }, 900);
                }, 1000);
            }
        }

        typeWriter();
    }

    startTypingAnimation();
});

document.addEventListener("DOMContentLoaded", () => {
    // Select the Temperature Analysis card
    const temperatureCard = document.getElementById("load-temperature");
    const contentArea = document.getElementById("content-area");

    temperatureCard.addEventListener("click", () => {
        // Load the temperature.html content dynamically
        fetch("E:\temperature\CTS_Null_Pointers\NullPointers_Project1\temperature.html")
            .then(response => response.text())
            .then(data => {
                contentArea.innerHTML = data; // Insert temperature page content
            })
            .catch(error => console.error("Error loading the Temperature Analysis page:", error));
    });
});