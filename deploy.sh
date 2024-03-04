#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm i
npm run build:h5

# 进入生成的文件夹
cd dist/build/h5

# deploy to github pages

if [ -z "$GITHUB_TOKEN" ]; then
  msg='deploy'
  githubUrl=git@github.com:tyvt/cl.git
else
  msg='来自github actions的自动部署'
  githubUrl=https://tyvt:${GITHUB_TOKEN}@github.com/tyvt/cl.git
  git config --global user.name "example"
  git config --global user.email "example@example.com"
fi
git init
git add -A
git commit -m "${msg}"
git push -f $githubUrl master:gh-pages # 推送到github gh-pages分支

cd -
rm -rf dist
