#cloud-config

bootcmd:
  - mkdir -p /etc/ecs
  - echo 'ECS_CLUSTER=example' >> /etc/ecs/ecs.config
