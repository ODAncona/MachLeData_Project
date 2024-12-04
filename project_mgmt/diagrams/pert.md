@startuml
title PERT: Projet MLOps

package PropositionProjet as P0 {
}

package ChoixTechnologiques as P1 {}
package Développement as P2 {}
package Intégration as P3 {}
package Déliverable as P4 {}

map P0.PropositionInitiale {
    0 => 6
}
map P0.ValidationProjet {
    6 => 8
}

map P1.DefinitionBesoins {
    8 => 10
}
map P1.ChoixTechnologies {
    10 => 15
}
map P1.MiseEnPlaceOutils {
    15 => 18
}
map P1.ChoixVersionning {
    8 => 14
}

map P2.DéveloppementApplication {
    18 => 38
}
map P2.DéveloppementModèle {
    18 => 38
}
map P2.DéveloppementPipeline{
    18 => 38
}
map P2.DéveloppementVersionning {
    18 => 38
}

map P3.IntegrationModelePipeline {
    38 => 49
}
map P3.IntegrationPipelineApplication {
    38 => 49
}
map P3.FonctionnalitesReEntrainement {
    49 => 51
}
map P3.ValidationDeploiements {
    49 => 56
}

map P4.Rapport {
    49 => 56
}
map P4.PresentationFinale {
    49 => 56
}

' Dependencies
start --> P0.PropositionInitiale
P0.PropositionInitiale --> P0.ValidationProjet

P0.ValidationProjet -up-> P1.DefinitionBesoins
P0.ValidationProjet -up-> P1.ChoixVersionning

P1.DefinitionBesoins -right-> P1.ChoixTechnologies
P1.ChoixVersionning --> P1.ChoixTechnologies
P1.ChoixTechnologies --> P1.MiseEnPlaceOutils

P1.MiseEnPlaceOutils --> P2.DéveloppementModèle
P1.MiseEnPlaceOutils --> P2.DéveloppementApplication
P1.MiseEnPlaceOutils --> P2.DéveloppementPipeline
P1.MiseEnPlaceOutils --> P2.DéveloppementVersionning

P2.DéveloppementModèle -down-> P3.IntegrationModelePipeline
P2.DéveloppementPipeline--> P3.IntegrationModelePipeline
P2.DéveloppementApplication--> P3.IntegrationModelePipeline

P2.DéveloppementPipeline--> P3.IntegrationPipelineApplication
P3.IntegrationPipelineApplication --> P3.FonctionnalitesReEntrainement

P3.IntegrationPipelineApplication --> P3.ValidationDeploiements
P3.FonctionnalitesReEntrainement --> P3.ValidationDeploiements
P3.IntegrationModelePipeline --> P3.ValidationDeploiements

P3.IntegrationPipelineApplication --> P4.Rapport
P3.IntegrationPipelineApplication --> P4.PresentationFinale

P3.ValidationDeploiements -right-> end
P4.Rapport --> end
P4.PresentationFinale --> end
@enduml
