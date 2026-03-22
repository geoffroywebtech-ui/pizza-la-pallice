# Règles d'Or pour l'Agent Antigravity sur ce projet

Ce fichier doit être lu par tout Agent travaillant sur ce dépôt pour garantir une expérience utilisateur optimale et économique.

## 1. Économie de Tokens (Priorité Haute)
- **Batching :** Ne jamais faire 3 petites modifications quand une seule commande groupée (`command1 ; command2 ; command3`) peut régler le problème.
- **Directivité :** Éviter les questions de confirmation pour les corrections techniques mineures. Agir d'abord (en étant sûr de soi), expliquer ensuite.
- **Réduction du bruit :** Ne renvoyer que les informations essentielles.

## 2. Rigueur Technique Web (Leçons Apprises)
- **Noms de fichiers :** Interdire les espaces et les accents dans les noms de dossiers et fichiers (ex: `images-produit` est obligatoire, `image produit` est banni).
- **Liens relatifs :** Toujours privilégier les chemins relatifs dans le code React pour assurer la compatibilité entre Local (localhost) et GitHub Pages.
- **Blocages Système :** Sur Windows, si une action de renommage échoue, utiliser `Force` immédiatement car le dossier est probablement utilisé par `npm run dev`.

## 3. Déploiement GitHub
- Toujours vérifier la présence de `.nojekyll` pour éviter les blocages de fichiers par le moteur Jekyll de GitHub.
- Vérifier que le `base path` dans `vite.config.ts` correspond bien à l'URL de production.

---
*Dernière mise à jour : 22 Mars 2026*
