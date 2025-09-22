// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require('moo');

const lexer = moo.compile({
  WS: { match: /[ \t]+/, lineBreaks: false },
  number: /[0-9]+(?:\.[0-9]+)?/,
  plus: '+',
  minus: '-',
  multiply: '*',
  divide: '/',
  lparen: '(',
  rparen: ')',
  eq: '=',
  neq: '!=',
  NL: { match: /\n/, lineBreaks: true }
});

// Custom lexer that filters out whitespace
const filteredLexer = {
  ...lexer,
  next: function() {
    let token;
    do {
      token = lexer.next();
    } while (token && token.type === 'WS');
    return token;
  },
  reset: function(chunk, info) {
    return lexer.reset(chunk, info);
  },
  save: function(tokenType) {
    return lexer.save(tokenType);
  },
  has: function(tokenType) {
    return lexer.has(tokenType);
  },
  formatError: function(token, message) {
    return lexer.formatError ? lexer.formatError(token, message) : message;
  }
};
var grammar = {
    Lexer: filteredLexer,
    ParserRules: [
    {"name": "main", "symbols": ["equation"], "postprocess": id},
    {"name": "main", "symbols": ["not_equation"], "postprocess": id},
    {"name": "equation", "symbols": ["expression", (filteredLexer.has("eq") ? {type: "eq"} : eq), "expression"], "postprocess": 
        function(data) {
          return {
            type: 'equation',
            left: data[0],
            right: data[2]
          };
        }
        },
    {"name": "not_equation", "symbols": ["expression", (filteredLexer.has("neq") ? {type: "neq"} : neq), "expression"], "postprocess": 
        function(data) {
          return {
            type: 'not_equation',
            left: data[0],
            right: data[2]
          };
        }
        },
    {"name": "expression", "symbols": ["expression", (filteredLexer.has("plus") ? {type: "plus"} : plus), "term"], "postprocess": 
        function(data) {
          return {
            type: 'binary_op',
            operator: '+',
            left: data[0],
            right: data[2]
          };
        }
        },
    {"name": "expression", "symbols": ["expression", (filteredLexer.has("minus") ? {type: "minus"} : minus), "term"], "postprocess": 
        function(data) {
          return {
            type: 'binary_op',
            operator: '-',
            left: data[0],
            right: data[2]
          };
        }
        },
    {"name": "expression", "symbols": ["term"], "postprocess": id},
    {"name": "term", "symbols": ["term", (filteredLexer.has("multiply") ? {type: "multiply"} : multiply), "factor"], "postprocess": 
        function(data) {
          return {
            type: 'binary_op',
            operator: '*',
            left: data[0],
            right: data[2]
          };
        }
        },
    {"name": "term", "symbols": ["term", (filteredLexer.has("divide") ? {type: "divide"} : divide), "factor"], "postprocess": 
        function(data) {
          return {
            type: 'binary_op',
            operator: '/',
            left: data[0],
            right: data[2]
          };
        }
        },
    {"name": "term", "symbols": ["factor"], "postprocess": id},
    {"name": "factor", "symbols": [(filteredLexer.has("number") ? {type: "number"} : number)], "postprocess": 
        function(data) {
          return {
            type: 'number',
            value: parseFloat(data[0].value)
          };
        }
        },
    {"name": "factor", "symbols": [(filteredLexer.has("lparen") ? {type: "lparen"} : lparen), "expression", (filteredLexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": 
        function(data) {
          return data[1]; // Return the expression inside parentheses
        }
        }
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
