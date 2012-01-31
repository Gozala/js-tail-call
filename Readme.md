# tail-call

[![Build Status](https://secure.travis-ci.org/Gozala/js-tail-call.png)](http://travis-ci.org/Gozala/js-tail-call)


Unfortunately does not has [tail call] optimization (a.k.a tail recursion),
technique often used in functional languages. Recursions usually are way more
expressive than imperative loops for iterative calculations and they helps
avoid side-effects.

Unfortunately though lack of tail call optimization in JS makes it impossible
to perform significant calculations in recursive style. Here is example
demonstrating [stack overflow]:


```js
var sum = function(x, y) {
  return y > 0 ? sum(x + 1, y - 1) :
         y < 0 ? sum(x - 1, y + 1) :
         x
}

sum(20, 100000) // => RangeError: Maximum call stack size exceeded
```

This module is provides a solution to overcome this limitation through
trampolining. It's more or less a polifill for [proper tail calls] coming
in [ES.next]. API is simple, it just requires wrapping of tali recursive
function:

```js
var recur = require('tail-call').recur
var sum = recur(function(x, y) {
  return y > 0 ? sum(x + 1, y - 1) :
         y < 0 ? sum(x - 1, y + 1) :
         x
})

sum(20, 100000) // => 100020
```

Be aware though that this will be way slower than imperative loops. There are
even [numbers][jsperf] from [@jdalton].

Finally keep in mind that `recur` returns function that is not side-effect free
and there for should be used with a great care. More precisly it should not be
called from anywhere else other then itself during tail recursion. For example
following code will misbehave:

```js
var foo = recur(function(x, y) {
  // ....
  bar(x, y)
  // ...
})

var bar = function(x, y) {
  // ...
  foo(x + 1, y - 1)
  // ...
}
```

Don't worry, bar still can call `foo` but it in slightly different manner:

```js
function f(x, y) {
  // ....
  bar(x, y)
  // ...
}

var foo = recur(f)

var bar = function(x, y) {
  // ...
  recur(f)(x + 1, y - 1)
  // ...
}
```

## Install

    npm install tail-call

[Tail call]:http://en.wikipedia.org/wiki/Tail_call
[stack overflow]:http://en.wikipedia.org/wiki/Stack_overflow
[proper tail calls]:http://wiki.ecmascript.org/doku.php?id=harmony:proper_tail_calls
[ES.next]:http://wiki.ecmascript.org/doku.php?id=harmony:harmony
[@jdalton]:https://github.com/jdalton
[jsperf]:http://jsperf.com/tco#chart=bar
