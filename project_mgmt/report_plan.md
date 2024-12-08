# Plan du Rapport

## 1. Introduction

### 1.1 Contexte du Projet

- **Importance de l'authentification biométrique par reconnaissance faciale et vocale**.
  - Contexte spécifique : Protection des compartiments de frigo dans un espace de coworking ou une petite entreprise.
  - Besoin d'une solution sécurisée et efficace pour contrôler l'accès aux ressources partagées.

### 1.2 Objectifs du Projet

- **Développement d'une application d'authentification intégrant une pipeline MLOps de niveau 3**.
  - **Explication de ce qu'est une pipeline de niveau 3 selon Microsoft**.
    - Intégration continue, déploiement continu, et réentraînement automatique des modèles.
- **Mise en œuvre du réentraînement continu du modèle (Continual Learning)**.
  - Assurer que le modèle reste performant en intégrant régulièrement de nouvelles données.
- **Focus sur la scalabilité horizontale avec une architecture de double modèle (Characterizer et Discriminator)**.
  - **Développement d'une seule partie d'un tout plus grand**.
    - **Characterizer** : Entraîné sur un vaste ensemble de données pour réduire le biais (scalabilité verticale).
    - **Discriminator** : Modèle sur mesure pour les utilisateurs d'un frigo spécifique (scalabilité horizontale).

## 2. Apprentissage Continu (Continual Learning)

### 2.1 Concept de l'Apprentissage Continu

- **Pourquoi le Continual Learning est pertinent pour le Characterizer**.
  - Éviter le "catastrophic forgetting" où le modèle oublie des informations précédemment apprises.
  - Importance de maintenir les performances tout en intégrant de nouvelles données.

### 2.2 Application au Projet

- **Nécessité de réentraîner régulièrement le modèle Discriminator pour intégrer de nouveaux utilisateurs**.
  - Adaptation du modèle aux changements dans la base d'utilisateurs.
  - Maintien d'une haute précision d'authentification.

## 3. Développement du Modèle

### 3.1 Architecture du Double Modèle

#### 3.1.1 Modèle Characterizer

- **Fonction** : Extraire les caractéristiques des vidéos (embeddings).
- **Rôle** : Scalabilité verticale, entraîné une fois sur un vaste ensemble de données pour capturer des traits généraux.
- **Non retravaillé fréquemment** : Limite les besoins en ressources pour le réentraînement.

#### 3.1.2 Modèle Discriminator

- **Fonction** : Identifier l'utilisateur à partir des caractéristiques fournies par le Characterizer.
- **Rôle** : Scalabilité horizontale, réentraînement fréquent pour s'adapter aux ajouts/suppressions d'utilisateurs.
- **Personnalisable** : Modèle spécifique à chaque frigo ou groupe d'utilisateurs.

### 3.2 Scalabilité Horizontale vs Verticale

#### 3.2.1 Scalabilité Verticale

- **Description** : Amélioration du modèle Characterizer pour mieux capturer les caractéristiques.
- **Statut** : Non implémentée dans ce projet en raison de la complexité et du temps limité.
- **Perspectives Futures** : Envisagée pour améliorer les performances globales.

#### 3.2.2 Scalabilité Horizontale

- **Description** : Réentraînement du modèle Discriminator pour chaque changement d'utilisateurs.
- **Justification du Choix** :
  - Répond aux besoins spécifiques du projet.
  - Plus pratique pour gérer des groupes d'utilisateurs distincts.

### 3.3 Réentraînement du Discriminator

- **Processus d'Ajout de Nouveaux Utilisateurs** :
  - Collecte des données du nouvel utilisateur.
  - Intégration des données dans le dataset existant.
  - Réentraînement automatique du Discriminator via la pipeline.
- **Méthodologie pour un Réentraînement Efficace** :
  - Minimiser l'impact sur les performances en production.
  - Utilisation de techniques pour éviter la perturbation du modèle existant.

## 4. Développement de la Pipeline MLOps

### 4.1 Présentation de la Pipeline

- **Description Générale** : Pipeline MLOps de niveau 3 assurant l'automatisation complète du cycle de vie du modèle.
- **Objectifs** :
  - **Automatisation du Réentraînement** : Processus déclenché par des événements (e.g., ajout d'un utilisateur).
  - **Déploiement Continu** : Mise à jour automatique du modèle en production après validation.
  - **Gestion des Versions** : Traçabilité des modèles et des données associées.

### 4.2 Outils et Technologies Utilisés

#### 4.2.1 Ansible pour le Déploiement

- **Rôle** : Automatisation de l'installation et de la configuration des environnements.
- **Avantages** :
  - **Cohérence** : Même environnement pour tous les déploiements.
  - **Répétabilité** : Facilite le déploiement sur de nouveaux serveurs ou lors de mises à jour.
  - **Gain de Temps** : Réduit les tâches manuelles et les erreurs potentielles.

#### 4.2.2 Airflow pour l'Orchestration

- **Utilisation** : Gestion des workflows complexes de réentraînement et de déploiement.
- **Détails Techniques** :
  - **Déploiement sur Kubernetes avec Helm** : Assure la scalabilité et la gestion des ressources.
  - **Sidecar Containers pour Dépendances et DAGs** : Facilite la mise à jour des workflows sans redéployer l'ensemble du service.
  - **Intégration avec DVC** : Exécution de jobs pour sauvegarder l'état du dataset.

#### 4.2.3 MLflow pour le Suivi des Expériences

- **Fonctionnalités** :
  - **Suivi des Versions de Modèles** : Historique complet des modèles entraînés.
  - **Enregistrement des Paramètres et Métriques** : Facilite l'analyse des performances.
- **Intégration avec la Pipeline** : Assure une traçabilité complète du modèle depuis les données jusqu'au déploiement.
- **Déploiement sur GCP avec Bucket et Cloud SQL** :
  - **Bucket** : Stockage des artefacts du modèle.
  - **Cloud SQL** : Base de données pour les métadonnées.

#### 4.2.4 DVC pour le Versioning des Données

- **Rôle** : Gestion des versions du dataset pour garantir la reproductibilité.
- **Intégration avec Airflow** :
  - **Job dédié** : Sauvegarde automatique de l'état du dataset après chaque réentraînement.
- **Avantages** :
  - **Traçabilité des Données** : Savoir quelles données ont été utilisées pour chaque version du modèle.
  - **Gestion Efficace** : Facilite le retour à une version précédente en cas de besoin.

### 4.3 Choix Techniques

#### 4.3.1 Pourquoi ne pas Utiliser Minikube

- **Limitations** :
  - **Configuration Matérielle** : Limitation à 8GB de RAM ne permettant pas de supporter tous les services.
  - **Environnements Divers au Sein de l'Équipe** : Difficulté à assurer une cohérence sur les machines locales.
- **Justification du Choix de GCP** :
  - **Scalabilité** : Ressources ajustables en fonction des besoins.
  - **Collaboration Améliorée** : Accès centralisé pour tous les membres de l'équipe.
  - **Services Intégrés** : Utilisation de services managés pour simplifier le déploiement.

### 4.4 Diagrammes de Séquence

- **Présentation des Processus Clés** :
  - **4.4.1 Ajout d'un Nouvel Utilisateur** :
    - Flux depuis la soumission des données jusqu'au déploiement du nouveau modèle.
  - **4.4.2 Suppression d'un Utilisateur** :
    - Mise à jour du dataset et réentraînement du Discriminator.
  - **4.4.3 Processus d'Authentification** :
    - Interaction entre l'utilisateur, l'application, et les modèles pour valider l'accès.
- **Explication** :
  - **Flux d'Actions** : Détail des étapes et des interactions.
  - **Interaction entre les Composants** : Rôle de chaque service dans le processus.

### 4.5 Défis et Solutions

- **Problèmes Rencontrés** :
  - **Complexité Technique de l'Intégration** :
    - **Capacité d'Analyse et d'Expertise du Domaine** : Nécessité de comprendre en profondeur chaque composant.
    - **Fonctionnement Cohérent** : Assurer que tous les services communiquent efficacement.
  - **Complexité de Chaque Composant** :
    - **Mur de Formation** : Temps d'apprentissage important pour maîtriser des outils comme Airflow, Kubernetes, etc.
    - **Temps d'Itération Ralenti** : Difficulté à tester rapidement des modifications.
- **Approches Adoptées** :
  - **Investissement dans la Formation** : Sessions d'apprentissage en équipe pour partager les connaissances.
  - **Optimisation des Configurations** : Simplification des déploiements pour faciliter les tests.
  - **Documentation** : Création de guides internes pour accélérer la prise en main des outils.

## 5. Développement de l'Application Frontend

### 5.1 Présentation de l'Application

- **Technologie** : Développée en Next.js pour une application web moderne et réactive.
- **Fonctionnalités Principales** :
  - **Authentification** : Permet aux utilisateurs de se connecter via reconnaissance biométrique.
  - **Gestion des Utilisateurs** : Ajout et suppression d'utilisateurs pour les administrateurs.

### 5.2 Intégration avec la Pipeline et les Modèles

- **Communication avec l'API** :
  - **Soumission des Vidéos** : L'application envoie les vidéos à l'API pour traitement.
  - **Utilisation de Google Cloud API (GCA)** : Assure la scalabilité et la fiabilité des services backend.
- **Gestion des Réponses en Temps Réel** :
  - **Retour des Résultats** : L'utilisateur est informé instantanément du succès ou de l'échec de l'authentification.
  - **Gestion des Erreurs** : Messages clairs en cas de problèmes techniques ou de refus d'accès.

## 6. Déploiement et Résultats

### 6.1 Déploiement sur le Cloud

- **Infrastructure Utilisée** : Google Cloud Platform (GCP) pour une solution robuste et évolutive.
  - **Base de Données Cloud SQL** : Stockage des métadonnées pour MLflow.
  - **Bucket GCP** : Stockage des modèles, des datasets, et des artefacts.
  - **DVC pour la Gestion des Données** : Versioning et stockage efficace des datasets.
- **Étapes du Déploiement** :
  - **Utilisation de Scripts Ansible** : Automatisation complète du déploiement pour réduire les erreurs.
  - **Configuration des Services** :
    - **Kubernetes Engine** : Déploiement des conteneurs pour Airflow, MLflow, etc.
    - **Services Managés** : Utilisation des services GCP pour simplifier la maintenance.

### 6.2 Résultats Obtenus

- **Fonctionnement Complet de la Pipeline MLOps** :
  - **Réentraînement Automatique** : Processus déclenché lors de l'ajout ou de la suppression d'utilisateurs.
  - **Déploiement Continu** : Mise à jour transparente du modèle en production.
- **Performance du Système d'Authentification** :
  - **Précision** : Taux de réussite élevé lors des tests.
  - **Temps de Réponse** : Authentification en temps réel sans latence perceptible.
- **Intégration Réussie des Composants** :
  - **Synergie** : Communication efficace entre l'application frontend, la pipeline MLOps, et les services cloud.
  - **Robustesse** : Système stable même lors de l'ajout fréquent de nouveaux utilisateurs.

## 7. Conclusion

### 7.1 Synthèse du Projet

- **Objectifs Atteints** :
  - Développement d'une application d'authentification biométrique fonctionnelle.
  - Mise en place d'une pipeline MLOps de niveau 3 avec réentraînement automatique.
- **Importance de l'Apprentissage Continu** :
  - Maintien des performances du modèle dans le temps.
  - Adaptabilité aux changements dans la base d'utilisateurs.

### 7.2 Contributions du Projet

- **Apports pour le Domaine de l'Authentification Biométrique** :
  - Solution adaptée aux besoins des petites structures comme les espaces de coworking.
- **Innovations dans la Gestion du Réentraînement et du Déploiement Continu** :
  - Intégration réussie de technologies avancées pour une automatisation complète.
  - Approche modulaire avec le double modèle pour une meilleure scalabilité.

### 7.3 Perspectives Futures

- **Améliorations Possibles** :
  - **Implémentation de la Scalabilité Verticale** : Améliorer le Characterizer pour une meilleure précision.
- **Extensions** :
  - **Autres Données Biométriques** : Intégration d'empreintes digitales, reconnaissance de l'iris, etc.
- **Optimisations** :
  - **Performance de la Pipeline** : Réduction des temps de réentraînement et de déploiement.
  - **Expérience Utilisateur** : Amélioration de l'interface frontend pour une utilisation encore plus intuitive.
