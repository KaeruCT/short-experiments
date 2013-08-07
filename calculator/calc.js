var calculator = (function () {
    var operators = {
        '-': {
            fn: function (a, b) {
                return parseFloat(a) - parseFloat(b);
            }
        },
        '+': {
            fn: function (a, b) {
                return parseFloat(a) + parseFloat(b);
            }
        },
        '/': {
            fn: function (a, b) {
                return parseFloat(a) / parseFloat(b);
            }
        },
        '*': {
            fn: function (a, b) {
                return parseFloat(a) * parseFloat(b);
            }
        },
        '%': {
            fn: function (a, b) {
                return parseFloat(a) % parseFloat(b);
            }
        },
        '^': {
            fn: function (a, b) {
                return Math.pow(parseFloat(a), parseFloat(b));
            }
        }
    },
    constants = {
        e: Math.E,
        pi: Math.PI
    };

    function parseProgram (program) {
        function replaceConstants(program) {
            var c, val;
            for (c in constants) {
                program = program.replace(new RegExp('\\b(' + c + ')\\b', 'g'), constants[c]);
            }
            return program;
        }

        function matchOperator(token) {
            var i, op,
                len = token.length;

            for (op in operators) {
                for (i = 0; i < len; i += 1) {

                    if (token.charAt(i) === '(') {
                        return -2;
                    }

                    if (token.charAt(i) === op) {
                        return i;
                    }
                }
            }
            return -1;
        }

        function parseTokens(token) {
            function parens(token) {
                var i = 0, pcount = 0, j, char,
                    len = token.length;

                for (; i < len; i += 1) {
                    char = token.charAt(i);

                    if (char === '(') {
                        for (j = i; j < len; j += 1) {
                            char = token.charAt(j);
                            if (char === '(') pcount += 1;
                            if (char === ')') pcount -= 1;

                            if (j > i && pcount === 0) {
                                return token.substr(i + 1, j - i - 1);
                            }
                        }
                    }
                }
                return token;
            }

            function parse(token) {
                var ptoken, olen = 1,
                    i, a, b, operator;

                if (typeof token === "object") {
                    return token;
                }

                i = matchOperator(token);

                if (i === -2) {
                    ptoken = parens(token);
                    a = parse(ptoken);

                    token = token.substr(ptoken.length + 1);
                    i = matchOperator(token);

                    if (i == -1) {
                        return a;
                    }
                } else {
                    if (i === -1) {
                        return token;
                    }

                    a = token.substr(0, i);
                }

                operator = token.substr(i, olen);
                b = token.substr(i + olen);
                return {
                    operator: operator,
                    a: parse(a),
                    b: parse(b)
                };
            }
            return parse(token);
        }

        program = replaceConstants(program);
        return parseTokens(program);
    }

    function runProgram(tokens, debugFn) {
        function runToken(token) {
            var operator, a, b, result;
            if (typeof token === "string") {
                return token;
            }

            a = runToken(token.a);
            b = runToken(token.b);
            operator = operators[token.operator];
            result = operator.fn(a, b);

            if (typeof debugFn === "function") {
                debugFn(token.operator, a, b, result);
            }

            return result;
        }

        return runToken(tokens);
    }

    return {
        run: function (program, debugFn) {
            var tokens = parseProgram(program);
            return runProgram(tokens, debugFn);
        }
    };
}());
