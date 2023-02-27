# CHANGE LOG

## v2.6.0


### 🚀 Enhancements

  - **svgo-plugins:** Move built-in svgo plugins into svgo-extra (6bbbda6)

### 🏡 Chore

  - **docs:** Update readme (43ad361)

### ❤️  Contributors

- Wenqing <wenqing@kerrylan.com>

## v2.5.1


### 🩹 Fixes

  - Add css vars error (7ccce52)

### ❤️  Contributors

- Wenqing <wenqing@kerrylan.com>

## v2.5.0


### 🚀 Enhancements

  - Add origin size with unit css vars (2dd2453)

### 🏡 Chore

  - **docs:** Update readme (9e274b2)
  - **example:** Update example (b402604)

### ❤️  Contributors

- Wenqing <wenqing@kerrylan.com>

## v2.4.0


### 🚀 Enhancements

  - Support modifying fill-opacity and stroke-opacity on the svg node (5252255)

### 🏡 Chore

  - **example:** Update example (585ae02)
  - **docs:** Update readme (3282e0c)
  - **example:** Fix example deploy error (dcad7b9)

### ❤️  Contributors

- Wenqing <wenqing@kerrylan.com>

## v2.3.1


### 🏡 Chore

  - **docs:** Update readme (ebcb3fa)

### ❤️  Contributors

- Wenqing <wenqing@kerrylan.com>

## v2.3.0


### 🚀 Enhancements

  - Support optimize svg stroke attribute so that you can change a outline svg color (ba88849)

### ❤️  Contributors

- Wenqing <wenqing@kerrylan.com>

## v2.2.2


### 🏡 Chore

  - **example:** Update example (fb8f68a)

### ❤️  Contributors

- Wenqing <wenqing@kerrylan.com>

## v2.2.1


### 🩹 Fixes

  - Raw svg compile error (7f437be)

### ❤️  Contributors

- Wenqing <wenqing@kerrylan.com>

## v2.2.0


### 🚀 Enhancements

  - Support raw svg optimize (70adae7)

### ❤️  Contributors

- Wenqing <wenqing@kerrylan.com>

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