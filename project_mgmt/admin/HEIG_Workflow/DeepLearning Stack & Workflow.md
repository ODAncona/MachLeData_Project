
# Proposition d'Écosystème pour le Développement Logiciel et la Data Science

## Introduction

Dans le but d'améliorer notre environnement de travail pour le développement logiciel et la data science, nous proposons la mise en place d'un écosystème performant, évolutif et collaboratif. Cet écosystème sera construit autour d'un cluster Kubernetes, intégrant des services essentiels pour nos activités et facilitant la prise en main par les nouveaux collaborateurs.

## Objectifs

- **Spécifique** : Mettre en place un cluster Kubernetes performant avec des outils adaptés pour faciliter le développement collaboratif et les entraînements de modèles de machine learning.
- **Mesurable** : Réduire le temps de développement des applications en utilisant des images docker et améliorer la traçabilité et le reproductibilité des expériences de science des données.
- **Atteignable** : En s'appuyant sur des technologies open-source mature et en optimisant le matériel actuel.
- **Pertinent** : Répondre aux besoins de collaboration entre 4 et 8 utilisateurs pour créer un environnement de travail professionnel et évolutif.
- **Temporel** : Mise en place progressive de l'écosystème sur une durée maximale de 4 mois, avec l'achat du matériel débutant dès que possible et l'installation commençant pendant le délai de livraison.

## Infrastructure Existante

- **Serveur "La Méduse"** :
  - **Carte Mère** : ASUS Pro WS WRX80E-SAGE SE WIFI
  - **CPU** : AMD Threadripper
  - **GPU** : RTX Ada 6000 et RTX 3090
  - **Connectivité Réseau** : Jusqu'à 10 Gb/s

- **Serveur "La Petite Méduse"** :
  - **Carte Mère** : ASUS (limitée à 2.5 Gb/s)
  - **GPU** : RTX 3090

- **Utilisateurs** :
  - Entre 4 et 8 développeurs utilisant principalement VS Code et Visual Studio, développant en C#, Python, et occasionnellement d'autres langages.

## Problématiques Actuelles

- **Goulots d'Étranglement** : Tous les utilisateurs sont connectés sur la même machine pour le développement, limitant les ressources disponibles.
- **Environnements de Développement** : Besoin de faciliter la configuration des environnements de développement pour les nouveaux utilisateurs. Lorsqu'on travaille à plusieurs, il peut y avoir des contraintes d'espaces, d'utilisation des ressources ou des environnements incompatibles qui ralentissent le développement
- **Gestion des Données** : Nécessité de stocker et de partager efficacement des données volumineuses. Aujourd'hui, les datasets sont éparpillés sur les ordinateurs et des supports de stockage plutôt que regroupés et organisés.
- **Collaboration** : Besoin d'un onboarding efficace pour l'accueil des nouveaux collaborateurs.

## Infrastructure Proposée

### Matériel à Acquérir

1. **Serveur NAS Haute Performance** :
   - **Processeur** : Intel Xeon ou AMD EPYC multi-cœurs.
   - **Mémoire RAM** : 64 Go ECC ou plus.
   - **Stockage** :
     - Disques SSD NVMe pour le cache.
     - Disques HDD en RAID pour le stockage massif (capacité totale de 100 To ou plus).
   - **Connectivité Réseau** : Cartes réseau compatibles avec les débits actuels des serveurs (2.5 Gb/s à 10 Gb/s).
   - **Logiciel** : Solution NAS open-source comme TrueNAS.

2. **Équipements Réseau** :
   - **Switch** : Switch réseau supportant le 10 Gb/s avec suffisamment de ports pour tous les appareils.
   - **Câblage** : Câbles Ethernet Cat6a ou supérieurs adaptés aux débits de 10 Gb/s.

### Stack Technologique

#### Cluster Kubernetes

- **Kubernetes** : Orchestration des conteneurs pour déployer et gérer les applications.
- **Volcano** : Gestionnaire de batch s'exécutant sur Kubernetes pour faciliter le lancement de workloads intensifs en calcul.

#### Environnements de Développement

- **Coder** :
  - Plateforme permettant d'héberger des environnements de développement dans le cloud.
  - Facilite la configuration d'environnements de développement standardisés accessibles via un navigateur.
  - Supporte VS Code via le web, ce qui est idéal pour nos besoins en C#, Python, et autres langages.

#### Services pour la Data Science

- **MinIO** : Stockage d'objets compatible S3, hébergé sur le NAS pour le stockage de données volumineuses.
- **Label Studio** : Outil d'annotation de données pour préparer les jeux de données.
- **DVC (Data Version Control)** : Gestion des versions des données, intégration avec Git.
- **MLflow** : Suivi des expériences de machine learning, gestion des modèles.
- **Kubeflow** : Plateforme pour déployer des workflows de machine learning sur Kubernetes.
- **Harbor** : Registre privé pour les images Docker, essentiel pour la gestion de nos nombreuses applications.

### Collaboration et Onboarding

**Simplicité de Prise en Main** :

- Élaboration d'un manuel utilisateur pour les nouveaux arrivants.
- Utilisation d'outils standardisés pour minimiser la courbe d'apprentissage.
- Les outils utilisés sont déjà familiers (vscode, visual studio, ssh, docker, virtual env.). Ils sont simplement portés sur le cluster.

**Documentation Diataxis** :

- Guides pas à pas pour la configuration des environnements de développement via **Coder**.
- Documentation de référence pointant vers la documentation officielle des services
- Tutoriels, pour enseigner la prise en main de l'environnement
- Document d'explication détaillant l'avantage de chaque outils

### Gestion des Identités et des Accès

- **Simplicité Avant Tout** :
  - Utilisation de comptes SSH et de clés publiques pour l'accès au cluster.
  - Gestion des utilisateurs via des scripts simples pour ajouter ou supprimer des comptes.
  - Éviter les solutions complexes qui pourraient ralentir l'onboarding.

### Monitoring

- **Prometheus et Grafana** :
  - Ces outils peuvent être ajoutés ultérieurement si un besoin de monitoring détaillé est identifié (analyser les goulots d'étranglement).
  - Ils permettent de surveiller les performances du cluster (CPU, mémoire, utilisation des GPU).
  - **Décision** : Ne pas inclure Prometheus et Grafana dans le développement initial, mais les considérer comme des ajouts potentiels.

## Plan de Mise en Œuvre

Étant donné que nous disposons déjà des serveurs "La Méduse" et "La Petite Méduse", nous pouvons commencer par déployer le cluster Kubernetes sur ces machines, puis ajouter le NAS une fois acquis.

Le projet sera réalisé sur une période maximale de 4 mois, avec les étapes suivantes :

### Phase 1 (Septembre - mi Octobre)

- **Démarrage des Achats** (8h) :
  - Lancement du processus d'acquisition du serveur NAS et des équipements réseau.

- **Déploiement du Cluster Kubernetes** (16h) :
  - Installation de Kubernetes sur "La Méduse" et "La Petite Méduse".
  - Configuration de **Volcano** pour la gestion des workloads GPU.

- **Configuration de Harbor** (8h):
  - Mise en place du registre privé pour les images Docker.

### Phase 2 (mi Octobre - Novembre)

- **Mise en Place de Coder** (8h):
  - Déploiement de **Coder** sur le cluster pour fournir des environnements de développement accessibles en ssh ou via le navigateur.
  - Création d'images d'environnements préconfigurés avec VS Code et les extensions nécessaires.

- **Installation et Configuration du NAS** (8h):
  - Réception du serveur NAS et des équipements réseau.
  - Configuration du NAS avec **TrueNAS**.
  - Mise en place de **MinIO** pour le stockage des données.

- **Déploiement des Services Data Science** (8h):
  - Installation de **Label Studio**, **DVC**, **MLflow**, et **Kubeflow** sur le cluster.

### Phase 3 (Décembre)

- **Formation de l'Équipe (4h)**:
  - Sessions de formation sur l'utilisation du cluster, de Coder, et des services déployés.
  - Distribution du manuel utilisateur.

- **Évaluation des Besoins en Monitoring (4h)** :
  - Si nécessaire, planification de l'implémentation future de **Prometheus** et **Grafana**.

- **Documentation et Onboarding Simplifié (8h)** :
  - Finalisation du manuel utilisateur de 10 pages.
  - Mise en place de procédures pour l'accueil des nouveaux collaborateurs.

## Conclusion

La mise en place de cet écosystème permettra d'améliorer significativement notre environnement de travail, en offrant une plateforme professionnelle et évolutive pour le développement logiciel et la data science. En privilégiant la simplicité et la facilité d'utilisation, nous assurons une adoption rapide par les membres de l'équipe et une montée en compétence efficace pour les nouveaux arrivants.

## Annexes

### Avantages de Coder pour les Environnements de Développement

- **Standardisation des Environnements** :
  - Permet de créer des environnements de développement uniformes pour tous les utilisateurs.
  - Réduit les problèmes liés aux configurations locales différentes.

- **Facilité d'Accès** :
  - Les développeurs peuvent accéder à leur environnement via un navigateur web.
  - Pas besoin d'installer des logiciels spécifiques sur les machines locales.

- **Support des Outils Utilisés** :
  - Compatible avec VS Code, ce qui correspond aux outils privilégiés par l'équipe.
  - Possibilité d'ajouter des extensions et des configurations spécifiques.

### Gestion des Identités Simplifiée

- **Comptes Utilisateurs Simples** :
  - Création de comptes utilisateurs sur le cluster avec des scripts automatisés.
  - Utilisation de clés SSH pour sécuriser les accès.

- **Onboarding Rapide** :
  - Manuel utilisateur clair et concis pour guider les nouveaux arrivants.
  - Procédures simplifiées pour l'accès aux ressources nécessaires.

### Monitoring avec Prometheus et Grafana

- **Utilité Potentielle** :
  - Surveillance des performances du cluster (CPU, mémoire, utilisation des GPU).
  - Aide à l'optimisation des ressources et à la détection des problèmes.

- **Décision** :
  - Compte tenu de la priorité donnée à la simplicité, l'implémentation de Prometheus et Grafana sera envisagée ultérieurement en fonction des besoins.
