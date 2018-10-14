---
layout: post
title: TypeScript 学习笔记
subtitle: 重新系统的学习一遍 ts, 将其中一些有意思的知识点记录下来
date: 2018-10-15
author: Vm
header-img: img/type-script/foreground_bluprint.svg
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

- 类型断言

  通过类型断言这种方式可以告诉编译器，“相信我，我知道自己在干什么”。 类型断言好比其它语言里的类型转换，但是不进行特殊的数据检查和解构。 它没有运行时的影响，只是在编译阶段起作用。

  ```ts
  let someValue: any = "this is a string";

  let strLength: number = (<string>someValue).length;
  let strLength: number = (someValue as string).length;
  ```

#### 变量声明

因为 TypeScript 是 JavaScript 的超集，所以它本身就支持 let 和 const。

- var

  - 变量提升
  - 最小的作用域为函数（不存在块级作用域）

- let

  - 块级作用域
  - 不能在被声明之前读或写
  - 仍然可以在一个拥有块作用域变量被声明前获取它，只是我们不能在变量声明前去调用那个函数。
  - 重定义及屏蔽

  ```ts
  for (var i = 0; i < 10; i++) {
    // capture the current state of 'i'
    // by invoking a function with its current value
    (function(i) {
      setTimeout(function() {
        console.log(i);
      }, 100 * i);
    })(i);
  }

  for (let i = 0; i < 10; i++) {
    setTimeout(function() {
      console.log(i);
    }, 100 * i);
  }
  ```

- let vs. const

  使用最小特权原则，所有变量除了你计划去修改的都应该使用 const。 基本原则就是如果一个变量不需要对它写入，那么其它使用这些代码的人也不能够写入它们，并且要思考为什么会需要对这些变量重新赋值。 使用 const 也可以让我们更容易的推测数据的流动。

- 解构

  - 数组解构

    ```ts
    let input = [1, 2];
    let [first, second] = input;
    console.log(first); // outputs 1
    console.log(second); // outputs 2
    // 解构作用于已声明的变量会更好
    [first, second] = [second, first];
    // 作用于函数参数
    function f([first, second]: [number, number]) {
      console.log(first);
      console.log(second);
    }
    f(input);
    //你可以在数组里使用...语法创建剩余变量
    let [first, ...rest] = [1, 2, 3, 4];
    console.log(first); // outputs 1
    console.log(rest); // outputs [ 2, 3, 4 ]

    let [, second, , fourth] = [1, 2, 3, 4];
    ```

  - 对象解构

    ```ts
    let o = {
      a: "foo",
      b: 12,
      c: "bar"
    };
    let { a, b } = o;

    ({ a, b } = { a: "baz", b: 101 });

    let { a, ...passthrough } = o;
    let total = passthrough.b + passthrough.c.length;

    // 你也可以给属性以不同的名字
    let { a: newName1, b: newName2 }: { a: string; b: number } = o;

    // 可以设置默认值 默认值可以让你在属性为 undefined 时使用缺省值
    function keepWholeObject(wholeObject: { a: string; b?: number }) {
      let { a, b = 1001 } = wholeObject;
    }

    // 你需要知道在解构属性上给予一个默认或可选的属性用来替换主初始化列表
    function f({ a, b = 0 } = { a: "" }): void {
      // ...
    }
    f({ a: "yes" }); // ok, default b = 0
    f(); // ok, default to {a: ""}, which then defaults b = 0
    f({}); // error, 'a' is required if you supply an argument
    ```

  要小心使用解构。 从前面的例子可以看出，就算是最简单的解构表达式也是难以理解的。 尤其当存在深层嵌套解构的时候，就算这时没有堆叠在一起的重命名，默认值和类型注解，也是令人难以理解的。 解构表达式要尽量保持小而简单。 你自己也可以直接使用解构将会生成的赋值表达式。

- 展开

  展开操作符正与解构相反

  ```ts
  let first = [1, 2];
  let second = [3, 4];
  let bothPlus = [0, ...first, ...second, 5];

  // 它是从左至右进行处理，但结果仍为对象。 这就意味着出现在展开对象后面的属性会覆盖前面的属性
  let defaults = { food: "spicy", price: "$$", ambiance: "noisy" };
  let search = { ...defaults, food: "rich" };

  // 它仅包含对象 自身的可枚举属性: 当你展开一个对象实例时，你会丢失其方法
  class C {
    p = 12;
    m() {}
  }
  let c = new C();
  let clone = { ...c };
  clone.p; // ok
  clone.m(); // error!
  ```

  其次，TypeScript 编译器不允许展开泛型函数上的类型参数。 这个特性会在 TypeScript 的未来版本中考虑实现。

#### 接口
