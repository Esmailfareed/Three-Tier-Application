# Three-Tier Application on AWS EKS

A three-tier web application deployed on **Amazon EKS**, with all AWS infrastructure provisioned using **Terraform**. Docker Compose is included only for quick local testing.

## Architecture

```
                         AWS Cloud
  ┌──────────────────────────────────────────────────────┐
  │                  EKS Cluster (Terraform)             │
  │                                                      │
  User ──▶ Ingress / Load Balancer                       │
  │              │                                       │
  │              ▼                                       │
  │        ┌───────────┐    ┌───────────┐    ┌─────────┐ │
  │        │ Frontend  │──▶ │ Backend   │──▶ │   DB    │ │
  │        │  (Tier 1) │    │ (Tier 2)  │    │ (Tier 3)│ │
  │        └───────────┘    └───────────┘    └─────────┘ │
  └──────────────────────────────────────────────────────┘
```

| Tier | Folder | Description |
|------|--------|-------------|
| Presentation | `frontend/` | User interface served to the browser |
| Application | `backend/` | API and business logic |
| Data | `k8s/` | Database tier |

## Repository Structure

```
.
├── backend/              # Backend API source code and Dockerfile
├── frontend/             # Frontend source code and Dockerfile
├── k8s/                  # Kubernetes manifests for EKS
├── terraform/            # Terraform code that builds the AWS infrastructure
├── test/                 # YAML files for testing autoscaling
├── docker-compose.yaml   # Local testing only
└── .gitignore
```

## Tech Stack

> Update this section to match your project.

- **Frontend:** `<e.g. React / Angular>`
- **Backend:** `<e.g. Node.js / Python / Java>`
- **Database:** `<e.g. PostgreSQL / MySQL / MongoDB>`
- **Infrastructure as Code:** Terraform
- **Orchestration:** Kubernetes on Amazon EKS
- **Container registry:** `<e.g. Amazon ECR / Docker Hub>`

## Prerequisites

- An AWS account with permissions to create EKS and networking resources
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html), configured with `aws configure`
- [Terraform](https://developer.hashicorp.com/terraform/install) 1.x
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Docker](https://docs.docker.com/get-docker/) to build and push images

## Deployment

### 1. Clone the repository

```bash
git clone https://github.com/Esmailfareed/Three-Tier-Application.git
cd Three-Tier-Application
```

### 2. Provision the infrastructure with Terraform

The `terraform/` folder creates the AWS resources, including the EKS cluster.

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

Variable files (`*.tfvars`) and state files are ignored by Git. Create your own `terraform.tfvars` before applying.

### 3. Connect kubectl to the EKS cluster

```bash
aws eks update-kubeconfig --region <region> --name <cluster-name>
kubectl get nodes
```

### 4. Build and push the images

```bash
docker build -t <registry>/frontend:latest ./frontend
docker build -t <registry>/backend:latest ./backend

docker push <registry>/frontend:latest
docker push <registry>/backend:latest
```

Make sure the image names in `k8s/` match the ones you pushed.

### 5. Deploy the application to EKS

```bash
kubectl apply -f k8s/
kubectl get pods
kubectl get svc
kubectl get ingress
```

Open the load balancer or ingress address shown above to access the app.

## Autoscaling Test

The `test/` folder contains YAML files used to test autoscaling of the application under load.

```bash
kubectl apply -f test/

# Watch the autoscaler react
kubectl get hpa -w
kubectl get pods -w
```

Clean up after the test:

```bash
kubectl delete -f test/
```

## Local Testing (Docker Compose)

For quick local checks only. This is not how the app runs in production.

```bash
docker compose up --build
docker compose down
```

## Cleanup

Remove the Kubernetes resources first, then destroy the infrastructure so the load balancers are deleted before Terraform removes the network.

```bash
kubectl delete -f k8s/
cd terraform
terraform destroy
```

## Configuration

Backend environment variables (adjust to your setup):

| Variable | Description |
|----------|-------------|
| `DB_HOST` | Database hostname |
| `DB_PORT` | Database port |
| `DB_USER` | Database username |
| `DB_PASSWORD` | Database password |
| `DB_NAME` | Database name |

Do not commit real credentials. Use Kubernetes Secrets or AWS Secrets Manager.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push the branch: `git push origin feature/my-feature`
5. Open a pull request

## License

Add a license (for example MIT) and state it here.

## Author

[Esmailfareed](https://github.com/Esmailfareed)
