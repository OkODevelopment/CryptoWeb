// src/pages/Apropos.tsx

import React from 'react';
import { Card } from '@/components/ui/card';

const Apropos: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="p-8 space-y-8">
        {/* Titre Principal */}
        <div>
          <h2 className="text-3xl font-bold mb-4">À Propos de CryptoEx</h2>
          <p className="text-gray-700">
            Bienvenue chez CryptoEx, votre plateforme de confiance pour le trading de crypto-monnaies. Fondée en 2021, CryptoEx s'est rapidement imposée comme un acteur majeur dans l'univers des cryptos grâce à son engagement envers l'innovation, la sécurité et l'expérience utilisateur.
          </p>
        </div>

        {/* Notre Histoire */}
        <div>
          <h3 className="text-2xl font-semibold mb-3">Notre Histoire</h3>
          <p className="text-gray-700">
            CryptoEx a été créée par un groupe de passionnés de technologie et de finance, désireux de démocratiser l'accès aux marchés des crypto-monnaies. Depuis nos débuts modestes, nous avons continuellement élargi notre gamme de services pour répondre aux besoins évolutifs de notre communauté d'utilisateurs.
          </p>
          <p className="text-gray-700 mt-2">
            Notre parcours a été jalonné de défis et de réussites, chaque étape renforçant notre détermination à offrir une plateforme fiable et performante. Aujourd'hui, CryptoEx sert des milliers d'utilisateurs à travers le monde, leur offrant des outils avancés pour maximiser leurs investissements.
          </p>
        </div>

        {/* Notre Mission */}
        <div>
          <h3 className="text-2xl font-semibold mb-3">Notre Mission</h3>
          <p className="text-gray-700">
            Chez CryptoEx, notre mission est de fournir une plateforme de trading de crypto-monnaies sécurisée, transparente et accessible à tous. Nous croyons en un futur où chacun peut participer activement à l'économie numérique, sans barrières ni complexités inutiles.
          </p>
          <p className="text-gray-700 mt-2">
            Nous nous engageons à offrir des outils intuitifs, des données en temps réel et un support client exceptionnel pour garantir que nos utilisateurs puissent prendre des décisions éclairées et optimiser leurs stratégies de trading.
          </p>
        </div>

        {/* Notre Équipe */}
        <div>
          <h3 className="text-2xl font-semibold mb-3">Notre Équipe</h3>
          <p className="text-gray-700">
            L'équipe de CryptoEx est composée d'experts en finance, en technologie blockchain et en développement logiciel. Chacun de nos membres apporte une expertise unique, contribuant à créer une plateforme robuste et innovante.
          </p>
          <p className="text-gray-700 mt-2">
            Notre équipe travaille sans relâche pour intégrer les dernières avancées technologiques, assurer la sécurité des transactions et améliorer constamment l'expérience utilisateur. Nous valorisons la collaboration, l'intégrité et l'excellence dans tout ce que nous entreprenons.
          </p>
        </div>

        {/* Nos Valeurs */}
        <div>
          <h3 className="text-2xl font-semibold mb-3">Nos Valeurs</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Transparence :</strong> Nous croyons en une communication claire et honnête avec nos utilisateurs.</li>
            <li><strong>Sécurité :</strong> La protection des fonds et des données de nos utilisateurs est notre priorité absolue.</li>
            <li><strong>Innovation :</strong> Nous nous efforçons d'intégrer les dernières technologies pour offrir une plateforme à la pointe.</li>
            <li><strong>Accessibilité :</strong> Rendre le trading de crypto-monnaies accessible à tous, quel que soit leur niveau d'expertise.</li>
            <li><strong>Service Client :</strong> Offrir un support réactif et efficace pour répondre aux besoins de nos utilisateurs.</li>
          </ul>
        </div>

        {/* Nos Fondateurs */}
        <div>
          <h3 className="text-2xl font-semibold mb-3">Nos Fondateurs</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Fondateur 1: VERSAYO Franklin */}
            <div className="text-center">
              <img
                src="src\components\ui\images\Gogeta.png"
                alt="VERSAYO Franklin"
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h4 className="text-xl font-semibold">VERSAYO Franklin</h4>
              <p className="text-gray-700">
                Franklin, co-fondateur et directeur des opérations, est responsable de la gestion quotidienne de CryptoEx. Avec une expérience diversifiée en gestion de projet et en stratégie d'entreprise, il veille à ce que les opérations se déroulent efficacement et que les objectifs de l'entreprise soient atteints.
              </p>
            </div>

            {/* Fondateur 2: BEGUIN Balthazar */}
            <div className="text-center">
              <img
                src="src\components\ui\images\Sully.png"
                alt="BEGUIN Balthazar"
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h4 className="text-xl font-semibold">BEGUIN Balthazar</h4>
              <p className="text-gray-700">
                Balthazar, co-fondateur et directeur technique de CryptoEx. Avec plus de 10 ans d'expérience dans le développement logiciel et une expertise approfondie en technologies blockchain, il a été le moteur derrière l'innovation technologique de la plateforme.
              </p>
            </div>

            {/* Fondateur 3: LATOUR Christian */}
            <div className="text-center">
              <img
                src="src\components\ui\images\Kakashi.png"
                alt="LATOUR Christian"
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h4 className="text-xl font-semibold">LATOUR Christian</h4>
              <p className="text-gray-700">
                Christian, co-fondateur et directeur financier, apporte une solide expertise en finance et en gestion des investissements. Son leadership a été crucial pour établir les bases financières solides de CryptoEx et assurer une croissance durable.
              </p>
            </div>
          </div>
        </div>

        {/* Témoignages */}
        <div>
          <h3 className="text-2xl font-semibold mb-3">Ce que nos utilisateurs disent</h3>
          <div className="space-y-4">
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700">
              "CryptoEx a révolutionné ma façon de trader les crypto-monnaies. La plateforme est intuitive et les outils analytiques sont incroyablement utiles." – <span className="font-semibold">Marie D.</span>
            </blockquote>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700">
              "La sécurité offerte par CryptoEx me donne une tranquillité d'esprit totale. Je recommande vivement cette plateforme à tous les traders sérieux." – <span className="font-semibold">Jean-Pierre L.</span>
            </blockquote>
          </div>
        </div>

        {/* Appel à l'Action */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-3">Rejoignez la Révolution Crypto</h3>
          <p className="text-gray-700 mb-4">
            Que vous soyez un trader débutant ou expérimenté, CryptoEx a tout ce dont vous avez besoin pour réussir dans le monde des crypto-monnaies.
          </p>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            Commencez Maintenant
          </a>
        </div>
      </Card>
    </div>
  );
};

export default Apropos;
