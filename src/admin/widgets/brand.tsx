import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { useEffect } from "react"

const BrandWidget = () => {
    useEffect(() => {
        // Hacky but effective way to rebrand Medusa Admin v2 since it lacks native options
        const updateBranding = () => {
            const headings = document.querySelectorAll("h1");
            headings.forEach(h1 => {
                if (h1.textContent === "Welcome back" || h1.textContent === "Welcome to Organichub") {
                    h1.textContent = "organicshop admin";
                }
            });

            const paragraphs = document.querySelectorAll("p");
            paragraphs.forEach(p => {
                if (p.textContent?.includes("Medusa")) {
                    p.textContent = "Sign in to manage your Deshi grocery store.";
                }
            });

            // 2. Hide Medusa Logos (SVGs that look like the logo)
            // Usually, the logo is an SVG without a specific ID, but it's often the first large SVG or wrapped in a specific link.
            const links = document.querySelectorAll("a");
            links.forEach(link => {
                if (link.href.includes("medusajs.com")) {
                    link.style.display = "none";
                }
            });

            // Replace topbar logo text if possible or hide the medusa logo icon
            const svgs = document.querySelectorAll("svg");
            svgs.forEach(svg => {
                // The Medusa logo SVG usually has a specific viewBox or class
                if (svg.getAttribute("viewBox") === "0 0 32 32" || svg.classList.contains("text-ui-fg-interactive")) {
                    // Hide it or replace it
                    svg.style.display = "none";
                }
            });

            // Update the document title
            if (document.title.includes("Medusa") || document.title.includes("Organichub")) {
                document.title = "organicshop admin";
            }
        };

        const interval = setInterval(updateBranding, 100);
        return () => clearInterval(interval);
    }, []);

    return null;
}

export const config = defineWidgetConfig({
    zone: ["login.before", "topbar.before"],
})

export default BrandWidget
