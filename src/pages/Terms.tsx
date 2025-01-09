import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Terms() {
  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Conditions d'utilisation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 overflow-y-auto max-h-[80vh]">
          {/* Section 1: Introduction */}
          <section>
            <h1 className="text-2xl font-bold">1. Introduction</h1>

            <h2 className="text-xl font-semibold mt-4">1.1. Contexte</h2>
            <p>
              Avec la popularité croissante des crypto-monnaies, les plateformes d'échange telles que Binance jouent un rôle central en facilitant le trading et les transactions entre utilisateurs. Cependant, le développement d'une telle plateforme nécessite une infrastructure backend robuste. Ce projet vise à créer une version simplifiée de Binance en se concentrant uniquement sur le front-end, en utilisant des technologies modernes comme React et des solutions de stockage local pour simuler les fonctionnalités essentielles.
            </p>

            <h2 className="text-xl font-semibold mt-4">1.2. Objectif</h2>
            <p>
              Développer une application front-end interactive et intuitive en React qui simule les principales fonctionnalités d'une plateforme d'échange de crypto-monnaies, sans nécessiter de backend réel. L'application permettra aux utilisateurs de trader des crypto-monnaies, de partager des opinions via un mini-blog, d'effectuer des virements et échanges de tokens, et de gérer des comptes utilisateur de manière fictive.
            </p>
          </section>

          {/* Section 2: Portée du Projet */}
          <section>
            <h1 className="text-2xl font-bold">2. Portée du Projet</h1>

            <h2 className="text-xl font-semibold mt-4">2.1. Fonctionnalités Principales</h2>

            {/* Trading de Crypto-Monnaies */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Trading de Crypto-Monnaies</h3>
              <ul className="list-disc list-inside mt-2">
                <li>Affichage des prix en temps réel via une API publique.</li>
                <li>Placement d'ordres de marché et d'ordres limités.</li>
                <li>Gestion d'un portefeuille virtuel.</li>
                <li>Historique des transactions.</li>
              </ul>
            </div>

            {/* Mini-Blog pour Chaque Crypto */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Mini-Blog pour Chaque Crypto</h3>
              <ul className="list-disc list-inside mt-2">
                <li>Section de discussion dédiée pour chaque crypto-monnaie.</li>
                <li>Publication, modification, suppression de posts.</li>
                <li>Système de likes/upvotes.</li>
                <li>Tri des posts par date et pertinence.</li>
              </ul>
            </div>

            {/* Gestion des Comptes Utilisateurs */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Gestion des Comptes Utilisateurs</h3>
              <ul className="list-disc list-inside mt-2">
                <li>Système de connexion et inscription simulé.</li>
                <li>Portefeuilles virtuels uniques par utilisateur.</li>
                <li>Déconnexion et reconnexion.</li>
              </ul>
            </div>

            {/* Système de Virements et Échanges Internes */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Système de Virements et Échanges Internes</h3>
              <ul className="list-disc list-inside mt-2">
                <li>Simuler des retraits vers des portefeuilles externes.</li>
                <li>Simuler des dépôts de fonds fictifs.</li>
                <li>Échanges de tokens entre utilisateurs inscrits.</li>
                <li>Historique des virements et retraits.</li>
              </ul>
            </div>

            {/* Détail de Chaque Crypto */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Détail de Chaque Crypto</h3>
              <ul className="list-disc list-inside mt-2">
                <li>Page dédiée avec description et statistiques.</li>
                <li>Graphique interactif de l'évolution des prix.</li>
                <li>Section blog associée.</li>
              </ul>
            </div>

            {/* Fonctionnalités Complémentaires (Bonus) */}
            <h2 className="text-xl font-semibold mt-6">2.2. Fonctionnalités Complémentaires (Bonus)</h2>
            <ul className="list-disc list-inside mt-2">
              <li>Actualisation des prix plus rapide pour la démo.</li>
              <li>Tri des posts par pertinence.</li>
              <li>Notifications locales pour les échanges réussis.</li>
              <li>Validation des virements avec vérifications de solde et existence du destinataire.</li>
              <li>Valeur totale du portefeuille.</li>
            </ul>

            {/* Exclusions */}
            <h2 className="text-xl font-semibold mt-6">2.3. Exclusions</h2>
            <ul className="list-disc list-inside mt-2">
              <li>Aucun backend réel n'est implémenté ; toutes les données sont stockées localement.</li>
              <li>Sécurité des données utilisateur limitée à l'utilisation de localStorage.</li>
            </ul>
          </section>

          {/* Section 3: Exigences Fonctionnelles */}
          <section>
            <h1 className="text-2xl font-bold">3. Exigences Fonctionnelles</h1>

            {/* 3.1 Trading de Crypto-Monnaies */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold">3.1. Trading de Crypto-Monnaies</h2>

              {/* Récupération des Prix */}
              <div className="mt-2">
                <h3 className="text-lg font-semibold">Récupération des Prix :</h3>
                <ul className="list-disc list-inside mt-1">
                  <li>Intégration avec CoinGecko API ou Binance API.</li>
                  <li>Mise à jour des prix en fonction des limites de l'API gratuite.</li>
                  <li>Pour la démo, prévoir une actualisation manuelle ou plus rapide via le code.</li>
                </ul>
              </div>

              {/* Placement d'Ordres */}
              <div className="mt-2">
                <h3 className="text-lg font-semibold">Placement d'Ordres :</h3>
                <ul className="list-disc list-inside mt-1">
                  <li>Ordre au Marché : Exécution immédiate au prix actuel.</li>
                  <li>Ordre Limité : Exécution lorsque le prix cible est atteint.</li>
                  <li>Stockage des ordres limités dans localStorage.</li>
                </ul>
              </div>

              {/* Gestion du Portefeuille */}
              <div className="mt-2">
                <h3 className="text-lg font-semibold">Gestion du Portefeuille :</h3>
                <ul className="list-disc list-inside mt-1">
                  <li>Affichage du solde en dollars fictifs.</li>
                  <li>Affichage des cryptos détenues avec quantités et valeurs actuelles.</li>
                  <li>Calcul de la valeur totale du portefeuille.</li>
                </ul>
              </div>

              {/* Historique des Transactions */}
              <div className="mt-2">
                <h3 className="text-lg font-semibold">Historique des Transactions :</h3>
                <ul className="list-disc list-inside mt-1">
                  <li>Enregistrement de chaque transaction avec date, type d'ordre, montant, et prix.</li>
                  <li>Affichage dans le tableau de bord utilisateur.</li>
                </ul>
              </div>
            </div>

            {/* 3.2 Mini-Blog pour Chaque Crypto */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold">3.2. Mini-Blog pour Chaque Crypto</h2>

              {/* Gestion des Posts */}
              <div className="mt-2">
                <h3 className="text-lg font-semibold">Gestion des Posts :</h3>
                <ul className="list-disc list-inside mt-1">
                  <li>Publication de posts avec titre, contenu, et date.</li>
                  <li>Modification et suppression des propres posts par l'utilisateur.</li>
                  <li>Système de likes/upvotes pour évaluer les posts.</li>
                </ul>
              </div>

              {/* Tri et Réactions */}
              <div className="mt-2">
                <h3 className="text-lg font-semibold">Tri et Réactions :</h3>
                <ul className="list-disc list-inside mt-1">
                  <li>Tri des posts par date ou par pertinence (nombre de likes).</li>
                  <li>Affichage des réactions en temps réel.</li>
                </ul>
              </div>
            </div>

            {/* 3.3 Gestion des Comptes Utilisateurs */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold">3.3. Gestion des Comptes Utilisateurs</h2>

              {/* Connexion et Inscription */}
              <div className="mt-2">
                <h3 className="text-lg font-semibold">Connexion et Inscription :</h3>
                <ul className="list-disc list-inside mt-1">
                  <li>Formulaire de connexion avec nom d'utilisateur et mot de passe.</li>
                  <li>Stockage des utilisateurs dans localStorage.</li>
                  <li>Authentification simulée sans vérification réelle.</li>
                </ul>
              </div>

              {/* Gestion des Comptes */}
              <div className="mt-2">
                <h3 className="text-lg font-semibold">Gestion des Comptes :</h3>
                <ul className="list-disc list-inside mt-1">
                  <li>Portefeuille virtuel unique pour chaque utilisateur.</li>
                  <li>Fonctionnalités de déconnexion et reconnexion.</li>
                </ul>
              </div>
            </div>

            {/* 3.4 Système de Virements et Échanges Internes */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold">3.4. Système de Virements et Échanges Internes</h2>

              {/* Retraits et Dépôts */}
              <div className="mt-2">
                <h3 className="text-lg font-semibold">Retraits et Dépôts :</h3>
                <ul className="list-disc list-inside mt-1">
                  <li>Simuler le retrait de cryptos vers une adresse fictive.</li>
                  <li>Simuler le dépôt de fonds fictifs en dollars ou en cryptos.</li>
                  <li>Mise à jour du portefeuille en conséquence.</li>
                  <li>Enregistrement dans l'historique des transactions.</li>
                </ul>
              </div>

              {/* Échanges de Tokens */}
              <div className="mt-2">
                <h3 className="text-lg font-semibold">Échanges de Tokens :</h3>
                <ul className="list-disc list-inside mt-1">
                  <li>Envoi de tokens entre utilisateurs inscrits.</li>
                  <li>Interface de sélection du destinataire, de la crypto, et du montant.</li>
                  <li>Mise à jour automatique des portefeuilles des deux utilisateurs.</li>
                  <li>Notifications locales de succès des échanges.</li>
                  <li>Validation des virements (solde suffisant, destinataire existant).</li>
                  <li>Enregistrement des échanges dans l'historique.</li>
                </ul>
              </div>
            </div>

            {/* 3.5 Détail de Chaque Crypto */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold">3.5. Détail de Chaque Crypto</h2>

              {/* Page Dédiée */}
              <div className="mt-2">
                <h3 className="text-lg font-semibold">Page Dédiée :</h3>
                <ul className="list-disc list-inside mt-1">
                  <li>Description complète de la crypto (nom, symbole, etc.).</li>
                  <li>Graphique interactif de l'évolution des prix (Chart.js ou Recharts).</li>
                  <li>Statistiques actuelles (volume, capitalisation, variation 24h).</li>
                </ul>
              </div>

              {/* Section Blog Associée */}
              <div className="mt-2">
                <h3 className="text-lg font-semibold">Section Blog Associée :</h3>
                <ul className="list-disc list-inside mt-1">
                  <li>Affichage de la section discussion spécifique à la crypto.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4: Exigences Non Fonctionnelles */}
          <section>
            <h1 className="text-2xl font-bold">4. Exigences Non Fonctionnelles</h1>

            {/* 4.1 Performance */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold">4.1. Performance</h2>
              <p className="mt-2">
                L'application doit être réactive et fluide, avec des temps de chargement minimaux. Les mises à jour des prix doivent se faire sans ralentir l'interface utilisateur.
              </p>
            </div>

            {/* 4.2 Sécurité */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold">4.2. Sécurité</h2>
              <p className="mt-2">
                Bien que l'application ne dispose pas de backend, il est essentiel de sécuriser les données stockées localement (bien que limité par les capacités de localStorage). Gestion correcte des sessions utilisateur pour éviter des accès non autorisés.
              </p>
            </div>

            {/* 4.3 Interface Utilisateur (UI) et Expérience Utilisateur (UX) */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold">4.3. Interface Utilisateur (UI) et Expérience Utilisateur (UX)</h2>
              <p className="mt-2">
                Utilisation cohérente des composants de la bibliothèque shadcn/ui pour une apparence professionnelle. Navigation intuitive entre les différentes sections de l'application. Design réactif adapté aux différentes tailles d'écran (mobile, tablette, desktop).
              </p>
            </div>

            {/* 4.4 Maintenabilité et Scalabilité */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold">4.4. Maintenabilité et Scalabilité</h2>
              <p className="mt-2">
                Code bien structuré et modularisé pour faciliter les modifications et ajouts futurs. Documentation claire du code et des composants utilisés.
              </p>
            </div>

            {/* 4.5 Compatibilité */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold">4.5. Compatibilité</h2>
              <p className="mt-2">
                Compatibilité avec les navigateurs modernes (Chrome, Firefox, Edge, Safari). Fonctionnement fluide sur les appareils mobiles et de bureau.
              </p>
            </div>
          </section>

          {/* Section 5: Technologies et Outils */}
          <section>
            <h1 className="text-2xl font-bold">5. Technologies et Outils</h1>

            {/* 5.1 Frontend */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold">5.1. Frontend</h2>
              <ul className="list-disc list-inside mt-2">
                <li>React : Bibliothèque principale pour la construction de l'interface utilisateur.</li>
                <li>React Router : Gestion de la navigation entre les différentes pages.</li>
                <li>shadcn/ui : Bibliothèque de composants UI pour une interface cohérente et élégante.</li>
                <li>Axios : Gestion des appels API pour récupérer les données des crypto-monnaies.</li>
                <li>Chart.js / Recharts : Bibliothèque pour la création de graphiques interactifs.</li>
              </ul>
            </div>

            {/* 5.2 Stockage Local */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold">5.2. Stockage Local</h2>
              <ul className="list-disc list-inside mt-2">
                <li>localStorage : Stockage des données utilisateur, portefeuilles, ordres, transactions, et posts.</li>
              </ul>
            </div>

            {/* 5.3 Gestion d'État */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold">5.3. Gestion d'État</h2>
              <ul className="list-disc list-inside mt-2">
                <li>Context API ou Redux : Gestion de l'état global de l'application, notamment pour l'authentification et le portefeuille.</li>
              </ul>
            </div>

            {/* 5.4 Versioning et Collaboration */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold">5.4. Versioning et Collaboration</h2>
              <ul className="list-disc list-inside mt-2">
                <li>Git : Gestion du versioning du code source.</li>
                <li>GitHub : Hébergement du code source et collaboration en équipe.</li>
              </ul>
            </div>

            {/* 5.5 Outils de Développement */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold">5.5. Outils de Développement</h2>
              <ul className="list-disc list-inside mt-2">
                <li>Vite ou Create React App : Initialisation rapide du projet React.</li>
                <li>ESLint et Prettier : Linting et formatage du code pour assurer la qualité et la cohérence.</li>
                <li>Jest / React Testing Library : Tests unitaires et d'intégration (si nécessaire).</li>
              </ul>
            </div>
          </section>

          {/* Section 6: Contraintes */}
          <section>
            <h1 className="text-2xl font-bold">6. Contraintes</h1>

            {/* 6.1 Délais */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold">6.1. Délais</h2>
              <p className="mt-2">
                Le projet doit être finalisé et prêt pour la démonstration au plus tard vendredi à 16h15. Toute soumission au-delà de cette date entraînera une perte de points.
              </p>
            </div>

            {/* 6.2 Équipe */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold">6.2. Équipe</h2>
              <p className="mt-2">
                7 groupes de 3 personnes chacun. Collaboration efficace et répartition équilibrée des tâches au sein de chaque groupe.
              </p>
            </div>

            {/* 6.3 Limitations Techniques */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold">6.3. Limitations Techniques</h2>
              <ul className="list-disc list-inside mt-2">
                <li>Absence de backend réel : toutes les fonctionnalités doivent être simulées en utilisant le front-end et le stockage local.</li>
                <li>Limites imposées par les API gratuites (taux de requêtes, données disponibles).</li>
              </ul>
            </div>
          </section>

          {/* Section 7: Livrables */}
          <section>
            <h1 className="text-2xl font-bold">7. Livrables</h1>

            {/* 7.1 Code Source */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold">7.1. Code Source</h2>
              <ul className="list-disc list-inside mt-2">
                <li>Hébergement sur GitHub avec une structure de répertoires claire.</li>
                <li>Documentation détaillée dans le README (instructions d'installation, de lancement, aperçu des fonctionnalités).</li>
              </ul>
            </div>

            {/* 7.2 Démonstration */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold">7.2. Démonstration</h2>
              <ul className="list-disc list-inside mt-2">
                <li>Présentation en direct ou enregistrement vidéo démontrant le fonctionnement de l'application.</li>
                <li>Mise en avant des principales fonctionnalités : trading, mini-blog, virements, portefeuille, etc.</li>
              </ul>
            </div>

            {/* 7.3 Documentation Technique */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold">7.3. Documentation Technique</h2>
              <ul className="list-disc list-inside mt-2">
                <li>Description des composants principaux.</li>
                <li>Explications sur l'architecture de l'application.</li>
                <li>Instructions pour ajouter de nouvelles fonctionnalités ou modifier les existantes.</li>
              </ul>
            </div>
          </section>

          {/* Section 8: Plan de Développement */}
          <section>
            <h1 className="text-2xl font-bold">8. Plan de Développement</h1>

            {/* 8.1 Phase 1 : Initialisation et Configuration */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold">8.1. Phase 1 : Initialisation et Configuration</h2>
              <ul className="list-disc list-inside mt-2">
                <li>Création du projet React.</li>
                <li>Installation des dépendances nécessaires (shadcn/ui, React Router, Axios, Chart.js).</li>
                <li>Configuration de la bibliothèque shadcn/ui selon la documentation.</li>
              </ul>
            </div>

            {/* 8.2 Phase 2 : Authentification et Gestion des Comptes */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold">8.2. Phase 2 : Authentification et Gestion des Comptes</h2>
              <ul className="list-disc list-inside mt-2">
                <li>Mise en place du système de connexion et d'inscription.</li>
                <li>Gestion des sessions utilisateur avec Context API ou Redux.</li>
                <li>Stockage des informations utilisateur dans localStorage.</li>
              </ul>
            </div>

            {/* 8.3 Phase 3 : Intégration de l'API de Prix des Cryptos */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold">8.3. Phase 3 : Intégration de l'API de Prix des Cryptos</h2>
              <ul className="list-disc list-inside mt-2">
                <li>Configuration des services API pour récupérer les données des crypto-monnaies.</li>
                <li>Affichage des prix en temps réel sur la page d'accueil.</li>
              </ul>
            </div>

            {/* 8.4 Phase 4 : Fonctionnalités de Trading */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold">8.4. Phase 4 : Fonctionnalités de Trading</h2>
              <ul className="list-disc list-inside mt-2">
                <li>Création des composants pour l'achat et la vente de cryptos.</li>
                <li>Gestion des ordres au marché et des ordres limités.</li>
                <li>Mise à jour du portefeuille et enregistrement dans localStorage.</li>
              </ul>
            </div>

            {/* 8.5 Phase 5 : Portefeuille et Historique des Transactions */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold">8.5. Phase 5 : Portefeuille et Historique des Transactions</h2>
              <ul className="list-disc list-inside mt-2">
                <li>Développement du tableau de bord utilisateur pour afficher le portefeuille.</li>
                <li>Mise en place de l'historique des transactions avec détails pertinents.</li>
              </ul>
            </div>

            {/* 8.6 Phase 6 : Mini-Blog pour Chaque Crypto */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold">8.6. Phase 6 : Mini-Blog pour Chaque Crypto</h2>
              <ul className="list-disc list-inside mt-2">
                <li>Création de la section de discussion dédiée pour chaque crypto.</li>
                <li>Implémentation des fonctionnalités de publication, modification, suppression, et likes des posts.</li>
              </ul>
            </div>

            {/* 8.7 Phase 7 : Virements et Échanges Internes */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold">8.7. Phase 7 : Virements et Échanges Internes</h2>
              <ul className="list-disc list-inside mt-2">
                <li>Développement des formulaires pour les retraits, dépôts, et virements internes.</li>
                <li>Validation des transactions et mise à jour des portefeuilles des utilisateurs.</li>
              </ul>
            </div>

            {/* 8.8 Phase 8 : Graphiques Interactifs */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold">8.8. Phase 8 : Graphiques Interactifs</h2>
              <ul className="list-disc list-inside mt-2">
                <li>Intégration des graphiques de prix avec Chart.js ou Recharts.</li>
                <li>Affichage de l'évolution des prix sur la page dédiée de chaque crypto.</li>
              </ul>
            </div>

            {/* 8.9 Phase 9 : Tests et Optimisations */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold">8.9. Phase 9 : Tests et Optimisations</h2>
              <ul className="list-disc list-inside mt-2">
                <li>Tests fonctionnels des différentes fonctionnalités.</li>
                <li>Optimisation des performances et de l'interface utilisateur.</li>
                <li>Correction des bugs et amélioration de l'expérience utilisateur.</li>
              </ul>
            </div>

            {/* 8.10 Phase 10 : Déploiement et Documentation Finale */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold">8.10. Phase 10 : Déploiement et Documentation Finale</h2>
              <ul className="list-disc list-inside mt-2">
                <li>Préparation du dépôt GitHub avec le code final.</li>
                <li>Rédaction de la documentation complète.</li>
                <li>Préparation de la démonstration finale.</li>
              </ul>
            </div>
          </section>

          {/* Section 9: Risques et Gestion des Risques */}
          <section>
            <h1 className="text-2xl font-bold">9. Risques et Gestion des Risques</h1>

            {/* 9.1 Risques Techniques */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold">9.1. Risques Techniques</h2>

              {/* Limites de l'API */}
              <div className="mt-2">
                <h3 className="text-lg font-semibold">Limites de l'API :</h3>
                <p className="mt-1">
                  Risque de dépassement des quotas de requêtes API gratuites.
                </p>
                <p className="mt-1">
                  <strong>Mitigation :</strong> Implémenter des mécanismes de cache et optimiser les appels API.
                </p>
              </div>

              {/* Problèmes de Stockage Local */}
              <div className="mt-2">
                <h3 className="text-lg font-semibold">Problèmes de Stockage Local :</h3>
                <p className="mt-1">
                  LocalStorage peut être insuffisant pour gérer de grandes quantités de données.
                </p>
                <p className="mt-1">
                  <strong>Mitigation :</strong> Utiliser des structures de données efficaces et optimiser le stockage.
                </p>
              </div>
            </div>

            {/* 9.2 Risques de Gestion de Projet */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold">9.2. Risques de Gestion de Projet</h2>

              {/* Délais Serrés */}
              <div className="mt-2">
                <h3 className="text-lg font-semibold">Délais Serrés :</h3>
                <p className="mt-1">
                  La deadline proche peut entraîner du stress et des erreurs.
                </p>
                <p className="mt-1">
                  <strong>Mitigation :</strong> Suivre un planning détaillé et répartir les tâches de manière équilibrée.
                </p>
              </div>

              {/* Coordination d'Équipe */}
              <div className="mt-2">
                <h3 className="text-lg font-semibold">Coordination d'Équipe :</h3>
                <p className="mt-1">
                  Difficultés de communication et de collaboration au sein des groupes.
                </p>
                <p className="mt-1">
                  <strong>Mitigation :</strong> Utiliser des outils de gestion de projet (Trello, Slack) et organiser des réunions régulières.
                </p>
              </div>
            </div>

            {/* 9.3 Risques de Sécurité */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold">9.3. Risques de Sécurité</h2>

              {/* Données Sensibles */}
              <div className="mt-2">
                <h3 className="text-lg font-semibold">Données Sensibles :</h3>
                <p className="mt-1">
                  Stockage des informations utilisateur dans localStorage.
                </p>
                <p className="mt-1">
                  <strong>Mitigation :</strong> Informer les utilisateurs que les données sont fictives et non sécurisées.
                </p>
              </div>
            </div>
          </section>

          {/* Section 10: Critères de Succès */}
          <section>
            <h1 className="text-2xl font-bold">10. Critères de Succès</h1>
            <ul className="list-disc list-inside mt-4">
              <li>Fonctionnalité Complète : Toutes les fonctionnalités principales sont implémentées et fonctionnent correctement.</li>
              <li>Interface Intuitive : L'application est facile à utiliser avec une navigation fluide.</li>
              <li>Performance Optimale : L'application répond rapidement et sans lag.</li>
              <li>Qualité du Code : Code propre, bien structuré et documenté.</li>
              <li>Respect des Délais : Livraison du projet avant la deadline fixée.</li>
              <li>Démonstration Réussie : Présentation efficace des fonctionnalités clés de l'application.</li>
            </ul>
          </section>

          {/* Section 11: Conclusion */}
          <section>
            <h1 className="text-2xl font-bold">11. Conclusion</h1>
            <p className="mt-2">
              Ce document de Termes du Projet définit de manière exhaustive les attentes, les fonctionnalités, les technologies, et les contraintes pour le développement de l'application Binance-like sans backend. En suivant ces directives, l'équipe pourra structurer son travail de manière efficace, anticiper les défis potentiels, et assurer la réussite du projet dans les délais impartis.
            </p>
          </section>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Link to="/signup" className="text-primary hover:underline">
            Retour à l'inscription
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
