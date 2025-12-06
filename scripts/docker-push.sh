#!/bin/bash

# Docker 镜像推送脚本
# 使用方法: ./scripts/docker-push.sh [dockerhub-username] [tag]
# 示例: ./scripts/docker-push.sh myusername latest

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 获取参数
DOCKER_USERNAME=${1:-""}
TAG=${2:-"latest"}
IMAGE_NAME="my-web-site"

# 如果没有提供用户名，提示输入
if [ -z "$DOCKER_USERNAME" ]; then
    echo -e "${YELLOW}请输入您的 Docker Hub 用户名:${NC}"
    read DOCKER_USERNAME
fi

# 完整的镜像名称
FULL_IMAGE_NAME="${DOCKER_USERNAME}/${IMAGE_NAME}:${TAG}"
LOCAL_IMAGE_NAME="${IMAGE_NAME}:latest"

echo -e "${GREEN}准备推送镜像到 Docker Hub...${NC}"
echo -e "本地镜像: ${LOCAL_IMAGE_NAME}"
echo -e "目标镜像: ${FULL_IMAGE_NAME}"

# 检查本地镜像是否存在
if ! docker images | grep -q "^${IMAGE_NAME}"; then
    echo -e "${RED}错误: 本地镜像 ${LOCAL_IMAGE_NAME} 不存在${NC}"
    echo -e "${YELLOW}请先运行: docker build -t ${LOCAL_IMAGE_NAME} .${NC}"
    exit 1
fi

# 标记镜像
echo -e "${GREEN}标记镜像...${NC}"
docker tag "${LOCAL_IMAGE_NAME}" "${FULL_IMAGE_NAME}"

# 检查是否已登录 Docker Hub
if ! docker info | grep -q "Username"; then
    echo -e "${YELLOW}未检测到 Docker Hub 登录，请先登录:${NC}"
    docker login
fi

# 推送镜像
echo -e "${GREEN}推送镜像到 Docker Hub...${NC}"
docker push "${FULL_IMAGE_NAME}"

echo -e "${GREEN}✓ 镜像推送成功！${NC}"
echo -e "镜像地址: https://hub.docker.com/r/${DOCKER_USERNAME}/${IMAGE_NAME}"
echo -e ""
echo -e "使用以下命令拉取镜像:"
echo -e "  docker pull ${FULL_IMAGE_NAME}"

