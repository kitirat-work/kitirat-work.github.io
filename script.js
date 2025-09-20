let display = document.getElementById('result');
let currentInput = '';
let operator = '';
let previousInput = '';

function appendToDisplay(value) {
    if (value === '.' && currentInput.includes('.')) {
        return; // Prevent multiple decimal points
    }
    
    if (['+', '-', '*', '/'].includes(value)) {
        if (currentInput === '' && previousInput === '') {
            return; // Prevent operator as first input
        }
        
        if (currentInput === '' && previousInput !== '') {
            operator = value;
            display.value = previousInput + ' ' + value + ' ';
            return;
        }
        
        if (previousInput !== '' && currentInput !== '' && operator !== '') {
            calculate();
        }
        
        operator = value;
        previousInput = currentInput;
        currentInput = '';
        display.value = previousInput + ' ' + value + ' ';
    } else {
        currentInput += value;
        if (operator && previousInput) {
            display.value = previousInput + ' ' + operator + ' ' + currentInput;
        } else {
            display.value = currentInput;
        }
    }
}

function calculate() {
    if (previousInput === '' || currentInput === '' || operator === '') {
        return;
    }
    
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(current)) {
        display.value = 'Error';
        return;
    }
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                display.value = 'Error: Division by zero';
                resetCalculator();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    // Round to prevent floating point precision issues
    result = Math.round(result * 100000000) / 100000000;
    
    display.value = result;
    currentInput = result.toString();
    operator = '';
    previousInput = '';
}

function clearDisplay() {
    display.value = '';
    currentInput = '';
    operator = '';
    previousInput = '';
}

function deleteLast() {
    if (currentInput !== '') {
        currentInput = currentInput.slice(0, -1);
        if (operator && previousInput) {
            display.value = previousInput + ' ' + operator + ' ' + currentInput;
        } else {
            display.value = currentInput;
        }
    } else if (operator !== '') {
        operator = '';
        currentInput = previousInput;
        previousInput = '';
        display.value = currentInput;
    }
}

function resetCalculator() {
    setTimeout(() => {
        clearDisplay();
    }, 2000);
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9' || key === '.') {
        appendToDisplay(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendToDisplay(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
    } else if (key === 'Backspace') {
        event.preventDefault();
        deleteLast();
    }
});

// Prevent default behavior for certain keys
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
    }
});
