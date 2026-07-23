import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import InsightFlow from '../components/InsightFlow';
import Dashboard from '../components/Dashboard';
import SignatureInteraction from '../components/SignatureInteraction';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main className="bg-bg min-h-screen">
      <Navbar />
      <Hero />
      <InsightFlow />
      <Dashboard />
      <SignatureInteraction />
      <Footer />
    </main>
  );
}