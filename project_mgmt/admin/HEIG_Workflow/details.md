
### **1. Overview of Architecture**

**Components:**

- **Local Environment:**
  - **Git Repository:** Stores code and DVC metadata.
  - **Data Folder (.dvc):** Managed by DVC for data versioning.
  - **Source Code (`src/`):** Contains scripts:
    - `prepare.py`
    - `train.py`
    - `validate.py`
    - `serve.py`

- **Kubernetes Cluster:**
  - **Kubeflow:** Orchestrates machine learning pipelines using DAGs.
  - **MLflow Tracking Server:** Logs metrics, parameters, and artifacts.
  - **MLflow Model Registry:** Manages model versions and deployment stages.
  - **KServe:** Deploys models in production, compatible with MLflow models.
  - **Harbor:** Private container registry for Docker images.
  - **Label Studio:** Handles data annotation and validation.
  - **MinIO:** S3-compatible storage for datasets.

**User Roles:**

- **Full-Stack Data Scientist:** Manages the entire pipeline, from data to deployment.

---

### **2. Data Management**

**Initial Dataset:**

- Stored in MinIO and versioned with DVC.
- Static and not expected to change frequently.

**New Data Ingestion:**

- **Source:** New images from production inference.
- **Storage:** Added to a separate folder in MinIO.
- **Trigger:** When X new images accumulate, a pre-annotation process starts.
- **Pre-Annotation:**
  - Uses the current production model.
  - Handled by Label Studio.
- **Validation:**
  - Data Scientist validates or corrects annotations in Label Studio.
  - Validated data is moved to the main dataset folder in MinIO under a new subfolder named after the batch.
- **Versioning:**
  - DVC tracks changes, ensuring reproducibility.
  - Each dataset version has a unique hash.

---

### **3. Pipeline and Workflows**

**Local Execution:**

- **Data Preparation (`prepare.py`):**
  - Pulls data from MinIO using DVC.
  - Performs data cleaning, validation, and transformation.
- **Training (`train.py`):**
  - Uses prepared data to train models.
  - Hyperparameters (e.g., learning rate, architecture parameters) can be specified.
- **Validation (`validate.py`):**
  - Evaluates model performance using defined metrics.
- **Experiment Tracking:**
  - MLflow logs metrics, parameters, and artifacts.
- **Reproducibility:**
  - Experiments use specific DVC data hashes.

**Cluster Execution:**

- **Orchestration:**
  - Kubeflow manages pipelines as DAGs.
  - Each script is containerized and executed as a pipeline step.
- **Hyperparameter Tuning:**
  - Optuna can be integrated for automated hyperparameter search.
- **Inter-Component Communication:**
  - Components communicate via REST APIs.

**Pipeline Triggers:**

- **Data Trigger:** New validated batch added to the dataset.
- **Code Trigger:** Pull request merged into the main Git branch.

---

### **4. Model Management and Deployment**

**Model Evaluation and Comparison:**

- **Metrics:** Defined by the Data Scientist per use case.
- **Comparison:**
  - New models are compared against the current production model.
  - Metrics from MLflow Tracking Server are used.

**Model Registry:**

- **Storage:** All models are stored in MLflow Model Registry.
- **Versioning:** Models are versioned for tracking and deployment stages.

**Deployment with KServe:**

- **Process:**
  - KServe pulls the latest model from MLflow Model Registry.
  - Deploys the model as a service in the Kubernetes cluster.
- **Compatibility:**
  - Ensure models are packaged in a format compatible with KServe (e.g., ONNX, TensorFlow SavedModel).

---

### **5. Logging and Experiment Tracking**

**Logging:**

- **Scope:** All actions in scripts, containers, and applications.
- **Details:**
  - Timestamps, actions performed, relevant metadata.
- **Purpose:** Facilitates debugging and auditing.

**Experiment Tracking:**

- **Tool:** MLflow Tracking Server.
- **Data Logged:**
  - Hyperparameters.
  - Training and validation metrics.
  - Artifacts (model files, plots).
- **Usage:** Enables reproducibility and comparison of experiments.

---

### **6. Integration and Workflow Management**

**Inter-Component Communication:**

- **Method:** REST APIs.
- **Components:**
  - Scripts communicate with MLflow, MinIO, and other services.
  - Kubeflow pipelines coordinate execution steps.

**DAG Dependencies:**

- **Structure:**
  - `prepare.py` → `train.py` → `validate.py`.
- **Management:** Kubeflow ensures proper execution order based on dependencies.

---

### **7. User Actions and Permissions**

**Full-Stack Data Scientist:**

- **Capabilities:**
  - Run training and validation scripts locally.
  - Execute and monitor pipelines on the cluster.
  - Validate annotations in Label Studio.
  - Update code and push to Git repository.
  - Manage experiments and models via MLflow and Kubeflow dashboards.

---

### **8. Triggers and Automation**

**Data Triggers:**

- **Condition:** Accumulation of X new images in MinIO.
- **Action:** Initiate pre-annotation in Label Studio.

**Pipeline Triggers:**

- **Condition:** Merge of a pull request into the main branch.
- **Action:** Launch Kubeflow pipeline for training and validation.

---

### **9. Design Choices and Recommendations**

**Data Versioning with DVC:**

- **Strategy:**
  - Version the dataset after each batch validation.
  - Allows tracking which data was used in each experiment.
- **Reproducibility:**
  - Experiments reference specific DVC hashes.

**Model Deployment with KServe and MLflow:**

- **Integration:**
  - Follow documentation to ensure compatibility.
  - Potentially use MLflow's deployment plugins.

**Logging:**

- **Implementation:**
  - Use a centralized logging system (e.g., ELK stack, Fluentd).
  - Ensure logs are accessible and searchable.

**Simplified Roles:**

- **Justification:**
  - Since only a Full-Stack Data Scientist is involved, complex permission systems are unnecessary.

---

### **10. Next Steps**

**Diagram Creation:**

- **Type:** System Architecture Diagram.
- **Tool:** PlantUML (for detailed customization).
- **Elements to Include:**
  - Components and services.
  - Data flow between components.
  - User actions and triggers.
  - Execution flow of pipelines.

**Iterative Development:**

- **Implementation:**
  - Start with setting up the core components (MinIO, MLflow, Kubeflow).
  - Incrementally add features (Optuna integration, KServe deployment).
- **Testing:**
  - Validate each component individually.
  - Ensure end-to-end workflows function as expected.

---

### **Additional Notes**

- **REST APIs:**
  - Ensure all components expose APIs where necessary.
  - Standardize API endpoints for consistency.

- **Hyperparameter Tuning with Optuna:**
  - Integrate Optuna in a way that it can be used both locally and in cluster pipelines.

- **Data Integrity:**
  - Implement checks to prevent faulty data from contaminating the dataset.

- **Future Enhancements:**
  - Although not a priority now, consider adding monitoring tools later (e.g., Prometheus, Grafana).
