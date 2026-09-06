import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Problem from "./components/Problem";
import Pipeline from "./components/Pipeline";
import LiveDemo from "./components/LiveDemo";
import AIAnalyser from "./components/AIAnalyser";
import Impact from "./components/Impact";
import Architecture from "./components/Architecture";
import References from "./components/References";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Pipeline />
        <LiveDemo />
        <AIAnalyser />
        <Impact />
        <Architecture />
        <References />
      </main>
      <Footer />
    </div>
  );
}
