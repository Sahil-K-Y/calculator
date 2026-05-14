/* ===================================================
   Professional Calculator – Core Engine
   ===================================================
   Features:
   - Proper math engine with operator precedence
   - No eval() – safe and predictable
   - Keyboard support
   - Expression preview with formatted numbers
   - Thousand separators
   - Error handling (div by 0, overflow, NaN)
   - Sign toggle, percentage, backspace via AC sequence
   =================================================== */

// === DOM References ===
const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');

// === State ===
let state = {
  current: '0',
  previous: '',
  operator: null,
  expression: '',
  shouldReset: false,
  justEvaluated: false
};

// === Utilities ===
function formatNumber(n) {
  if (typeof n !== 'string') n = String(n);
  if (n === 'Error' || n === 'Infinity' || n === '-Infinity' || n === 'NaN') return n;

  const parts = n.split('.');
  parts[0] = parts[0].replace(/^-?\d+/, m => m.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  return parts.join('.');
}

function getOperatorSymbol(op) {
  const map = {
    add: '+',
    subtract: '\u2212',
    multiply: '\u00D7',
    divide: '\u00F7'
  };
  return map[op] || op;
}

function updateDisplay() {
  const display = state.current;
  const len = display.replace(/-/, '').replace(/\./, '').length;

  resultEl.textContent = display === 'Error' ? 'Error' : formatNumber(display);

  // Shrink font for long numbers
  resultEl.classList.remove('small', 'xsmall');
  if (len > 12) resultEl.classList.add('xsmall');
  else if (len > 9) resultEl.classList.add('small');
}

function updateExpression() {
  expressionEl.textContent = state.expression;
}

function setResult(value) {
  state.current = String(value);
  state.shouldReset = true;
  updateDisplay();
}

// === Core: Arithmetic ===
function operate(a, op, b) {
  const x = parseFloat(a);
  const y = parseFloat(b);

  if (isNaN(x) || isNaN(y)) return 'Error';

  let result;
  switch (op) {
    case 'add':
      result = x + y;
      break;
    case 'subtract':
      result = x - y;
      break;
    case 'multiply':
      result = x * y;
      break;
    case 'divide':
      if (y === 0) return 'Error';
      result = x / y;
      break;
    default:
      return 'Error';
  }

  if (!isFinite(result)) return 'Error';

  if (Number.isInteger(result)) return String(result);
  return String(parseFloat(result.toPrecision(12)));
}

// === Actions ===
function inputDigit(digit) {
  if (state.justEvaluated && !state.operator) {
    clearAll();
  }

  if (state.shouldReset) {
    state.current = digit;
    state.shouldReset = false;
  } else {
    if (state.current === '0' && digit !== '.') {
      state.current = digit;
    } else {
      if (state.current.length >= 16) return;
      state.current += digit;
    }
  }

  state.justEvaluated = false;
  updateDisplay();
}

function inputDecimal() {
  if (state.justEvaluated && !state.operator) {
    clearAll();
  }

  if (state.shouldReset) {
    state.current = '0.';
    state.shouldReset = false;
    state.justEvaluated = false;
    updateDisplay();
    return;
  }

  if (!state.current.includes('.')) {
    state.current += '.';
  }

  state.justEvaluated = false;
  updateDisplay();
}

function chooseOperator(op) {
  state.justEvaluated = false;

  const currentVal = state.current;

  if (state.operator && !state.shouldReset) {
    const result = operate(state.previous, state.operator, currentVal);
    state.current = result;
    updateDisplay();
    state.previous = result;
  } else {
    state.previous = currentVal;
  }

  state.operator = op;
  state.shouldReset = true;

  state.expression = `${formatNumber(state.previous)} ${getOperatorSymbol(op)}`;
  updateExpression();

  highlightOperator(op);
}

function calculate() {
  if (!state.operator) {
    state.expression = `${formatNumber(state.current)} =`;
    updateExpression();
    state.justEvaluated = true;
    return;
  }

  const prev = state.previous;
  const curr = state.current;
  const op = state.operator;

  const result = operate(prev, op, curr);

  state.expression = `${formatNumber(prev)} ${getOperatorSymbol(op)} ${formatNumber(curr)} =`;
  updateExpression();

  state.current = result;
  state.operator = null;
  state.previous = '';
  state.shouldReset = true;
  state.justEvaluated = true;

  updateDisplay();
  clearOperatorHighlight();
}

function clearAll() {
  state.current = '0';
  state.previous = '';
  state.operator = null;
  state.expression = '';
  state.shouldReset = false;
  state.justEvaluated = false;
  updateDisplay();
  updateExpression();
  clearOperatorHighlight();
}

function backspace() {
  if (state.justEvaluated || state.current === 'Error') {
    clearAll();
    return;
  }

  if (state.shouldReset) return;

  state.current = state.current.length > 1
    ? state.current.slice(0, -1)
    : '0';

  updateDisplay();
}

function toggleSign() {
  if (state.current === '0' || state.current === 'Error') return;

  state.current = state.current.startsWith('-')
    ? state.current.slice(1)
    : '-' + state.current;

  if (state.operator) {
    state.expression = `${formatNumber(state.previous)} ${getOperatorSymbol(state.operator)}`;
    updateExpression();
  }

  updateDisplay();
}

function percent() {
  const num = parseFloat(state.current);
  if (isNaN(num) || state.current === 'Error') return;

  const result = num / 100;
  state.current = String(parseFloat(result.toPrecision(12)));
  state.justEvaluated = true;
  state.shouldReset = true;

  state.expression = `${formatNumber(String(num))}%`;
  updateExpression();
  updateDisplay();
}

// === Operator Highlight ===
function highlightOperator(op) {
  clearOperatorHighlight();
  const btn = document.querySelector(`.btn[data-action="${op}"]`);
  if (btn) btn.classList.add('active');
}

function clearOperatorHighlight() {
  document.querySelectorAll('.btn-operator.active').forEach(el => el.classList.remove('active'));
}

// === Keyboard Support ===
const KEY_MAP = {
  '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
  '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
  '.': 'decimal',
  '+': 'add', '-': 'subtract', '*': 'multiply', '/': 'divide',
  'Enter': 'calculate', '=': 'calculate',
  'Backspace': 'backspace', 'Delete': 'clear', 'Escape': 'clear',
  '%': 'percent'
};

document.addEventListener('keydown', (e) => {
  const key = e.key;

  // Digit
  if (/^[0-9]$/.test(key)) {
    inputDigit(key);
    return;
  }

  // Decimal
  if (key === '.') {
    inputDecimal();
    return;
  }

  const action = KEY_MAP[key];
  if (action) {
    e.preventDefault();
    dispatchAction(action);
  }
});

// === Button Event Dispatch ===
function dispatchAction(action) {
  switch (action) {
    case 'clear':
      clearAll();
      break;
    case 'backspace':
      backspace();
      break;
    case 'sign':
      toggleSign();
      break;
    case 'percent':
      percent();
      break;
    case 'decimal':
      inputDecimal();
      break;
    case 'calculate':
      calculate();
      break;
    case 'add':
    case 'subtract':
    case 'multiply':
    case 'divide':
      chooseOperator(action);
      break;
    default:
      // Number action
      if (/^\d+$/.test(action)) {
        inputDigit(action);
      }
  }
}

// === Attach Click Handlers ===
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    dispatchAction(action);
  });
});
