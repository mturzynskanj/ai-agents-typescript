// let globalValue

// let add = (function () {
//   let mytest = []
//   mytest[mytest.length] = () => {
//     globalValue = db.value
//   }
//   let db = {
//     value: 0,
//     addValue: (v) => db.value + v,
//   }
//   return function (myValue) {
//     console.log("db before callback", db.value)
//     db.value = db.addValue(myValue)
//     console.log("db after callback", db.value)
//     console.log("what is push", mytest.push)
//     mytest.push()
//   }
// })()

// add(10)
// console.log("globalValue", globalValue)

// function fib(n) {
//   console.log("inside fib", n)
//   if (n <= 1) {
//     return n
//   }

//   return fib(n - 1) + fib(n - 2)
// }

// let fib4 = fib(10)

// console.log("fib4", fib4)

var countNumOfFib = function () {
  var counter = 0
  var calls = []
  function fib(n) {
    counter++
    console.log("inside fib", n, counter)
    calls.push(n)
    if (n <= 1) {
      return n
    }

    return fib(n - 1) + fib(n - 2)
  }

  return {
    fib,
    getCount: () => counter,
    getCalls: () => calls,
  }
}

let f = countNumOfFib()
f.fib(10)
console.log("count", f.getCount())
console.log("calls", f.getCalls())

const fibWithMemo = function (memo, func) {
  var counter = 0

  const recur = function (n) {
    counter++
    console.log("with memoCounter:", counter)
    if (memo[n] !== undefined) {
      return memo[n]
    }
    memo[n] = func(recur, n)

    return memo[n]
  }

  return recur
}

let withMemo = fibWithMemo([0, 1], function (recur, n) {
  return recur(n - 1) + recur(n - 2)
})

console.log("withMemo", withMemo(10))

/// decorator pater
///

const withLogging = function (func) {
  return function (...args) {
    console.log("calling with args", args)
    const result = func(...args)
    console.log("result is", result)
    return result
  }
}

function add(...args) {
  return args.reduce((acc, curr) => acc + curr, 0)
}

const addWithLogging = withLogging(add)

addWithLogging(4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20)

// function withMemo(fn) {
//   const map = new Map()
//   return function (n) {
//     if (map.has(n)) {
//        console.log('getting value from cache))
//        return map.get(n)
//     }
//     let result = fn(n)
//     map.set(n, result)
//     return result
//   }
// }

const withLoggingAndCache = function (func) {
  const cache = new Map()
  return function (...args) {
    console.log("calling with args", args)
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      console.log("getting value from cache")
      return cache.get(key)
    }
    const result = func(...args)
    console.log("result is ", result)
    cache.set(key, result)
    return result
  }
}

let add2 = withLoggingAndCache(add)
add2(5, 6)
add2(5, 6)
add2(9, 10)

console.log("**************************************")

var bar = { bar: "global baz" }

function x() {
  console.log("what is this", this)
  console.log(this)
}

let foo = { bar: "baz" }

x.call(null, 1, 2, 3)
