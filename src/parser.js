const nearley = require('nearley');

// This will be updated once grammar.js is compiled
let grammar;

try {
  grammar = require('./grammar.js');
} catch (error) {
  console.warn('Grammar not compiled yet. Run: npx nearleyc src/grammar.ne -o src/grammar.js');
}

function parseEquation(input) {
  if (!grammar) {
    throw new Error('Grammar not loaded. Please compile grammar.ne first.');
  }

  try {
    // Create a new parser instance
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    
    // Feed the input string directly to the parser
    // The grammar's lexer will handle tokenization and whitespace filtering
    parser.feed(input);
    
    // Get the results
    const results = parser.results;
    
    if (results.length === 0) {
      throw new Error('No valid parse found - the input does not match the expected equation format');
    }
    
    if (results.length > 1) {
      console.warn('Ambiguous grammar - multiple parses found');
    }
    
    return results[0];
  } catch (error) {
    // Enhanced error handling with location information
    if (error.message && error.message.includes('Syntax error')) {
      // Extract line and column information from nearley error
      const match = error.message.match(/line (\d+) col (\d+):/);
      if (match) {
        const line = parseInt(match[1]);
        const col = parseInt(match[2]);
        const lines = input.split('\n');
        const errorLine = lines[line - 1] || input;
        
        // Create a visual pointer to the error location
        const pointer = ' '.repeat(col - 1) + '^';
        
        throw new Error(
          `Parse error at position ${col} in input:\n` +
          `"${errorLine}"\n` +
          ` ${pointer}\n` +
          `${error.message.split('\n').slice(1).join('\n')}`
        );
      }
    }
    
    // Handle lexer errors or other parsing issues
    if (error.message && error.message.includes('lexer error')) {
      throw new Error(
        `Invalid input: The equation contains characters or patterns that are not recognized.\n` +
        `Input: "${input}"\n` +
        `Please check for:\n` +
        `- Invalid characters (only numbers, +, -, *, /, =, and parentheses are allowed)\n` +
        `- Missing operators between numbers\n` +
        `- Unmatched parentheses\n` +
        `- Missing equals sign (=) in the equation`
      );
    }
    
    // Generic error fallback
    throw new Error(`Parse error: ${error.message}\nInput: "${input}"`);
  }
}

module.exports = {
  parseEquation
};