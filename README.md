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

基础思路,框架的 api 提供给基础的每个组件, 下游组件应该对框架无感，每个组件完成自己的基本职责:
1: 首先是应该是一个函数式展示组件,这个组件在画布中显示的样子,props 就是数据.
2: 侧边详细栏，上游框架提供数据和一个 onChange api 改变数据．(提供公共组件接口直接放到 options 里面)
3: 配置一个 options 对象，说明组件的基本信息．

### 第一阶段

先不考虑顶部公共操作栏，实现 3 块组件。把中间看成一个 canvas，左侧就是图画的基本元素，右侧就是基本元素的详细设置。

#### 左侧可用组件栏 (ComponentList)

主要功能是展示，然后提供一个 dragstart, 说明将要新增的是什么组件(type)

#### 右侧详细 (DetailPanel)

主要是一个容器,包裹具体的 detailPanel,向下输入 data 和 一个 onChange(改变 data 的方法)
为下游 api 提供 2 种模式, 简单的直接一个数组利用规则组件, 复杂的可以自定义组件

#### 中间画布 (Stage)

```html
<!-- layout层, overflow: auto; -->
<div>
  <!-- 组件层, 包括设置长宽, 点击, 右键菜单 等事件 -->
  <div>
    <componentWrapper></componentWrapper>
  </div>
  <canvas></canvas> 不需要事件的层, 批注框的连接线
</div>
```

1. drop 功能, 根据 type 获取新增的组件信息(注册的信息)
2. 显示组件的绘制
3. 框选组件, 单选
4. 右键菜单
5. 快捷键注册

#### 组件数据处理

目前是数据保留在顶层组件, 数据和修改数据的方法都往下流.
考虑到需要撤销和重做等问题,使用 redux 的思路,但是没必要增加复制度引入 redux,直接使用 useReducer 钩子.

#### 组件公共功能

- [x] 拖动
- [x] 缩放 (~~写一个包裹组件去实现, 具体功能可以再分组件去实现~~)
      ~~考虑到撤销和性能,拖拽移动但是数据不向上同步, stop 后同步数据.
      拖拽的界限, 向下如果有滚动条,自动向下滚动.
      高级: 当多选后,拖动一个,其他也一起移动.(通过自定义事件去沟通)~~
      缩放考虑按选中的各组件比例, 不放在包裹组件, 改成单独组件功能, 直接控制顶层数据
- [x] 组件的层叠(直接交换在数组里面的位置)
- [x] 组件的单选/框选,取消选择
- [x] 右键菜单

  由于 antd 自带的 dropdown 点击区域不能 mousedown 关闭等等问题;
  react-contextmenu 组件长按左键触发 open 等等问题;
  自行开发一个简易组件实现, 功能:

  1. 监听 contextmenu open.(记录鼠标位置, 方便粘贴等功能)
  2. mousedown(排除菜单区域) 和 windows blur 事件 hide. (菜单区域的点击, 只有触发事件区域关闭菜单)
  3. 注意菜单位置不超过 window.innerHeight 和 window.innerWidth

- [x] 键盘快捷键(需要注意触发时机)
- [x] 组件的对齐
      _ 左对齐/水平居中/右对齐/顶对齐/垂直居中/底对齐(2 个以上组件被选中)
      _ 水平等间距/垂直等间距(3 个以上组件被选中)
- [ ] 双击调出编辑

#### 拖动缩放

componentWrapper 组件

~~单个组件的拖动缩放功能状态由组件内部管理实现.~~
~~拖动结束同步数据到顶层.~~
~~拖动的时候其他选中的组件也一起移动, 每个选中的组件通过监听自定义事件去处理.~~

拖动和缩放功能分开
拖动还是在组件内部实现
缩放在外部实现, 缩放要考虑整体选中的组件, 各组件按比例缩放

#### undo/redo

~~需要有 debounce, 比如输入框的更新,等到失去焦点才记录 ?~~
~~输入框 undo/redo 事件自带~~
实现了 2 个更新接口

- updateWithoutHistory 不保存历史, 适用于输入框 input 事件和拖动事件等频繁触发的中间状态
- update 保存历史, 适用于失焦和拖动结束等保存状态

#### 疑难组件

1. 批注组件
   富文本编辑器,还是沿用 draft.js, focus 的时候接管键盘快捷键包括撤销重做

2. 表格

#### 全局快捷键兼容处理

editor 使用 hotkeys-js 注册事件， hotkeys-js 已经默认过滤 input/select/textarea/isContentEditable 的事件
添加一个自定义类 disableShortcutClassName, 如果触发 keydown 的 target 向上能找到有这个自定义属性，就忽略全局的事件

使用：针对表格、思维导图等内部有自定义快捷键的组件，在外部元素添加 disableShortcutClassName

#### 组件节点的思考

目前普通组件都是 HTML 节点, 但是有标记组件等矩形框, 要不要引入 canvas 层.
如果引入 canvas 层, 放到 html 层的上方, 因为必须要响应 html 节点的事件所以 canvas 层 event-points: none
可以通过 html 层的点击鼠标位置去触发 canvas 的点击移动缩放等等.

```html
<div>
  <dom></dom>
  <canvas></canvas>
</div>
```

因为现在只有矩形框的绘制, 还不必要引入 canvas 层, 先用 svg 处理.

### 属性分类

1. 顶部工具栏
   作用对象： 画布，或者组件的其他属性（位置等非组件自定义属性）

   1. 数据处理
      - 撤销（ctrl+z
      - 重做 (ctrl+shift+z)
      - 保存
   2. 标记组件（兼容方案，应该放到左边组件栏）
      - 重点标记
      - 添加批注
   3. 对其 （当选中 2 个组件以上时可用）
      - 左对齐
      - 水平居中
      - 右对齐
      - 顶对齐
      - 垂直居中
      - 底对齐
   4. 排列（当选中 3 个组件以上时可用）
      - 水平等间距
      - 垂直等间距
   5. 图层
      - 置于顶层
      - 置于底层
   6. 画布缩放
      - 放大
      - 缩小

2. 右侧属性栏
   作用对象：组件的自定义属性（背景颜色，边框等）
3. 组件内部工具栏
   作用对象：组件的内部功能（富文本编辑器的斜体、加粗等）, 也可以根据情况放到右侧属性栏

### 数据结构

```ts
// 单个组件数据
interface ComponentData<T = any> {
  id: ComponentId; // 组件ID（唯一）
  type: string; // 组件类型（对应不同的data）
  data: T; // 组件自定义数据对象（右侧属性栏修改）
  left: number;
  top: number;
  width: number;
  height: number;
  index: number; // 图层位置
  association?: ComponentId; // 关联组件
  gid: ComponentId; // 组合而成的组的id
}

// group
interface ComponentGroup {
  id: ComponentId; // id
  componentType: 1; // 标识类型为组
}
```

- [ ] 确认所有的组件的数据的类型
- [ ] 组件的基础样式
- [ ] 缩放
- [ ] 表格
- [ ] 富文本
- [ ] 复合组件的基础
