var calculator = (function () {
    var operators = {
        '-': {
            id: 0,
            prec: 2,
            assoc: 'l',
            fn: function (a, b) {
                return a - b;
            }
        },
        '+': {
            id: 0,
            prec: 2,
            assoc: 'l',
            fn: function (a, b) {
                return a + b;
            }
        },
        '/': {
            id: 1,
            prec: 3,
            assoc: 'l',
            fn: function (a, b) {
                return a / b;
            }
        },
        '*': {
            id: 1,
            prec: 3,
            assoc: 'l',
            fn: function (a, b) {
                return a * b;
            }
        },
        '%': {
            id: 1,
            prec: 3,
            assoc: 'l',
            fn: function (a, b) {
                return a % b;
            }
        },
        '^': {
            id: 1,
            prec: 4,
            assoc: 'r',
            fn: function (a, b) {
                return Math.pow(a, b);
            }
        }
    },
    constants = {
        e: Math.E,
        pi: Math.PI
    };

    function replaceConstants(str) {
        var c, val;
        for (c in constants) {
            str = str.replace(new RegExp('\\b(' + c + ')\\b', 'g'), constants[c]);
        }
        return str;
    }

    function tokenize(str) {
        var tokens = [],
            token = str[0],
            i = 1;

        for (; i < str.length; i += 1) {
            if (token.match(/[\d\.]/) && str[i].match(/[\d\.]/)) {
                token += str[i];
            } else {
                tokens.push(token);
                token = str[i];
            }
        }

        tokens.push(token);
        return tokens;
    }

    function getOperator(name) {
        return operators[name];
    }

    function isNumber(str) {
        return str.match(/\d+/);
    }

    function isOperator(str) {
        return operators[str] !== undefined;
    }

    function parseProgram (str) {
        var t, token, tokens,
            top, o1, o2,
            queue = [],
            stack = [];

        tokens = tokenize(replaceConstants(str.replace(/\s/g, '')));

        for (t in tokens) {
            token = tokens[t];
            if (isNumber(token)) {
                queue.unshift(token);
                continue;
            }

            if (isOperator(token)) {
                top = stack[stack.length-1];
                while (top && isOperator(top)) {
                    o1 = getOperator(token);
                    o2 = getOperator(top);

                    if ((o1.assoc === 'l' && o1.prec === o2.prec) || o1.prec < o2.prec) {
                        queue.unshift(stack.pop());
                    } else {
                        break;
                    }

                    top = stack[stack.length-1];
                }

                stack.push(token);
                continue;
            }

            if (token === '(') {
                stack.push(token);
                continue;
            }

            if (token === ')') {
                top = stack[stack.length-1];
                while (top && top !== '(') {
                    queue.unshift(stack.pop());
                    top = stack[stack.length-1];
                }

                if (!top) {
                    return null;
                }

                stack.pop();
                continue;
            }
        }

        if (stack[0] === '(' || stack[stack.length-1] === ')') {
            return null;
        }

        while (stack.length > 0) {
            queue.unshift(stack.pop());
        }

        return queue.reverse();
    }

    function runProgram(rpn, debugFn) {
        var t, token,
            a, b, op, result,
            stack = [];

        for (t in rpn) {
            token = rpn[t];

            if (isNumber(token)) {
                stack.push(token);
                continue;
            }

            b = parseFloat(stack.pop());
            a = parseFloat(stack.pop());
            op = getOperator(token);

            if (isNaN(b)) {
                b = op.id;
            } else if (isNaN(a)) {
                a = op.id;
            }

            result = op.fn(a, b);
            stack.push(result);

            if (typeof debugFn === 'function') {
                debugFn(token, a, b, result);
            }
        }

        return stack.pop();
    }

    return {
        run: function (program, debugFn) {
            var rpn = parseProgram(program);

            if (rpn === null) {
                return null;
            }

            return runProgram(rpn, debugFn);
        }
    };
}());
