import KukirinHero from '@/components/kukirin/KukirinHero';
import KukirinModels from '@/components/kukirin/KukirinModels';
import KukirinFeatures from '@/components/kukirin/KukirinFeatures';
import KukirinCTA from '@/components/kukirin/KukirinCTA';
import KukirinFooter from '@/components/kukirin/KukirinFooter';

export default function HomePage() {
  return (
    <main>
      <KukirinHero />
      <KukirinModels />
      <KukirinFeatures />
      <KukirinCTA />
      <KukirinFooter />
    </main>
  );
}
