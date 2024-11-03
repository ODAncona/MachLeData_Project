@startuml
title Sequence Diagram - CreateUser

actor User
participant Application
participant "S3 Storage" as S3Storage
participant "MLOps Pipeline" as MLOpsPipeline
database "DataLake"
participant "Model Registry" as ModelRegistry
participant "Deployment Service" as DeploymentService
participant "Deployed Model" as Model

User -> Application: submitNewUserRequest(userVideos)
Application -> S3Storage: uploadVideos(userVideos)
S3Storage --> Application: videosStored
Application -> MLOpsPipeline: triggerRetrain(newUserData)
MLOpsPipeline -> DataLake: updateDataset(newUserData)
MLOpsPipeline -> MLOpsPipeline: retrainModel(updatedDataset)
MLOpsPipeline -> ModelRegistry: saveNewModel
ModelRegistry --> MLOpsPipeline: modelSaved
MLOpsPipeline -> DeploymentService: deployNewModel
DeploymentService -> Model: updateDeployedModel
Model --> DeploymentService: deploymentConfirmed
DeploymentService --> MLOpsPipeline: deploymentSuccess
Application --> User: userCreated
@enduml
