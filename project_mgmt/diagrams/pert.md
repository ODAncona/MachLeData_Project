@startuml
title PERT: Projet MLOps

map Phase0.PropositionInitiale {
    0 => 6
}
map Phase0.ValidationProjet {
    6 => 8
}

map Phase1.DefinitionBesoins {
    8 => 14
}
map Phase1.MiseEnPlaceOutils {
    8 => 14
}
map Phase1.ChoixTechnologies {
    8 => 14
}
map Phase1.EvaluationTraçabilité {
    14 => 18
}
map Phase1.SelectionMonitoring {
    14 => 18
}
map Phase1.AutomatisationEntrainements {
    14 => 24
}
map Phase1.ReEntrainementDonnees {
    14 => 24
}
map Phase1.IntegrationTests {
    14 => 24
}

map Phase2.AspectPipeline {
    24 => 32
}
map Phase2.AutomatisationEntrainements {
    24 => 32
}
map Phase2.TestsAB {
    24 => 32
}
map Phase2.MonitoringPerformances {
    24 => 32
}
map Phase2.ModeleCaracteriseur {
    24 => 32
}
map Phase2.ModeleDiscriminateur {
    24 => 32
}
map Phase2.AuthentificationFaciale {
    24 => 32
}
map Phase2.APIVerification {
    24 => 32
}
map Phase2.GestionUtilisateurs {
    24 => 32
}

map Phase3.IntegrationModelePipeline {
    32 => 38
}
map Phase3.IntegrationPipelineApplication {
    32 => 38
}
map Phase3.FonctionnalitesReEntrainement {
    32 => 42
}
map Phase3.TestsUnitaires {
    38 => 42
}
map Phase3.ValidationDeploiements {
    38 => 42
}

map Phase4.Documentation {
    42 => 48
}
map Phase4.PresentationFinale {
    48 => 56
}

' Dependencies
Phase0.PropositionInitiale --> Phase0.ValidationProjet
Phase0.ValidationProjet --> Phase1.DefinitionBesoins
Phase1.DefinitionBesoins --> Phase1.MiseEnPlaceOutils
Phase1.MiseEnPlaceOutils --> Phase1.ChoixTechnologies
Phase1.ChoixTechnologies --> Phase1.EvaluationTraçabilité
Phase1.EvaluationTraçabilité --> Phase1.SelectionMonitoring
Phase1.SelectionMonitoring --> Phase2.AspectPipeline
Phase1.AutomatisationEntrainements --> Phase3.IntegrationModelePipeline
Phase2.AspectPipeline --> Phase3.TestsUnitaires
Phase3.TestsUnitaires --> Phase4.Documentation
Phase4.Documentation --> Phase4.PresentationFinale
@enduml
