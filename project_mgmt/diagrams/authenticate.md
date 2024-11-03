@startuml
title Sequence Diagram - Authenticate

actor User
participant Application
participant "Deployed Model" as Model
participant Characterizer
participant Discriminator

User -> Application: submitAuthenticationRequest(videoData)
Application -> Model: identify(videoData)
Model -> Characterizer: generateEmbedding(videoData)
Characterizer --> Model: embedding
Model -> Discriminator: matchUser(embedding)
Discriminator --> Model: identifiedUser
Model --> Application: userIdentified
Application --> User: authenticationResult
@enduml
