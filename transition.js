const ease = "power4.inOut";

document.addEventListener("DOMContentLoaded", () => {
    // Run exit animation on page load
    animateTransitionOut();

    // Handle clicks
    document.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");
            if (href && !href.startsWith("#") && href !== window.location.pathname) {
                event.preventDefault();
                animateTransitionIn().then(() => {
                    window.location.href = href;
                });
            }
        });
    });
});

function animateTransitionIn() {
    return new Promise((resolve) => {
        gsap.set(".transition", { visibility: "visible" });

        gsap.to(".row-1 .block", {
            scaleY: 1,
            duration: 0.8,
            ease: ease,
            stagger: 0.1
        });

        gsap.to(".row-2 .block", {
            scaleY: 1,
            duration: 0.8,
            ease: ease,
            stagger: 0.1,
            delay: 0.05,
            onComplete: resolve
        });
    });
}

function animateTransitionOut() {
    return new Promise((resolve) => {
        gsap.set(".transition", { visibility: "visible" });
        gsap.set(".block", { scaleY: 1 });

        gsap.to(".row-1 .block", {
            scaleY: 0,
            duration: 0.8,
            ease: ease,
            stagger: 0.1
        });

        gsap.to(".row-2 .block", {
            scaleY: 0,
            duration: 0.8,
            ease: ease,
            stagger: 0.1,
            delay: 0.05,
            onComplete: () => {
                gsap.set(".transition", { visibility: "hidden" });
                resolve();
            }
        });
    });
}
