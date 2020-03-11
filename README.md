# 原型工具画布 概要设计文档

## 背景

旧的项目由于历史原因用到大量的 class 的继承, 类似于 mixins 的副作用, 伴随使项目变大, 变的极难维护.
再加上项目原始的开发和构建的搭建配置使开发效率非常低, 代码规范不明确等等问题.
重构的目的: 重新设计框架底层, 提供更简单易用的接口, 更好的性能.

## 关键业务流程

## 关键技术描述

- 主体框架语言还是 TypeScript + React(hooks);
- 整体数据不可变库使用 Immer 替换 ImmutableJS, Immer 的 api 非常简单, 非常适合 React,性能比 ImmutableJS+toJS 要好. 实际项目中基础组件的开发也不应该受到不可变库的影响. 如果使用 draftJS,需要配合 ImmutableJS, 可以在局部使用.
- css 使用 scss 和 css modules 避免全局污染, .module.scss 后缀使用 css modules, .scss 全局引入. 使用 babel-react-css-modules 自动转化 styleName 成局部 className;

## 模块拆分

- 工具栏(Toolbar)
- 组件列表(ComponentList)
- 画布中心组件的显示(Page)
- 组件详情(DetailPanel)

思维导图描述

## 目录说明

```
root
├── build                 打包文件
├── config                打包文件配置
├── src
│   ├── editor            框架结构
│   ├── items             画布组件
│   ├── style             全局的样式
│   ├── svg               svg文件(可直接引用为组件)
│   └── utils             公共工具方法
└── typings               补充的声明文件

```

## 命名规范

### git commit message

遵循[Angular 约定](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>

```

Samples:

```
fix: A bug fix

feat: A new feature

```

### 组件命名

- `props`中的方法一定要`on`开头

- 处理事件的方法用`handle`开头

- 修改 state 的值的方法一般用`change`开头

## 构建过程

基础思路,框架的 api 提供给基础的每个组件, 下游组件应该对框架无感，每个组件的基本职责:
1: 首先是应该是一个函数式展示组件,这个组件在画布中显示的样子.
2: 侧边详细栏，上游框架提供数据和一个 onChange api 改变数据．
3: 配置一个 options 对象，说明组件的基本信息．

### 第一阶段

先不考虑顶部公共操作栏，实现 3 块组件。把中间看成一个 canvas，左侧就是图画的基本元素，右侧就是基本元素的详细设置。

#### 左侧可用组件栏 (ComponentList)

主要功能是展示，然后提供一个 dragstart

#### 右侧详细 (DetailPanel)

主要是一个容器,包裹具体的 detailPanel,向下输入 data 和 一个 onChange(改变 data 的方法)

#### 中间画布 (Stage)

主要是 drop 增加组件, 显示组件的绘制;

#### 组件数据处理

目前是数据保留在顶层组件, 数据和修改数据的方法都往下流.
考虑到需要撤销和重做等问题,使用 redux 的思路,但是没必要增加复制度引入 redux,直接使用 useReducer 钩子.

#### 组件公共功能

- [x] 拖动,缩放 (写一个包裹组件去实现, 具体功能可以再分组件去实现)
- [x] 组件的层叠(直接交换在数组里面的位置)
- [x] 组件的单选/框选,取消选择.
- [ ] 右键菜单
- [ ] 键盘快捷键
- [ ] 双击调出编辑

#### 疑难组件

1. 批注组件

2. 表格

#### 数据的思考

每个组件有默认的数据, 这个数据要不要作为添加组件的时候的初始数据?
如果修改了默认数据, 那么按照不存数据库的方案老的组件显示的数据就会跟着修改,反之老的组件显示的数据不会修改,但是新的组件又会修改.
暂时先按照不存数据库,减少数据的大小.
