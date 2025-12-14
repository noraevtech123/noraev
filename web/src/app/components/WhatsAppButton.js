"use client";
import { useEffect } from "react";

const WatiWidget = () => {
  useEffect(() => {
    const url =
      "https://wati-integration-prod-service.clare.ai/v2/watiWidget.js?86988";
    const s = document.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    s.src = url;

    const options = {
      enabled: true,
      chatButtonSetting: {
        backgroundColor: "#00e785",
        ctaText: "Chat with us",
        borderRadius: "25",
        marginLeft: "0",
        marginRight: "20",
        marginBottom: "20",
        ctaIconWATI: false,
        position: "right",
      },
      brandSetting: {
        brandName: "NoRa EV",
        brandSubTitle: "Nayi Soch, Naya Safar",
        brandImg: "/horizontal-logo.svg",
        welcomeText: "Hi there!\nHow can I help you?",
        messageText: "Hello, %0A I have a question about {{page_link}}",
        backgroundColor: "#00e785",
        ctaText: "Chat with us",
        borderRadius: "25",
        autoShow: false,
        phoneNumber: "923096664423",
      },
    };

    s.onload = function () {
      if (typeof window !== "undefined" && window.CreateWhatsappChatWidget) {
        window.CreateWhatsappChatWidget(options);
      }
    };

    const x = document.getElementsByTagName("script")[0];
    if (x && x.parentNode) {
      x.parentNode.insertBefore(s, x);
    }

    return () => {
      // Cleanup: remove the script on unmount
      if (s.parentNode) {
        s.parentNode.removeChild(s);
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default WatiWidget;
