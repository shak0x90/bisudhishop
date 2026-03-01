"use client"
import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export default function FloatingWhatsApp() {
    // Use a generic placeholder number or context if needed, but for Organichub we'll use a direct link
    const phoneNumber = "8801711000000"; // Assuming the generic phone number from the footer
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=Hello%20Organichub,%20I%20have%20a%20question`;

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:pr-4 hover:w-auto transition-all duration-300 ease-in-out group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366]"
                aria-label="Chat with us on WhatsApp"
            >
                <span className="sr-only">Chat on WhatsApp</span>
                <FaWhatsapp className="w-8 h-8 group-hover:mr-2 transition-all duration-300" />
                <span className="hidden group-hover:block whitespace-nowrap font-medium text-sm pr-1">
                    Chat with us
                </span>
            </a>
        </div>
    );
}
