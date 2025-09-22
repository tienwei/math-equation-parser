// Evaluation method to check if the equations are correct
function evaluateAST(ast) {
  if (!ast) return null;

  
  switch (ast.type) {
    case 'number':
      return ast.value;
    
    case 'binary_op':
      const left = evaluateAST(ast.left);
      const right = evaluateAST(ast.right);
      
      if (left === null || right === null) return null;
      
      switch (ast.operator) {
        case '+':
          return left + right;
        case '-':
          return left - right;
        case '*':
          return left * right;
        case '/':
          if (right === 0) return null; // Division by zero
          return left / right;
        default:
          return null;
      }
    
    case 'equation':
      const leftValue = evaluateAST(ast.left);
      const rightValue = evaluateAST(ast.right);
      
      if (leftValue === null || rightValue === null) return null;
      
      // Check if the equation is correct (with small tolerance for floating point errors)
      return Math.abs(leftValue - rightValue) < 1e-10;
    
    case 'not_equation':
      const leftVal = evaluateAST(ast.left);
      const rightVal = evaluateAST(ast.right);
      if (leftVal === null || rightVal === null) return null;
      
      // Check if the equation is correct (with small tolerance for floating point errors)
      return Math.abs(leftVal - rightVal) > 1e-10;
    
    default:
      return null;
  }
}

// Helper function to format numbers for display
function formatNumber(num) {
  if (num === null || num === undefined) return 'undefined';
  if (typeof num === 'boolean') return num.toString();
  
  // Round to avoid floating point precision issues in display
  if (Math.abs(num - Math.round(num)) < 1e-10) {
    return Math.round(num).toString();
  }
  return parseFloat(num.toFixed(10)).toString();
}

// Function to convert AST back to string representation
function astToString(ast) {
  if (!ast) return '';
  
  switch (ast.type) {
    case 'number':
      return formatNumber(ast.value);
    
    case 'binary_op':
      const left = astToString(ast.left);
      const right = astToString(ast.right);
      
      // Add parentheses for clarity when needed
      const needsParens = (node, parentOp) => {
        if (node.type !== 'binary_op') return false;
        const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };
        return precedence[node.operator] < precedence[parentOp];
      };
      
      const leftStr = needsParens(ast.left, ast.operator) ? `(${left})` : left;
      const rightStr = needsParens(ast.right, ast.operator) ? `(${right})` : right;
      
      return `${leftStr} ${ast.operator} ${rightStr}`;
    
    case 'equation':
      return `${astToString(ast.left)} = ${astToString(ast.right)}`;
    
    default:
      return '';
  }
}

module.exports = {
  evaluateAST,
  formatNumber,
  astToString
};