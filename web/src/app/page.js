import About from "./components/About";
import ContactBar from "./components/ContactBar";
import Environment from "./components/Environment";
import Features from "./components/Features";
import FeaturesCards from "./components/FeaturesCards";
import Footer from "./components/Footer";
import Gallery from "./components/Gallery";
import Hero from "./components/Hero";
import Items from "./components/Items";
import Showroom from "./components/Showroom";
import ElectricAffordable from "./components/ElectricAffordable";
import WhatsAppButton from "./components/WhatsAppButton";
import Team from "./components/Team";

export default function Home() {
  return (
    <>
      <ContactBar />
      <Hero />
      <FeaturesCards />
      <ElectricAffordable />
      <About />
      <Features />
      <Showroom />
      <Items />
      <Environment />
      <Team />
      <Gallery />
      <Footer />
      <WhatsAppButton />
    </>
  );
}
