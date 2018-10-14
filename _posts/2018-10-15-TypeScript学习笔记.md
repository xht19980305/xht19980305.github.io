---
layout: post
title: TypeScript 学习笔记
subtitle: 重新系统的学习一遍 ts, 将其中一些有意思的知识点记录下来
date: 2018-10-15
author: Vm
header-img: /img/type-script/favicon.ico
catalog: true

tags:
  - TypeScript
  - Javascript
---

> Typescript 的优势：
>
> 1. 静态类型检查
> 2. IDE 智能提示
> 3. 代码重构
> 4. 可读性
>
> [知乎优秀回答](https://www.zhihu.com/question/28016252/answer/39056940)

# 前言

本文只是用于我的一个学习笔记，只针对我个人觉得有意思的知识点，只具备一些学习 ts 的参考性。

## [TypeScript 中文网](https://www.tslang.cn/docs/home.html)

学习版本为 TypeScript 2.7

### 手册指南

#### 基础类型

TypeScript 支持与 JavaScript（ES6） 几乎相同的数据类型，此外还提供了实用的枚举类型方便我们使用。

- 数组定义

```ts
let list: number[] = [1, 2, 3];
let list: Array<number> = [1, 2, 3];
```

- 元组 Tuple
  元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同

```ts
// Declare a tuple type
let x: [string, number];
// Initialize it
x = ["hello", 10]; // OK
// Initialize it incorrectly
x = [10, "hello"]; // Error
```

- 枚举
  enum 类型是对 JavaScript 标准数据类型的一个补充  
  默认情况下，从 0 开始为元素编号。 你也可以手动的指定成员的数值。

```ts
enum Color {
  Red = 1,
  Green,
  Blue
}
let c: Color = Color.Green;
```

- Any 和 Object 区别

```ts
let notSure: any = 4;
notSure.ifItExists(); // okay, ifItExists might exist at runtime
notSure.toFixed(); // okay, toFixed exists (but the compiler doesn't check)

let prettySure: Object = 4;
prettySure.toFixed(); // Error: Property 'toFixed' doesn't exist on type 'Object'.
```

- Null 和 Undefined
  默认情况下 null 和 undefined 是所有类型的子类型。 就是说你可以把 null 和 undefined 赋值给 number 类型的变量。  
  然而，当你指定了--strictNullChecks 标记，null 和 undefined 只能赋值给 void 和它们各自。 这能避免 很多常见的问题。 也许在某处你想传入一个 string 或 null 或 undefined，你可以使用联合类型 string | null | undefined。

- Never
  never 类型表示的是那些永不存在的值的类型。

```ts
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
  throw new Error(message);
}

// 推断的返回值类型为never
function fail() {
  return error("Something failed");
}

// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
  while (true) {}
}
```
