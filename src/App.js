import React, { useState } from 'react';
import './App.css';
import { parseEquation } from './parser';
import { evaluateAST, astToString } from './evaluator';

function App() {
  const [input, setInput] = useState('');
  const [ast, setAst] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const parseAndEvaluate = () => {
    if (!input.trim()) {
      setError('Please enter an equation');
      setAst(null);
      setResult(null);
      return;
    }

    try {
      // Parse the equation
      const parsedAst = parseEquation(input);
      setAst(parsedAst);
      
      // Evaluate the equation
      const evaluationResult = evaluateAST(parsedAst);
      setResult(evaluationResult);
      setError('');
    } catch (err) {
      setError(err.message);
      setAst(null);
      setResult(null);
    }
  };

  const renderAST = (node, depth = 0) => {
    if (!node) return null;

    const indent = '  '.repeat(depth);
    
    switch (node.type) {
      case 'equation':
        return (
          <div key={depth}>
            <div>{indent}Equation(=):</div>
            <div>{indent}  Left:</div>
            {renderAST(node.left, depth + 2)}
            <div>{indent}  Right:</div>
            {renderAST(node.right, depth + 2)}
          </div>
        );

       case 'not_equation':
        return (
          <div key={depth}>
            <div>{indent}📊 Not Equation(!=):</div>
            <div>{indent}  Left:</div>
            {renderAST(node.left, depth + 2)}
            <div>{indent}  Right:</div>
            {renderAST(node.right, depth + 2)}
          </div>
        );
      
      case 'binary_op':
        return (
          <div key={depth}>
            <div>{indent}🔢 Operation: {node.operator}</div>
            <div>{indent}  Left:</div>
            {renderAST(node.left, depth + 2)}
            <div>{indent}  Right:</div>
            {renderAST(node.right, depth + 2)}
          </div>
        );
      
      case 'number':
        return (
          <div key={depth}>
            <div>{indent}🔢 Number: {node.value}</div>
          </div>
        );
      
      default:
        return <div key={depth}>{indent}Unknown node type: {node.type}</div>;
    }
  };

  const getResultDisplay = () => {
    if (result === null) return 'No result';
    if (typeof result === 'boolean') {
      return result ? '✅ True (Equation is correct!)' : '❌ False (Equation is incorrect)';
    }
    return result.toString();
  };

  const getExampleEquations = () => [
    '6 = (10/2) + 1',
    '(4 - 3) * 2 = 2',
    '2 + 3 * 4 = 14',
    '(2 + 3) * 4 = 20',
    '10 / 2 = 5',
    '7 - 3 + 1 = 5'
  ];

  return (
    <div className="App">
      <header className="App-header">
        <h1>Math Equation Parser</h1>
        <p>Enter a mathematical equation to parse and evaluate</p>
      </header>

      <main className="App-main">
        <div className="input-section">
          <div className="input-group">
            <label htmlFor="equation-input">Mathematical Equation:</label>
            <input
              id="equation-input"
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="e.g., 2 + 3 * 4 = 14"
              className="equation-input"
            />
            <button onClick={parseAndEvaluate} className="parse-button">
              Parse & Evaluate
            </button>
          </div>

          <div className="examples">
            <h3>Example Equations:</h3>
            <div className="example-buttons">
              {getExampleEquations().map((example, index) => (
                <button
                  key={index}
                  onClick={() => setInput(example)}
                  className="example-button"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="error-section">
            <h3>❌ Error:</h3>
            <pre className="error-message">{error}</pre>
          </div>
        )}

        {ast && (
          <div className="ast-section">
            <h3>🌳 Abstract Syntax Tree (AST):</h3>
            <div className="ast-display">
              {renderAST(ast)}
            </div>
            <div className="ast-string">
              <strong>Parsed equation:</strong> {astToString(ast)}
            </div>
          </div>
        )}

        {result !== null && (
          <div className="result-section">
            <h3>📊 Evaluation Result:</h3>
            <div className="result-display">
              {getResultDisplay()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;