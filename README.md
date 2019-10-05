# Mincut Maxflow

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)
![](https://github.com/ahimta/mincut-maxflow/workflows/.github/workflows/workflow.yml/badge.svg)

## Prerequesites

- [Node/NVM](https://github.com/nvm-sh/nvm)
- [yarn](https://yarnpkg.com)

## Getting Started

```bash
nvm install `cat .nvmrc | head -n 1`
nvm use

npm install --global yarn

yarn install --emoji
yarn run test
yarn run coverage
yarn run audit
```

## Upgrading Packages

```bash
yarn run outdated
# Now review URLs and see what's new/changed from the current releases.
yarn run upgrade # This is to cover non-major upgrades.
# Use `yarn run upgrade-major <package>` for major upgrades.
```
