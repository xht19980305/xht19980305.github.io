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

TypeScript 的核心原则之一是对值所具有的结构进行类型检查

- 只读属性
  一些对象属性只能在对象刚刚创建的时候修改其值

  ```ts
  interface Point {
    readonly x: number;
    readonly y: number;
  }
  // ReadonlyArray<T>类型，它与 Array<T>相似，只是把所有可变方法去掉了,因此可以确保数组创建后再也不能被修改：
  let a: number[] = [1, 2, 3, 4];
  let ro: ReadonlyArray<number> = a;
  ro[0] = 12; // error!
  ro.push(5); // error!
  ro.length = 100; // error!
  // 把整个ReadonlyArray赋值到一个普通数组也是不可以的。 但是你可以用类型断言重写：
  a = ro; // error!
  a = ro as number[];
  ```

  - readonly vs const
    最简单判断该用 readonly 还是 const 的方法是看要把它做为变量使用还是做为一个属性。 做为变量使用的话用 const，若做为属性则使用 readonly。

- 字符串索引签名

  ```ts
  //表示的是SquareConfig可以有任意数量的属性，并且只要它们不是 color 和 width，那么就无所谓它们的类型是什么。
  interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
  }
  ```

- 函数类型
  为了使用接口表示函数类型，我们需要给接口定义一个调用签名。 它就像是一个只有参数列表和返回值类型的函数定义。参数列表里的每个参数都需要名字和类型。

  ```ts
  interface SearchFunc {
    (source: string, subString: string): boolean;
  }

  let mySearch: SearchFunc;
  // 函数的参数名不需要与接口里定义的名字相匹配
  mySearch = function(source: string, subString: string) {
    let result = source.search(subString);
    return result > -1;
  };

  // 如果你不想指定类型，TypeScript的类型系统会推断出参数类型，因为函数直接赋值给了 SearchFunc类型变量
  let mySearch: SearchFunc;
  mySearch = function(src, sub) {
    let result = src.search(sub);
    return result > -1;
  };
  ```

- 可索引的类型
  可索引类型具有一个 索引签名，它描述了对象索引的类型，还有相应的索引返回值类型。  
  共有支持两种索引签名：字符串和数字。 可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型。 这是因为当使用 number 来索引时，JavaScript 会将它转换成 string 然后再去索引对象。 也就是说用 100（一个 number）去索引等同于使用"100"（一个 string）去索引，因此两者需要保持一致。

  ```ts
  interface StringArray {
    [index: number]: string;
  }
  let myArray: StringArray;
  myArray = ["Bob", "Fred"];
  let myStr: string = myArray[0];

  class Animal {
    name: string;
  }
  class Dog extends Animal {
    breed: string;
  }
  // 错误：使用数值型的字符串索引，有时会得到完全不同的Animal!
  interface NotOkay {
    [x: number]: Animal;
    [x: string]: Dog;
  }

  interface NumberDictionary {
    [index: string]: number;
    length: number; // 可以，length是number类型
    name: string; // 错误，`name`的类型与索引类型返回值的类型不匹配
  }

  //将索引签名设置为只读，这样就防止了给索引赋值：
  interface ReadonlyStringArray {
    readonly [index: number]: string;
  }
  let myArray: ReadonlyStringArray = ["Alice", "Bob"];
  myArray[2] = "Mallory"; // error!
  ```

- 类类型

  - 实现接口
    接口描述了类的公共部分，而不是公共和私有两部分。 它不会帮你检查类是否具有某些私有成员。
  - 类静态部分与实例部分的区别

    ```ts
    // 因为 createClock 的第一个参数是 ClockConstructor 类型，在 createClock(AnalogClock, 7, 32) 里，会检查 AnalogClock 是否符合构造函数签名。
    interface ClockConstructor {
      new (hour: number, minute: number): ClockInterface;
    }
    interface ClockInterface {
      tick();
    }

    function createClock(
      ctor: ClockConstructor,
      hour: number,
      minute: number
    ): ClockInterface {
      return new ctor(hour, minute);
    }

    class DigitalClock implements ClockInterface {
      constructor(h: number, m: number) {}
      tick() {
        console.log("beep beep");
      }
    }
    class AnalogClock implements ClockInterface {
      constructor(h: number, m: number) {}
      tick() {
        console.log("tick tock");
      }
    }

    let digital = createClock(DigitalClock, 12, 17);
    let analog = createClock(AnalogClock, 7, 32);
    ```

  - 混合类型

  ```ts
  // 一个对象可以同时做为函数和对象使用，并带有额外的属性。
  interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
  }

  function getCounter(): Counter {
    let counter = <Counter>function(start: number) {};
    counter.interval = 123;
    counter.reset = function() {};
    return counter;
  }

  let c = getCounter();
  c(10);
  c.reset();
  c.interval = 5.0;
  ```

  - 接口继承类
    当接口继承了一个类类型时，它会继承类的成员但不包括其实现。 就好像接口声明了所有类中存在的成员，但并没有提供具体实现一样。 接口同样会继承到类的 private 和 protected 成员。 这意味着当你创建了一个接口继承了一个拥有私有或受保护的成员的类时，这个接口类型只能被这个类或其子类所实现（implement）。

  ```ts
  class Control {
    private state: any;
  }

  interface SelectableControl extends Control {
    select(): void;
  }

  class Button extends Control implements SelectableControl {
    select() {}
  }

  class TextBox extends Control {
    select() {}
  }

  // 错误：“Image”类型缺少“state”属性。
  class Image implements SelectableControl {
    select() {}
  }

  class Location {}
  ```

#### 类

- 理解 protected
  protected 修饰符与 private 修饰符的行为很相似，但有一点不同， protected 成员在派生类中仍然可以访问

  ```ts
  class Person {
    protected name: string;
    constructor(name: string) {
      this.name = name;
    }
  }

  class Employee extends Person {
    private department: string;

    constructor(name: string, department: string) {
      super(name);
      this.department = department;
    }

    public getElevatorPitch() {
      return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
  }

  let howard = new Employee("Howard", "Sales");
  console.log(howard.getElevatorPitch());
  console.log(howard.name); // 错误
  ```

  构造函数也可以被标记成 protected。 这意味着这个类不能在包含它的类外被实例化，但是能被继承。

  ```ts
  class Person {
    protected name: string;
    protected constructor(theName: string) {
      this.name = theName;
    }
  }

  // Employee 能够继承 Person
  class Employee extends Person {
    private department: string;

    constructor(name: string, department: string) {
      super(name);
      this.department = department;
    }

    public getElevatorPitch() {
      return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
  }

  let howard = new Employee("Howard", "Sales");
  let john = new Person("John"); // 错误: 'Person' 的构造函数是被保护的.
  ```

- readonly 修饰符
  你可以使用 readonly 关键字将属性设置为只读的。 只读属性必须在声明时或构造函数里被初始化。

  ```ts
  class Octopus {
    readonly name: string;
    readonly numberOfLegs: number = 8;
    constructor(theName: string) {
      this.name = theName;
    }
  }
  let dad = new Octopus("Man with the 8 strong legs");
  dad.name = "Man with the 3-piece suit"; // 错误! name 是只读的.
  ```

- 静态属性
  我们也可以创建类的静态成员，这些属性存在于类本身上面而不是类的实例上

  ```ts
  class Grid {
    static origin = { x: 0, y: 0 };
    calculateDistanceFromOrigin(point: { x: number; y: number }) {
      let xDist = point.x - Grid.origin.x;
      let yDist = point.y - Grid.origin.y;
      return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
    }
    constructor(public scale: number) {}
  }

  let grid1 = new Grid(1.0); // 1x scale
  let grid2 = new Grid(5.0); // 5x scale
  ```

- 抽象类
  抽象类中的抽象方法不包含具体实现并且必须在派生类中实现。 抽象方法的语法与接口方法相似。 两者都是定义方法签名但不包含方法体。 然而，抽象方法必须包含 abstract 关键字并且可以包含访问修饰符。

  ```ts
  abstract class Department {
    constructor(public name: string) {}

    printName(): void {
      console.log("Department name: " + this.name);
    }

    abstract printMeeting(): void; // 必须在派生类中实现
  }

  class AccountingDepartment extends Department {
    constructor() {
      super("Accounting and Auditing"); // 在派生类的构造函数中必须调用 super()
    }

    printMeeting(): void {
      console.log("The Accounting Department meets each Monday at 10am.");
    }

    generateReports(): void {
      console.log("Generating accounting reports...");
    }
  }

  let department: Department; // 允许创建一个对抽象类型的引用
  department = new Department(); // 错误: 不能创建一个抽象类的实例
  department = new AccountingDepartment(); // 允许对一个抽象子类进行实例化和赋值
  department.printName();
  department.printMeeting();
  department.generateReports(); // 错误: 方法在声明的抽象类中不存在
  ```

- 高级技巧

  - 构造函数

    ```ts
    class Greeter {
      static standardGreeting = "Hello, there";
      greeting: string;
      greet() {
        if (this.greeting) {
          return "Hello, " + this.greeting;
        } else {
          return Greeter.standardGreeting;
        }
      }
    }

    let greeter1: Greeter;
    greeter1 = new Greeter();
    console.log(greeter1.greet());

    let greeterMaker: typeof Greeter = Greeter;
    greeterMaker.standardGreeting = "Hey there!";

    let greeter2: Greeter = new greeterMaker();
    console.log(greeter2.greet());
    ```

  - 把类当做接口使用

    ```ts
    class Point {
      x: number;
      y: number;
    }

    interface Point3d extends Point {
      z: number;
    }

    let point3d: Point3d = { x: 1, y: 2, z: 3 };
    ```

#### 函数

- 默认参数
  与普通可选参数不同的是，带默认值的参数不需要放在必须参数的后面。 如果带默认值的参数出现在必须参数前面，用户必须明确的传入 undefined 值来获得默认值。 例如，我们重写最后一个例子，让 firstName 是带默认值的参数：

  ```ts
  function buildName(firstName = "Will", lastName: string) {
    return firstName + " " + lastName;
  }

  let result1 = buildName("Bob"); // error, too few parameters
  let result2 = buildName("Bob", "Adams", "Sr."); // error, too many parameters
  let result3 = buildName("Bob", "Adams"); // okay and returns "Bob Adams"
  let result4 = buildName(undefined, "Adams"); // okay and returns "Will Adams"
  ```

- this
