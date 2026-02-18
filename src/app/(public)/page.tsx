import Hero from "@/components/Hero";
import AuthRedirect from "@/components/AuthRedirect";
import HowItWorks from "@/components/HowItWorks";
import DemoProfiles from "@/components/DemoProfiles";
import Pricing from "@/components/Pricing";

export default function Home() {
  return (
    <main>
      <AuthRedirect />
      <Hero />
      <HowItWorks />
      <DemoProfiles />
      <Pricing />
    </main>
  );
}
