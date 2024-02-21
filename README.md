# Glob pattern matcher

Lightweight glob pattern matching library.

## Usage

```javascript
import { check } from 'glob-match';

const pattern = '*.js';

console.log(check(pattern, 'abcd')); //=> false
console.log(check(pattern, 'example.js')); //=> true
console.log(check(pattern, 'other.md')); //=> false
```

If you want to perform repeated checks for a given pattern you can also build a matching function

```javascript
import { Checker } from 'glob-match';

const isMatch = Checker('*.[tj]s');

console.log(isMatch('one.js')); //=> true
console.log(isMatch('two.ts')); //=> true
console.log(isMatch('three.csv')); //=> false
```

You can also customise behaviour when encountering an error, by default on a syntax error the `check`
function will throw an error. If that does not fit your use case you it can also return `false`

```javascript
import { check } from 'glob-match';

const invalidPattern = 'main.[abc';

console.log(check(invalidPattern, 'main.c')); //=> Error
console.log(check(invalidPattern, 'main.c', { onError: 'false' })); //=> false
```
