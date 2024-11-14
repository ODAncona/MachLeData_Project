
# DATA VERSIONING​ - In The Context of Continual Learning

## CONTINUAL LEARNING ARCHITECTURE

Schema of architecture representing a continual learning system. The system is composed of three main components: data storage, model training, and model deployment.

===
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
===

## DATASET EVOLUTION​

- More User (double arrow)
- More Data (double arrow)

===
@startwbs
*[#LightGreen] Project
**""
**[#SkyBlue] Alice
***_video_1.mp4
***_video_2.mp4
***_video_3.mp4
**[#SkyBlue] Bob
***_video_1.mp4
***_video_2.mp4
***_video_3.mp4
**[#SkyBlue] Charlie
***_video_1.mp4
***_video_2.mp4
***_video_3.mp4
@endwbs
===

## IMPORTANTS ASPECTS​

- Four V of Big Data
- Need of Structure
- Access and Security
- Storage Optimization

## Ideal solution

- Scale Horizontally : Add new classes to the dataset (e.g., add "SUV" to vehicle classification).​
- Scale Vertically : Increase data volume in existing classes (e.g., more "Cat" and "Dog" images).​
- Flexibility : able to store datasets at different stage (e.g., raw, tokenized), different format, change of structure,…​
- Security and Disponibility: Ensure data privacy and make sure data are available at all time​
- Ease of use : intuitive to use and easy integretion with ML workflow and tools ​

## Existing Solutions

- LakeFS
- Delta Lake
- DVC
- Pachyderm

## LakeFS

details

## Delta Lake

details

## DVC

details

## Pachyderm

details

## Final Comparison

Table comparing the four solutions

## Best Practice About Data Versionning

- Choose the Right Strategy: An appropriate versioning strategy depends on your specific needs and constraints, such as your data volume, update frequency, and team structure. This includes determining version numbering schemes (e.g., semantic versioning), establishing rules for when to create new versions (such as after significant data updates or schema changes), and deciding on storage methods for different versions (like full copies vs. delta storage).​

- Implement Robust Metadata Management: Effective metadata management is crucial for our data versioning. We ensure that each version is accompanied by comprehensive metadata describing the changes and context, including details of which ETL processes were applied.​

- Automate Version Control: We automate version control processes to help reduce errors and improve efficiency in our data management. Also, we implement automated workflows for creating, tracking, and managing versions, integrating these with our ETL pipelines.​

- Establish Clear Policies: We develop and communicate clear versioning policies to ensure consistency and clarity across our organization. We define guidelines for version naming, retention, and access control, considering the impact on our ETL processes.​

## Our Project

Authentication by face and voice => Deep Learning Model => Secure a door

Problem: When new employee join company => update model + dataset
