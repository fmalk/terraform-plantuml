# Created with ChatGPT

provider "aws" {
  region = "us-west-2"
}

resource "aws_ecs_task_definition" "example_task_def" {
  family = "example_task"

  container_definitions = <<EOF
[
  {
    "name": "example_container",
    "image": "nginx:latest",
    "memory": 128,
    "portMappings": [
      {
        "containerPort": 80,
        "hostPort": 80
      }
    ]
  }
]
EOF
}

resource "aws_ecs_cluster" "example_cluster" {
  name = "example_cluster"
}

resource "aws_ecs_service" "example_service" {
  name            = "example_service"
  cluster         = aws_ecs_cluster.example_cluster.id
  task_definition = aws_ecs_task_definition.example_task_def.arn
  desired_count   = 1

  launch_type = "EC2"

  network_configuration {
    assign_public_ip = true

    security_groups = [
      aws_security_group.example_security_group.id
    ]

    subnets = aws_subnet.example_subnets.*.id
  }
}

resource "aws_security_group" "example_security_group" {
  name        = "example_security_group"
  description = "Allow HTTP traffic"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_subnet" "example_subnets" {
  count = 2

  cidr_block = "10.0.${count.index + 1}.0/24"
  vpc_id     = aws_vpc.example_vpc.id
}

resource "aws_vpc" "example_vpc" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "example_vpc"
  }
}
