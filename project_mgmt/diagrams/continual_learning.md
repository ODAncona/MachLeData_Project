@startuml
!define RECTANGLE_WIDTH 180
skinparam defaultFontName Arial
skinparam shadowing false
skinparam componentStyle rectangle

package "Data Sources" #LightBlue {
 rectangle "Streaming" as Streaming
 rectangle "Batch" as Batch
}

package "Data Lake"  {
 package "Ingestion Layer" as Ingestion #LightBlue {
 }
 package "Processing Layer" #LightBlue {
  rectangle "Transform, Enrich, Model" as  PipelineUp
  rectangle "Validate, Clean, Standardize" as Pipeline
 }
 package "Storage Layer" #LightBlue {
  rectangle "Landing Zone" as Landing
  rectangle "Clean Zone" as Clean
  rectangle "Curated Zone" as Curated
}
 package "Cataloging & Versioning" as Catalog #LightBlue{
 }
}

package "Cluster" as cluster {
 package "Pipeline" as MLOps #LightGreen{
  rectangle "Training" as Train
  rectangle "Evaluation" as Eval
 }

 package "Model Registry" as MR #LightGreen {
  rectangle "staging model" as stage
  rectangle "production model" as prod
 }

 package "Production Deployment" #LightGreen {
  rectangle "Champion Model" as champion
  rectangle "Challenger Model" as challenger
 }
}

Streaming --> Ingestion
Batch --> Ingestion
Ingestion --> Landing
Landing --> Pipeline
Pipeline --> Clean
Clean --> PipelineUp
PipelineUp --> Curated
Curated --> Catalog
Catalog -ri-> Train
Train -up-> Eval
Eval --> stage
stage -up-> prod
prod --> challenger
challenger -up-> champion
@enduml
