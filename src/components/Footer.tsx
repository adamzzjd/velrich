"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function Footer() {
  const pathname = usePathname();
  const { t } = useApp();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer id="contact" style={styles.footer}>
      <div className="container" style={styles.footerGrid}>
        <div>
          <h3 style={styles.logo}>VELRICH</h3>
          <p style={styles.text}>
            {t("Premium Nigerian menswear, custom tailoring and fabrics. Tailored With Distinction.")}
          </p>
        </div>
        <div>
          <h4 style={styles.heading}>{t("Shop")}</h4>
          <ul style={styles.list}>
            <li><Link href="/shop?category=kaftans" style={styles.link}>{t("Kaftans")}</Link></li>
            <li><Link href="/shop?category=jallabiyas" style={styles.link}>{t("Jallabiyas")}</Link></li>
            <li><Link href="/shop?category=agbada" style={styles.link}>{t("Agbada")}</Link></li>
            <li><Link href="/shop?category=fabrics" style={styles.link}>{t("Fabrics")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 style={styles.heading}>{t("Company")}</h4>
          <ul style={styles.list}>
            <li><Link href="/#about" style={styles.link}>{t("About Us")}</Link></li>
            <li><Link href="/#careers" style={styles.link}>{t("Careers")}</Link></li>
            <li><Link href="/contact" style={styles.link}>{t("Contact")}</Link></li>
            <li><Link href="/#faq" style={styles.link}>{t("FAQ")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 style={styles.heading}>{t("Contact")}</h4>
          <p style={styles.text}>{t("Reach out on WhatsApp for orders and enquiries")}</p>
        </div>
      </div>
      <div style={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} VELRICH. All rights reserved.</p>
      </div>
    </footer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    backgroundColor: "#111111",
    color: "#ffffff",
    padding: "60px 0 30px",
    marginTop: "80px",
  },
  footerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "clamp(24px, 4vw, 40px)",
  },
  logo: {
    fontFamily: "var(--font-sans)",
    fontSize: "24px",
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: "16px",
  },
  text: {
    color: "#aaaaaa",
    fontSize: "14px",
    lineHeight: "1.6",
    marginBottom: "8px",
  },
  heading: {
    fontSize: "16px",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: "20px",
    letterSpacing: "0.5px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  link: {
    color: "#aaaaaa",
    fontSize: "14px",
    display: "inline-block",
    marginBottom: "12px",
    transition: "color 0.2s ease",
  },
  bottom: {
    borderTop: "1px solid #222222",
    marginTop: "40px",
    paddingTop: "20px",
    textAlign: "center",
    fontSize: "13px",
    color: "#666666",
  },
};
