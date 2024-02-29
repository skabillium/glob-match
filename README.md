# Glob pattern matcher

Lightweight glob pattern matching library.

## Usage

```javascript
import { check } from 'glob-match';

const pattern = '*.js';

check(pattern, 'abcd'); //=> false
check(pattern, 'example.js'); //=> true
check(pattern, 'other.md'); //=> false
```

If you want to perform repeated checks for a given pattern you can also build a matching function

```javascript
import { Checker } from 'glob-match';

const isMatch = Checker('*.[tj]s');

isMatch('one.js'); //=> true
isMatch('two.ts'); //=> true
isMatch('three.csv'); //=> false
```

You can also customise behaviour when encountering an error, by default on a syntax error the `check`
function will throw an error. If that does not fit your use case you it can also return `false`

```javascript
import { check } from 'glob-match';

const invalidPattern = 'main.[abc';

check(invalidPattern, 'main.c'); //=> Error: Unclosed bracket
check(invalidPattern, 'main.c', { onError: 'false' }); //=> false
```
