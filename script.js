document.addEventListener('DOMContentLoaded', function () {
    // Обработка нажатия Enter в текстовых полях для расчета
    function handleEnter(event, callback) {
        if (event.key === 'Enter') {
            event.preventDefault();
            callback();
        }
    }

    // Функция для округления по математическим правилам
    function round(value) {
        return Math.round(value);
    }

    // Калькулятор цены иска
    function calculatePrice() {
        let input = document.getElementById('price-input').value;
        input = input.replace(/,/g, '.');
        try {
            let result = eval(input);
            document.getElementById('total-price').textContent = round(result);
            calculateStateDuty(result); // Рассчитать госпошлину сразу после вычисления суммы иска
        } catch (e) {
            alert('Ошибка в выражении. Пожалуйста, введите правильное выражение.');
        }
    }

    // Калькулятор государственной пошлины
    function calculateStateDuty(claimAmount) {
        let amount = claimAmount || parseFloat(document.getElementById('total-price').textContent);
        let stateDuty = 0;

        if (amount <= 100000) {
            stateDuty = Math.max(amount * 0.04, 2000);
        } else if (amount <= 200000) {
            stateDuty = 4000 + (amount - 100000) * 0.03;
        } else if (amount <= 1000000) {
            stateDuty = 7000 + (amount - 200000) * 0.02;
        } else if (amount <= 2000000) {
            stateDuty = 23000 + (amount - 1000000) * 0.01;
        } else {
            stateDuty = Math.min(33000 + (amount - 2000000) * 0.005, 200000);
        }

        document.getElementById('state-duty').textContent = round(stateDuty);
    }

    // Калькулятор удовлетворенных требований
    function calculateSatisfiedClaims() {
        let input = document.getElementById('satisfied-input').value;
        input = input.replace(/,/g, '.');
        try {
            let result = eval(input);
            let totalPrice = parseFloat(document.getElementById('total-price').textContent);
            let stateDuty = parseFloat(document.getElementById('state-duty').textContent);
            let dutyToBeCollected = result * stateDuty / totalPrice;
            let percentSatisfied = (result / totalPrice) * 100;

            document.getElementById('total-satisfied').textContent = round(result);
            document.getElementById('duty-to-be-collected').textContent = round(dutyToBeCollected);
            document.getElementById('percent-satisfied').textContent = round(percentSatisfied);
        } catch (e) {
            alert('Ошибка в выражении. Пожалуйста, введите правильное выражение.');
        }
    }

    // Калькулятор размера издержек
    function calculateExpenses() {
        let expenses = parseFloat(document.getElementById('expenses').value);
        let percentSatisfied = parseFloat(document.getElementById('percent-satisfied').textContent);
        let defendantExpenses = expenses * (percentSatisfied / 100);
        let plaintiffExpenses = expenses - defendantExpenses;

        document.getElementById('defendant-expenses').textContent = round(defendantExpenses);
        document.getElementById('plaintiff-expenses').textContent = round(plaintiffExpenses);
    }

    document.getElementById('price-input').addEventListener('keypress', function (event) {
        handleEnter(event, calculatePrice);
    });
    document.getElementById('satisfied-input').addEventListener('keypress', function (event) {
        handleEnter(event, calculateSatisfiedClaims);
    });

    // Кнопки расчета
    document.querySelector('#price-calculator button').onclick = calculatePrice;
    document.querySelector('#state-duty-calculator button').onclick = function () {
        calculateStateDuty(parseFloat(document.getElementById('claim-amount').value));
    };
    document.querySelector('#satisfied-claims-calculator button').onclick = calculateSatisfiedClaims;
    document.querySelector('#expenses-calculator button').onclick = calculateExpenses;
});
