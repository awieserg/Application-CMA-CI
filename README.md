# CMA Church Hub

Application de gestion administrative pour l'Alliance Chrétienne et Missionnaire de Côte d'Ivoire (CMA-CI).

## 🌟 Fonctionnalités

### Administration Générale
- Gestion des régions, districts et paroisses
- Annuaire centralisé des membres et serviteurs
- Gestion des rôles et permissions
- Tableau de bord avec statistiques en temps réel

### Gestion des Paroisses
- Gestion des membres et fidèles
- Suivi des activités pastorales
- Organisation des services religieux
- Gestion du patrimoine
- Rapports financiers et statistiques

### Hiérarchie Administrative
- Président National
- Secrétaire Général
- Directeurs de départements
- Surintendants régionaux
- Surintendants de districts
- Intendants de paroisses

## 🚀 Technologies Utilisées

- **Frontend:**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Shadcn/ui
  - React Query
  - React Router
  - Lucide Icons

- **Backend:**
  - Supabase
  - PostgreSQL

## 📦 Installation

1. Cloner le projet
```bash
git clone [url-du-projet]
cd cma-church-hub
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env
```
Remplir les variables suivantes dans le fichier `.env`:
```
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon
```

4. Lancer le projet en développement
```bash
npm run dev
```

## 🏗️ Structure du Projet

```
src/
├── components/         # Composants React réutilisables
├── contexts/          # Contextes React (auth, etc.)
├── hooks/             # Hooks personnalisés
├── lib/              # Utilitaires et configurations
├── pages/            # Pages de l'application
├── types/            # Types TypeScript
└── integrations/     # Intégrations externes (Supabase)
```

## 🔐 Rôles et Permissions

- **Président & Secrétaire Général**
  - Accès complet à toutes les fonctionnalités
  - Gestion des administrateurs

- **Directeurs**
  - Gestion de leur département
  - Accès aux rapports nationaux

- **Surintendants Régionaux**
  - Gestion de leur région
  - Vue d'ensemble des districts

- **Surintendants de District**
  - Gestion de leur district
  - Vue d'ensemble des paroisses

- **Intendants de Paroisse**
  - Gestion complète de leur paroisse
  - Rapports et statistiques locaux

## 📊 Base de Données

La base de données comprend les tables principales suivantes:

- `regions`
- `districts`
- `paroisses`
- `communautes`
- `membres`
- `services_religieux`
- `activites_pastorales`
- `patrimoines`
- `user_profiles`

## 🛠️ Commandes Disponibles

```bash
# Développement
npm run dev

# Build
npm run build

# Preview
npm run preview

# Lint
npm run lint
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

- **Développeur Principal** - [Awiesrg]
- **Designer UI/UX** - [Awieserg]
- **Chef de Projet** - [KOFFI KONAN SERGE]

## 📞 Support

Pour toute question ou assistance:
- Email: support@example.com
- Documentation: [lien vers la doc]
- Issues: [lien vers les issues GitHub]