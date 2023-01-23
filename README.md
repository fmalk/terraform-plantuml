# terraform-plantuml

Generate PlantUML Images from a Terraform State file.

# Considerations:

Take precautions when using State files (as they are open JSON files, most likely with secrets).

This package does **NOT** require Internet connection to run, nor it stores any parsed info anywhere. Its only effect is to generate an output file (PlantUML, a text format). Any possible sensitive value is ignored, it can even be redacted beforehand if Security procedures demand so.

Safest way to generate a valid TF State file is to run `terraform init, plan & apply` locally, not logged to any real service, using a tool like LocalStack.

# Steps

- Download a `plantuml.jar` from official sources
  - Some IDEs are able to visualize PlantUML `.puml` files using plugins
- Copy your TF state file to this folder root as `terraform.tfstate`
- Run `node index`
  - Output: `output.puml`
- Run `java -jar plantuml.jar output.puml`
  - Output: `Terraform Stage Graph.png`

# Support

- AWS
  - Buckets
  - IAM Users
  - Regions
    - VPCs
      - AZs
      - Subnets
  - RDS (partial)
  - EC2 (coming next)

# Roadmap

- Enhance the CLI a little, so `npm i -g terraform-plantuml` is possible
- More common resources supported
