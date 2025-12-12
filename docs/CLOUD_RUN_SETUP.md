# Cloud Run Deployment Checklist

Follow these steps to deploy the ClarityUI Headless Microservice to Google Cloud Run.

## Prerequisites
- [ ] **Google Cloud Project**: You have a GCP project created (e.g., `clarity-ui-hackathon`).
- [ ] **Billing Enabled**: Billing is enabled for the project.
- [ ] **gcloud CLI**: Installed and authenticated (`gcloud auth login`).

## 1. Setup & Configuration

### A. Initialize gcloud
Run these commands in your terminal:
```bash
# Set your project ID
export PROJECT_ID="your-project-id-here"
gcloud config set project $PROJECT_ID

# Set default region (e.g., us-central1)
gcloud config set run/region us-central1
```

### B. Enable Required APIs
Enable Cloud Run and Container Registry (or Artifact Registry) APIs:
```bash
gcloud services enable run.googleapis.com \
    containerregistry.googleapis.com \
    cloudbuild.googleapis.com
```

## 2. Build & Publish Container

We will use Google Cloud Build to build the Docker image and store it in the Container Registry (GCR).

### A. Submit Build
Run this from the root of the repository (where `microservice/` is located):
```bash
cd microservice

# Build and push the image to GCR
# Tag format: gcr.io/[PROJECT-ID]/[IMAGE-NAME]
gcloud builds submit --tag gcr.io/$PROJECT_ID/clarity-headless-service
```
*Note: This may take a few minutes as it pulls the Playwright base image.*

## 3. Deploy to Cloud Run

### A. Deploy Command
Deploy the service using the image we just built. We explicitly set memory to 2Gi to handle headless chrome operations.

```bash
gcloud run deploy clarity-headless-service \
  --image gcr.io/$PROJECT_ID/clarity-headless-service \
  --platform managed \
  --memory 2Gi \
  --cpu 2 \
  --timeout 60 \
  --concurrency 10 \
  --allow-unauthenticated \
  --port 8080
```

### B. Configuration Flags Explained
- `--memory 2Gi`: Chrome needs RAM. 2Gi is recommended minimum.
- `--cpu 2`: Ensures smooth rendering.
- `--allow-unauthenticated`: Makes the endpoint public (for Hackathon demo simplicity).
- `--port 8080`: Matches our Express server port.

## 4. Verification

### A. Get Service URL
The deploy command will output a Service URL (e.g., `https://clarity-headless-service-xyz-uc.a.run.app`).

### B. Test the Ping Endpoint
```bash
curl https://[YOUR-SERVICE-URL]/ping
# Should return: pong
```

### C. Test a Fetch
```bash
curl "https://[YOUR-SERVICE-URL]/fetch?url=https://example.com"
# Should return a JSON object with screenshot_base64 and html.
```

## 5. Environment Variables (Optional)
If you need to update configuration later (like `ALLOWED_DOMAINS`):

```bash
gcloud run services update clarity-headless-service \
  --update-env-vars ALLOWED_DOMAINS="example.com,google.com"
```
