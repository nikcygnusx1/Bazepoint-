import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PromptDemo } from './components/PromptDemo';
import { Mechanism } from './components/Mechanism';
import { Supply } from './components/Supply';
import { Enemy } from './components/Enemy';
import { FinalPush } from './components/FinalPush';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-bz-bg font-sans selection:bg-bz-teal-light selection:text-bz-teal">
      <Header />
      <main>
        <Hero />
        <PromptDemo />
        <Mechanism />
        <Supply />
        <Enemy />
        <FinalPush />
      </main>
      <Footer />
    </div>
  );
}
