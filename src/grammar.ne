@{%
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
%}

@lexer filteredLexer

# Main rule - an equation with left and right sides
main -> equation {% id %}
| not_equation {% id %}

equation -> expression %eq expression {%
  function(data) {
    return {
      type: 'equation',
      left: data[0],
      right: data[2]
    };
  }
%}

not_equation -> expression %neq expression {%
  function(data) {
    return {
      type: 'not_equation',
      left: data[0],
      right: data[2]
    };
  }
%}

# Expression with addition and subtraction (lowest precedence)
expression -> expression %plus term {%
  function(data) {
    return {
      type: 'binary_op',
      operator: '+',
      left: data[0],
      right: data[2]
    };
  }
%}
| expression %minus term {%
  function(data) {
    return {
      type: 'binary_op',
      operator: '-',
      left: data[0],
      right: data[2]
    };
  }
%}
| term {% id %}

# Term with multiplication and division (higher precedence)
term -> term %multiply factor {%
  function(data) {
    return {
      type: 'binary_op',
      operator: '*',
      left: data[0],
      right: data[2]
    };
  }
%}
| term %divide factor {%
  function(data) {
    return {
      type: 'binary_op',
      operator: '/',
      left: data[0],
      right: data[2]
    };
  }
%}
| factor {% id %}

# Factor - numbers and parenthesized expressions (highest precedence)
factor -> %number {%
  function(data) {
    return {
      type: 'number',
      value: parseFloat(data[0].value)
    };
  }
%}
| %lparen expression %rparen {%
  function(data) {
    return data[1]; // Return the expression inside parentheses
  }
%}