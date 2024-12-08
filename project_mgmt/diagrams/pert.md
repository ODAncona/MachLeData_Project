@startuml
title PERT: Projet MLOps

package PropositionProjet as P0 {
}

package ChoixTechnologiques as P1 {}
package Développement as P2 {}
package Intégration as P3 {}
package Déliverable as P4 {}

map P0.PropositionInitiale {
    0 => 0
}
map P0.ValidationProjet {
    6 => 6
}

map P1.DefinitionBesoins {
    8 => 12
}
map P1.ChoixTechnologies {
    14 => 14
}
map P1.MiseEnPlaceOutils {
    17 => 17
}
map P1.ChoixVersionning {
    8 => 8
}

map P2.DéveloppementApplication {
    20 => 22
}
map P2.DéveloppementModèle {
    20 => 22
}
map P2.DéveloppementPipeline {
    20 => 20
}
map P2.DéveloppementVersionning {
    20 => 22
}

map P3.IntegrationModelePipeline {
    40 => 42
}
map P3.IntegrationPipelineApplication {
    40 => 40
}
map P3.FonctionnalitesReEntrainement {
    51 => 51
}
map P3.ValidationDeploiements {
    53 => 53
}

map P4.Rapport {
    40 => 49
}
map P4.PresentationFinale {
    40 => 49
}

' Dependencies with durations on outgoing arcs
start -right-> P0.PropositionInitiale
P0.PropositionInitiale -[#red]-> P0.ValidationProjet : 6 jours

P0.ValidationProjet --> P1.DefinitionBesoins : 2 jours
P0.ValidationProjet -[#red]-> P1.ChoixVersionning : 2 jours

P1.DefinitionBesoins --> P1.ChoixTechnologies : 2 jours
P1.ChoixVersionning -[#red]-> P1.ChoixTechnologies : 6 jours
P1.ChoixTechnologies -[#red]-> P1.MiseEnPlaceOutils : 3 jours

P1.MiseEnPlaceOutils --> P2.DéveloppementModèle : 3 jours
P1.MiseEnPlaceOutils --> P2.DéveloppementApplication : 3 jours
P1.MiseEnPlaceOutils -[#red]-> P2.DéveloppementPipeline : 3 jours
P1.MiseEnPlaceOutils --> P2.DéveloppementVersionning : 3 jours

P2.DéveloppementModèle --> P3.IntegrationModelePipeline : 20 jours
P2.DéveloppementPipeline --> P3.IntegrationModelePipeline : 20 jours
P2.DéveloppementApplication --> P3.IntegrationModelePipeline : 20 jours
P2.DéveloppementVersionning --> P3.IntegrationModelePipeline : 20 jours

P2.DéveloppementPipeline -[#red]-> P3.IntegrationPipelineApplication : 20 jours
P3.IntegrationPipelineApplication -[#red]-> P3.FonctionnalitesReEntrainement : 11 jours

P3.IntegrationPipelineApplication --> P3.ValidationDeploiements : 11 jours
P3.FonctionnalitesReEntrainement -[#red]-> P3.ValidationDeploiements : 2 jours
P3.IntegrationModelePipeline --> P3.ValidationDeploiements : 11 jours

P2.DéveloppementPipeline --> P4.Rapport : 20 jours
P2.DéveloppementPipeline --> P4.PresentationFinale : 20 jours

P3.ValidationDeploiements -[#red]right-> end : 3 jours
P4.Rapport --> end : 7 jours
P4.PresentationFinale --> end : 7 jours
@enduml
