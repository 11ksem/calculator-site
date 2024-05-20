// script.js

// Обработчик нажатия клавиши Enter
function handleEnter(event, callback) {
    if (event.key === 'Enter') {
        event.preventDefault();
        callback();
    }
}

// Функция для замены запятых на точки
function normalizeExpression(expression) {
    return expression.replace(/,/g, '.');
}

// Калькулятор цены иска и государственной пошлины
function calculatePriceAndDuty() {
    const expression = normalizeExpression(document.getElementById('price-input').value);
    try {
        const totalPrice = eval(expression);
        document.getElementById('total-price').innerText = totalPrice.toFixed(2);

        // Расчет государственной пошлины
        let stateDuty = 0;
        if (totalPrice <= 100000) {
            stateDuty = Math.max(2000, totalPrice * 0.04);
        } else if (totalPrice <= 200000) {
            stateDuty = 4000 + (totalPrice - 100000) * 0.03;
        } else if (totalPrice <= 1000000) {
            stateDuty = 7000 + (totalPrice - 200000) * 0.02;
        } else if (totalPrice <= 2000000) {
            stateDuty = 23000 + (totalPrice - 1000000) * 0.01;
        } else {
            stateDuty = 33000 + (totalPrice - 2000000) * 0.005;
            if (stateDuty > 200000) {
                stateDuty = 200000;
            }
        }

        document.getElementById('state-duty').innerText = Math.round(stateDuty);

    } catch (e) {
        alert('Неверное выражение. Пожалуйста, введите корректное математическое выражение.');
    }
}

// Калькулятор госпошлины от размера удовлетворенных требований
function calculateSatisfiedClaims() {
    const expression = normalizeExpression(document.getElementById('satisfied-input').value);
    try {
        const totalSatisfied = eval(expression);
        const totalClaimAmount = parseFloat(document.getElementById('total-price').innerText.replace(/,/g, '.')) || 0;
        const paidStateDuty = parseFloat(document.getElementById('state-duty').innerText.replace(/,/g, '.')) || 0;

        const dutyToBeCollected = totalSatisfied * paidStateDuty / totalClaimAmount;
        const percentSatisfied = (totalSatisfied / totalClaimAmount) * 100;

        document.getElementById('total-satisfied').innerText = totalSatisfied.toFixed(2);
        document.getElementById('duty-to-be-collected').innerText = dutyToBeCollected.toFixed(2);
        document.getElementById('percent-satisfied').innerText = percentSatisfied.toFixed(2);
    } catch (e) {
        alert('Неверное выражение. Пожалуйста, введите корректное математическое выражение.');
    }
}

// Калькулятор размера издержек
function calculateExpenses() {
    const totalExpenses = parseFloat(document.getElementById('expenses').value.replace(/,/g, '.')) || 0;
    const percentSatisfied = parseFloat(document.getElementById('percent-satisfied').innerText.replace(/,/g, '.')) || 0;

    const defendantExpenses = totalExpenses * (percentSatisfied / 100);
    const plaintiffExpenses = totalExpenses - defendantExpenses;

    document.getElementById('defendant-expenses').innerText = defendantExpenses.toFixed(2);
    document.getElementById('plaintiff-expenses').innerText = plaintiffExpenses.toFixed(2);
}

// Добавление обработчиков событий нажатия клавиши Enter для третьего калькулятора
document.getElementById('satisfied-input').addEventListener('keypress', function(event) {
    handleEnter(event, calculateSatisfiedClaims);
});

document.getElementById('price-input').addEventListener('keypress', function(event) {
    handleEnter(event, calculatePriceAndDuty);
});

document.getElementById('expenses').addEventListener('keypress', function(event) {
    handleEnter(event, calculateExpenses);
});
