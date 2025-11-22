import SmoothScroll from "./components/SmoothScroll";
import "./globals.css";



export const metadata = {
  title: "Nora EV",
  description: "Nayi Soch, Naya Safar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={``}
      >
        <SmoothScroll>
          {children}
        </SmoothScroll>
        
      </body>
    </html>
  );
}
