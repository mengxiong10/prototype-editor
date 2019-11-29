#!/bin/bash
set -e

directory=dist
branch=release

if [[ -z $1 ]]; then
  echo "Enter new version: "
  read -r VERSION
else
  VERSION=$1
fi

read -p "Releasing $VERSION - are you sure? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Releasing $VERSION ..."

  rm -rf $directory

  git worktree add $directory $branch

  # build
  VERSION=$VERSION npm run build

  cd $directory

  git add -A
  git commit -m "$VERSION"
  git push origin $branch

  cd ../

  git worktree remove $directory

  echo "Release $VERSION success"

  echo "Syning..."

  npm version $VERSION --message "$VERSION"

  git push
  git push origin refs/tags/v$VERSION
  git checkout dev
  git rebase master
  git push origin dev

fi
