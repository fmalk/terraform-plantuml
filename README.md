# terraform-plantuml

Generate PlantUML Images from a Terraform State file.

# Considerations:

Take precautions when using State files (as they are open JSON files, most likely with secrets).

This package does **NOT** require Internet connection to run, nor it stores any parsed info anywhere. Its only effect is to generate two output files: .puml and optionally .png files. Any possible sensitive value is ignored, it can even be redacted beforehand if Security procedures demand so.

Safest way to generate a valid TF State file is to run `terraform init, plan & apply` locally, not logged to any real service, using a tool like LocalStack.

# Steps

- Install `npm i -g tfpuml`
  - (Alpha) Not published to npm yet, so clone this repo, and run `npm link` from root
- Download a `plantuml.jar` from official sources
  - This packages comes with a script `tfpuml-download-plantuml`, run it to download a copy into this package folder 
  - Some IDEs are able to visualize PlantUML `.puml` files using plugins
- Copy your TF state file to this folder root as `terraform.tfstate`
- Run `tfpuml`
  - Output: `output.puml`
- Run `java -jar plantuml.jar output.puml`
  - Output: `Terraform Stage Graph.png`


## Options

- `tfpuml <input TF state file> <output .puml file>`
  - Defaults are `terraform.tfstate` and `output.puml`
- `tfpuml --image` runs the PlantUML visualization graphic lib at the end and outputs an `output.png` image file
- `tfpuml --no-check` ignores checking for Terraform Version, use it for state files versions < 1.30 (might run into issues)

See `tfpuml --help` for further options

# Support

- AWS
  - Buckets
  - IAM Users
  - Regions
    - VPCs
      - AZs
      - Subnets
  - RDS (partial)
  - EC2 (partial)
  - ECS (coming next)

# Roadmap

- More common resources supported
