import Image from "next/image";
import Hero from "./components/Hero";
import About from "./components/About";
import Features from "./components/Features";
import Showroom from "./components/Showroom";
import Items from "./components/Items";
import Environment from "./components/Environment";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
    <Hero />
    <About />
    <Features />
    <Showroom />
    <Items />
    <Environment />
    <Footer />
    </>
  );
}
