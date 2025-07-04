# NEXT Theme

This is the default theme for Fewu 3. Inspired by [Fuwari theme for Astro](https://github.com/saicaca/fuwari).

[简体中文](README.zh-CN.md)

## Install

### Through `fewu-cli`

**Recommended**

Install `fewu-cli`:
```shell
npm i fewu-cli
```

Initialize workspace:
```shell
npx fewu init
```

Download theme and dependencies:
```shell
npm i
```

### Through NPM

```shell
npm i @fewu-swg/fewu-theme-next
```

### Through Git

```shell
git clone https://github.com/fewu-swg/fewu-theme-next themes/next
```

Install dependencies:

```sh
npm i -S @fortawesome/free-brands-svg-icons @material-symbols/svg-400
```

Or copy this `package.json` to working directory (where you put `config.yaml`) then execute `npm i`.

```json
{
  "dependencies": {
    "@fortawesome/free-brands-svg-icons": "^6.7.2",
    "@material-symbols/svg-400": "^0.27.2"
  }
}
```

## Features

* Support for Multi-language (with zh-CN, fr, en-US(default) langauge profile now)
* Support for Light/Dark mode (automatic switching)
* Support for senseless page navigating (Pjax-like)
* Responsive layout
* Comments (giscus)
* Table of content
* Open Graph Protocol

## Dependencies

* (npm) @fortawesome/free-brands-svg-icons
* (npm) @material-symbols/svg-400

## Configurations

### Custom Navigate

Add `additional_navs` (`Record<string,string>) to your configuration file,
The key (name) must be a string, the value must be a absolute url, the url will be directly filled into `href`

Default, the key will be translated if it's been found in the translations file. Keys start with `^` will not be translated and the starting `^` will be removed.

```yaml
additional_navs:
  ^About: /posts/about.md # Will not be translated
  About: /posts/about.md # Will be translated
```