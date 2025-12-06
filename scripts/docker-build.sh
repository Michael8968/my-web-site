#!/bin/bash

# Docker 镜像构建和推送脚本
# 使用方法: ./scripts/docker-build.sh [tag] [push]
# 示例: ./scripts/docker-build.sh v1.0.0 push

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 获取 Docker Hub 用户名（从环境变量或提示输入）
DOCKER_USERNAME=${DOCKER_USERNAME:-""}
IMAGE_NAME=${IMAGE_NAME:-"my-web-site"}

# 如果没有设置，提示用户输入
if [ -z "$DOCKER_USERNAME" ]; then
    echo -e "${YELLOW}请输入 Docker Hub 用户名:${NC}"
    read DOCKER_USERNAME
fi

# 获取标签（默认为 latest）
TAG=${1:-"latest"}

# 完整的镜像名称
FULL_IMAGE_NAME="${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}"

echo -e "${GREEN}开始构建 Docker 镜像...${NC}"
echo -e "镜像名称: ${FULL_IMAGE_NAME}"

# 构建镜像
docker build -t "${FULL_IMAGE_NAME}" .

# 如果提供了第二个参数 "push"，则推送镜像
if [ "$2" = "push" ]; then
    echo -e "${GREEN}开始推送镜像到 Docker Hub...${NC}"
    
    # 检查是否已登录
    if ! docker info | grep -q "Username"; then
        echo -e "${YELLOW}未检测到 Docker Hub 登录，请先登录:${NC}"
        docker login
    fi
    
    # 推送镜像
    docker push "${FULL_IMAGE_NAME}"
    
    echo -e "${GREEN}镜像推送成功！${NC}"
    echo -e "镜像地址: https://hub.docker.com/r/${DOCKER_USERNAME}/${IMAGE_NAME}"
else
    echo -e "${YELLOW}镜像构建完成，但未推送。${NC}"
    echo -e "要推送镜像，请运行: ${GREEN}./scripts/docker-build.sh ${TAG} push${NC}"
fi

echo -e "${GREEN}完成！${NC}"

