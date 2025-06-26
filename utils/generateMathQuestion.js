function safeEval(expr) {
  const regex = /^[0-9+\-*/. ()]+$/;
  if (!regex.test(expr)) throw new Error('Invalid characters in expression');
  try {
    return new Function(`return ${expr}`)();
  } catch {
    return 0;
  }
}

function generateMathQuestion(difficulty) {
  const digits = difficulty;
  const operandsCount = difficulty + 1;
  const operators = ['+', '-', '*', '/'];

  const numbers = Array.from({ length: operandsCount }, () =>
    Math.floor(Math.random() * Math.pow(10, digits))
  );

  const ops = Array.from({ length: operandsCount - 1 }, () =>
    operators[Math.floor(Math.random() * operators.length)]
  );

  const question = numbers.map((n, i) =>
    i < ops.length ? `${n} ${ops[i]}` : `${n}`
  ).join(' ');

  let answer;
  try {
    answer = safeEval(question);
  } catch (e) {
    answer = 0;
  }

  return { question, answer: Number(answer.toFixed(2)) };
}

module.exports = { generateMathQuestion };
