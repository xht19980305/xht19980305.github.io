// 发布者
class Publish {
  constructor() {
    let i = 0;
    this.limit = 10;
    this._id = setInterval(() => this.emit(i++), 1000);
  }

  emit(n) {
    if (this.onNext) {
      this.onNext(n);
    }
    if (n === this.limit) {
      if (this.oncomplete) {
        this.onComplete();
      }
      this.destroy();
    }
  }

  destroy() {
    clearInterval(this._id);
  }
}

// 我们的 Observable
function MyObservable(observer) {
  const publish = new Publish();
  publish.onNext = e => observer.next(e);
  publish.onError = e => observer.error(err);
  publish.onComplete = () => observer.complete();
  return () => {
    publish.destroy();
  };
}

// 观察者
const myObserver = {
  next(x) {
    console.log(x);
  },
  error(err) {
    console.error(err);
  },
  complete() {
    console.log("done");
  }
};

// 订阅
const subscription = MyObservable(myObserver);

setTimeout(subscription, 8500);

// map的实现
function myMap(observer, fn) {
  return new MyObservable(
    (o => {
      const mapObserver = {
        next: x => o.next(fn(x)),
        error: err => o.error(err),
        complete: () => o.complete()
      };
      return mapObserver;
    })(observer)
  );
}

myMap(myObserver, x => "map value: " + x * 2);

// todo 如何实现链式操作 MyObservable(myObserver).map(x => "map value: " + x * 2)
