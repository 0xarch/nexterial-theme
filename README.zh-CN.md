# NEXT

这是 Fewu 3 的默认主题。受 [Fuwari 主题](https://github.com/saicaca/fuwari) 启发。

[English](README.md)

## 安装

### 通过 `fewu-cli`

**推荐此方式**

安装 `fewu-cli`:
```shell
npm i fewu-cli
```

初始化工作区：
```shell
npx fewu init
```

下载主题和依赖：
```shell
npm i
```

### 通过 NPM

```shell
npm i @fewu-swg/fewu-theme-next
```

### 通过 Git

```shell
git clone https://github.com/fewu-swg/fewu-theme-next themes/next
```

处理依赖：

```sh
npm i -S @fortawesome/free-brands-svg-icons @material-symbols/svg-400
```

或将此 `package.json` 复制到工作区下，然后执行 `npm i`：

```json
{
  "dependencies": {
    "@fortawesome/free-brands-svg-icons": "^6.7.2",
    "@material-symbols/svg-400": "^0.27.2"
  }
}
```

## 功能

* 支持多语言（目前有zh-CN,fr,en(默认)的语言文件）
* 支持亮暗主题（自动切换）
* 支持无感导航（类Pjax）
* 响应式布局
* 评论系统（支持giscus）
* 文章目录
* Open Graph 协议

## 依赖项

* (npm) @fortawesome/free-brands-svg-icons
* (npm) @material-symbols/svg-400

## 配置

### 自定义导航栏

添加 `additional_navs` (`Record<string,string>) 到你的配置文件中,
键(导航名)必须是字符串, 值必须是绝对URL, 值将被直接填入`href`


默认情况下, 若语言文件中包含键, 则键会被翻译. 以 `^` 开头的键将不会被翻译, `^` 将在生成时被移除.

```yaml
additional_navs:
  ^About: /posts/about.md # 不会翻译
  About: /posts/about.md # 会翻译
```