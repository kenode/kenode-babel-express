# 在 Node.js 里使用 Babel

**Babel**是一个非常代码转换器，可以完美的将**ES6**代码转换**ES5**；**Babel**的更新速度非常快，您甚至可以在你的代码中提前使用**ES7**的一些特性。

### 1. 首先检查您的 npm 的版本

```bash
npm -v
```

如果你的版本低于 `3.3.0`，那么请升级它

```bash
npm i -g npm@3.x
```

### 2. 安装 babel 命令行

```bash
npm i -g babel-cli
```

现在您的系统中已经有了 `babel`, `babel-node`, `babel-doctor` 三条命令

- babel        转换代码命令
- babel-node   直接运行代码命令
- babel-doctor 检查环境

### 3. 在项目中使用

安装依赖模块

```bash
npm i --save-dev babel-core babel-preset-es2015 babel-preset-stage-0
```

在根目录创建.babelrc文件，内容如下：

```json
{
  "presets": ["es2015", "stage-0"]
}
```

转化**ES6**代码

```bash
babel src/app.js -d dist
```
运行**ES6**代码

```bash
babel-node src/app.js
```

### 4. gulp 中使用

**gulp**版本不能低于 `3.9.0`

```bash
gulp -v
```

如果低于 `3.9.0`，就请升级它

```bash
npm i -g gulp@3.9.x
```

将 `gulpfile.js` 更名为 `gulpfile.babel.js`，现在您的 `gulpfile` 支持**ES6**方法了

运行**gulp**

```bash
gulp
```

### 5. pm2 中使用

```bash
pm2 start app.js -i 0 --name "api" --interpreter babel-node
```
