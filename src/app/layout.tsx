import { Outfit as OutfitFont, Playfair_Display as PlayfairFont } from "next/font/google";
import "./globals.css";

// Self-hosted fonts via next/font: no render-blocking external request at
// startup, no Google Fonts fetch during dev compiles (big win on slow
// connections), and zero layout shift. CSS variables are wired below and
// referenced from globals.css via --font-sans / --font-serif.
const outfit = OutfitFont({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});
const playfair = PlayfairFont({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} ${playfair.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = document.cookie.match(/(?:^|; )store_theme=([^;]*)/);
                  if (theme) {
                    document.documentElement.setAttribute("data-theme", theme[1]);
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

