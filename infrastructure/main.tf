terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "4.59.0"
    }
  }

  backend "s3" {
    bucket         	   = "recipe-app-code"
    key              	   = "state/infrastructure/terraform.tfstate"
    region         	   = "us-east-1"
    encrypt        	   = true
  }
}

provider "aws" {
  region = "us-east-1"
}

# main.tf
resource "aws_ecs_cluster" "my_cluster" {
  name = "recipe-app-cluster"
}


# main.tf
resource "aws_ecs_task_definition" "app_task" {
  family                   = "recipe-app-task"
  container_definitions    = <<DEFINITION
  [
    {
      "name": "recipe-app-task",
      "image": "greatnate27/recipe-application:latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 3000,
          "hostPort": 3000
        }
      ],
      "memory": 512,
      "cpu": 256
    }
  ]
  DEFINITION
  requires_compatibilities = ["FARGATE"] 
  network_mode             = "awsvpc"   
  memory                   = 512       
  cpu                      = 256        
  execution_role_arn       = "${aws_iam_role.ecsTaskExecutionRole.arn}"
}


resource "aws_iam_role" "ecsTaskExecutionRole" {
  name               = "ecsTaskExecutionRole"
  assume_role_policy = "${data.aws_iam_policy_document.assume_role_policy.json}"
}

data "aws_iam_policy_document" "assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "ecsTaskExecutionRole_policy" {
  role       = "${aws_iam_role.ecsTaskExecutionRole.name}"
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}


resource "aws_default_vpc" "default_vpc" {
}


resource "aws_default_subnet" "default_subnet_a" {
  availability_zone = "us-east-1a"
}

resource "aws_default_subnet" "default_subnet_b" {
  availability_zone = "us-east-1b"
}


resource "aws_alb" "application_load_balancer" {
  name               = "load-balancer-dev"
  load_balancer_type = "application"
  subnets = [
    "${aws_default_subnet.default_subnet_a.id}",
    "${aws_default_subnet.default_subnet_b.id}"
  ]
  security_groups = ["${aws_security_group.load_balancer_security_group.id}"]
}


resource "aws_security_group" "load_balancer_security_group" {
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] 
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_lb_target_group" "target_group" {
  name        = "target-group"
  port        = 80
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = "${aws_default_vpc.default_vpc.id}"
}

resource "aws_lb_listener" "listener" {
  load_balancer_arn = "${aws_alb.application_load_balancer.arn}" 
  port              = "80"
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = "${aws_lb_target_group.target_group.arn}"
  }
}


resource "aws_ecs_service" "app_service" {
  name            = "recipe-app-service" 
  cluster         = "${aws_ecs_cluster.my_cluster.id}" 
  task_definition = "${aws_ecs_task_definition.app_task.arn}"
  launch_type     = "FARGATE"
  desired_count   = 3

  load_balancer {
    target_group_arn = "${aws_lb_target_group.target_group.arn}"
    container_name   = "${aws_ecs_task_definition.app_task.family}"
    container_port   = 3000
  }

  network_configuration {
    subnets          = ["${aws_default_subnet.default_subnet_a.id}", "${aws_default_subnet.default_subnet_b.id}"]
    assign_public_ip = true 
    security_groups  = ["${aws_security_group.service_security_group.id}"]
  }
}


resource "aws_security_group" "service_security_group" {
  ingress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    security_groups = ["${aws_security_group.load_balancer_security_group.id}"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}


output "app_url" {
  value = aws_alb.application_load_balancer.dns_name
}