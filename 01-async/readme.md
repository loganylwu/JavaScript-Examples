## async.js 运行了一半的时候，可以中断后面的执行么？
- 可以

在async.js的迭代器函数中，可以直接使用`next(new Error('xxxx'))`来直接停止
需要留意，由于使用的是error，那么async.xxx不会返回任何结果，只会抛出错误，

参考：[01-async-break.js](01-async-break.js)


## async.js中使用了`next(error)`停止迭代后，可以获取到`出错之前`的部分数据么?
- 可以

方法：
1. 可以利用闭包特性，在调用前声明`变量a`，在async的迭代函数中，随时更新`变量a`，这样即使出错中断，也可以获取到数据
2. 在`next(new Error('xxx'))`,可以赋值给创建的error，通过error的属性挂载参数来传递数据

参考： [02-async-break-result.js](02-async-break-result.js)

## async.js 在未等待其中一个结束，就反复调用多次，会有什么问题？要如何解决？

- 多个async队列没有执行完，且都会同时执行，会按照执行依次运行，出现`类似于多线程的竟态问题`

解决：
在新队列开始的时候，让上一个队列快速失败
说明：
1. 创建共享变量`startTime`,每次调用前，都更新startTime，同时传递给队列内部。
2. 每一个队列内部利用闭包特性存储参数`myStartTime`，
3. 在每一次callback()迭代器开始运行时，判断`startTime === myStartTime`,若不相等，则直接抛错停下

参考：[03-cancel-by-errors.js](03-cancel-by-errors.js)

## 多次反复调用async.js的迭代，会导致两次调用并行执行么？

会的，会有类似于并发的效果，都不会结束，都会一起运行

参考：[04-multi-call.js](04-multi-call.js)

例如：

```javascript
function start(prefix) {
    async.forEachLimit([1, 2, 3, 4, 5, 6, 7, 8, 9], 2, (item, next) => {
        await(200);
        console.log(`${prefix}-${item}`)
        next();
    })
}

start(`a`);
start(`b`);
start(`c`);
```

上述代码连续调用三次，会出现日志如下：

```text
====发起第1次调用====
发起调用a-1
发起调用a-2
====发起第2次调用====
发起调用b-1
发起调用b-2
====发起第3次调用====
发起调用c-1
发起调用c-2
发起调用a-3
发起调用a-4
```

## async.js运行的时候，是否可以修改并发数量？如何修改？

- 能修改，

直接创建变量limit，随后给limit进行赋值修改，但其实没用，并发量并不会变化。

参考：[05-dynamic-limit.js](05-dynamic-limit.js)

**利用神奇的`proxy`代理可以修改**

### 原理：
async.js中源代码是在位置`async.js 430行`，这里贴出来，可以看到，只要修改能够limit就可以让并发量变化。
```javascript
while (running < limit && !done) {
   var elem = nextElem();
   if (elem === null) {
      done = true;
      if (running <= 0) {
         callback(null);
      }
      return;
   }
   running += 1;
   iteratee(elem.value, elem.key, onlyOnce(iterateeCallback));
}
```
> limit是基本数据类型，是值传递，在外界修改 `limit=10`只会丢失掉这里变量的引用，可以换一个思路改为传递对象`引用传递`

原理：
1. 获取数据本质是调用valueOf()函数返回值
2. 利用`proxy`拦截valueOf属性，然后根据条件篡改返回值
让上一个任务快速结束，随后完成下面操作

参考2：[06-dynamic-limit-success.js](06-dynamic-limit-success.js)
