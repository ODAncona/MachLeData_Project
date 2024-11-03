@startuml
title Sequence Diagram - DeleteUser

actor Admin
participant Application
participant "MLOps Pipeline" as MLOpsPipeline
database "DataLake"
participant "Model Registry" as ModelRegistry
participant "Deployment Service" as DeploymentService
participant "Deployed Model" as Model

Admin -> Application: submitDeleteUserRequest(userId)
Application -> MLOpsPipeline: triggerRetrainAfterDeletion(userId)
MLOpsPipeline -> DataLake: removeUserData(userId)
MLOpsPipeline -> MLOpsPipeline: retrainModel(updatedDataset)
MLOpsPipeline -> ModelRegistry: saveNewModel
ModelRegistry --> MLOpsPipeline: modelSaved
MLOpsPipeline -> DeploymentService: deployNewModel
DeploymentService -> Model: updateDeployedModel
Model --> DeploymentService: deploymentConfirmed
DeploymentService --> MLOpsPipeline: deploymentSuccess
Application --> Admin: userDeleted
@enduml
