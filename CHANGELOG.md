# CHANGE LOG

## v2.1.6


### 📦 Build

  - Upgrade rollup config for load json file (c2c4ebc)

### 🏡 Chore

  - Update readme docs (bdfab83)

### ❤️  Contributors

- Wenqing <wenqing@kerrylan.com>

## 2.1.0 (2022-12-21)

**Upgrade**

1. upgrade `svgo plugin` definition.

**Features**

1. Support change svg icon size with `font-size` and it will be responsive.


## 2.0.0 (2022-12-21)

**Breaking changes**

1. As of **@vue/compiler-sfc** 3.2.13+, this package is included as a dependency of the main **vue** package and can be accessed as `vue/compiler-sfc`. This means you no longer need to explicitly install this package and ensure its version match that of vue's. Just use the main `vue/compiler-sfc` deep import instead.
2. Change **svgo** default config.
   
**Features**

1. Support change svg icon color when the svg is a monochrome svg icon.

## 1.2.0 (2022-12-20)

**Features**

1. Support caching at build time.

## 1.1.1 (2022-12-20)

**Bugfixs**

1. fix package.json `files`.

## 1.1.0 (2022-12-20)

**Features**

1. Support `assetsDirName` to Limit the svg icon in a folder.
2. Add declaration file for Vue app. [client.d.ts]('./client.d.ts').
3. Change `defaultExport` to `url`.