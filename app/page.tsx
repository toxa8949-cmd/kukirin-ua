import KukirinHero from '@/components/kukirin/KukirinHero';
import KukirinModels from '@/components/kukirin/KukirinModels';
import KukirinFeatures from '@/components/kukirin/KukirinFeatures';
import KukirinCTA from '@/components/kukirin/KukirinCTA';
import KukirinFooter from '@/components/kukirin/KukirinFooter';

// Регенерація головної кожні 5 хв (на випадок якщо revalidatePath з admin
// не спрацював — наприклад через CDN edge cache).
export const revalidate = 300;

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
