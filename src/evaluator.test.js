import { parseEquation } from './parser';
import { evaluateAST } from './evaluator';

const parseAndEvaluateAssert = (outcome) => (input) => {
  const parsedAst = parseEquation(input);
  const evaluationResult = evaluateAST(parsedAst);
  expect(evaluationResult).toBe(outcome);
};

describe('evaluator', () => {
  describe('with valid cases', () => {
    const testCasesOutcomeTrue = [
      '1 + 2 = 3',
      '2 * 3 + 4 = 10',
      '6 = 10 / 2 + 1',
      '12 + 3 != 4 / 2 + 5',
      '11 = 11', // additional
      '11 != 16', // additional
      '2.5 + 1.5 = 4', // additional
      '3.14 * 2 = 6.28', // additional
    ];
    const testCasesOutcomeFalse = [
      '2 * (3 + 4) = 10',
      '2 + 3 * 2 = 10',
      '2 * 3 + 4 != 10',
      '3 != 3', // additional
    ];

    testCasesOutcomeTrue.forEach((input) => {
      it(`should return true with input: ${input}`, () => {
        const parseAndEvaluateValid = parseAndEvaluateAssert(true);
        parseAndEvaluateValid(input);
      });
    });

    testCasesOutcomeFalse.forEach((input) => {
      it(`should return true with input: ${input}`, () => {
        const parseAndEvaluateValid = parseAndEvaluateAssert(false);
        parseAndEvaluateValid(input);
      });
    });
  });
  describe('with invalid cases', () => {
    const invalidTestCases = [
      '1 + (2 = 3',
      '2 + 3', // Missing equals sign
      '2 + = 5', // Missing operand
      '2 + 3 = ', // Missing right side
      '2 + 3 = 5 +', // Incomplete expression
      '(2 + 3 = 5', // Unmatched parentheses
      '2 + 3) = 5', // Unmatched closing parenthesis
      '2 ++ 3 = 5', // Double operator
      '2 3 = 5', // Missing operator
      'abc = 5', // Invalid characters
      '2 + 3 = 5 = 6', // Multiple equals signs
      '', // Empty input
      '   ', // Only whitespace
    ];
    invalidTestCases.forEach((input) => {
      it(`should throw a parse error with input: ${input}`, () => {
        expect(() => parseEquation(input)).toThrow();
      });
    });
  });
});
