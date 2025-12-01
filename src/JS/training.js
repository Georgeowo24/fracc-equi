document.addEventListener('DOMContentLoaded', () => {
    const scoreElement = document.getElementById('score-count');
    const numLeftEl = document.getElementById('num-left');
    const denLeftEl = document.getElementById('den-left');
    const numInput = document.getElementById('num-input');
    const denInput = document.getElementById('den-input');
    const btnCheck = document.getElementById('btn-check');
    const feedbackEl = document.getElementById('feedback');

    let score = parseInt(localStorage.getItem('fraccionesScore')) || 0;

    scoreElement.textContent = score;

    function generateRandomFraction() {
        let num, den;

        do {
            num = Math.floor(Math.random() * 9) + 1;
            den = Math.floor(Math.random() * 9) + 1;
        } while (num >= den); 

        return { num, den };
    }

    function drawPieChart(containerId, numerator, denominator, filledColor = '#3f51b5') {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        if (denominator <= 0) denominator = 1;
        if (numerator < 0) numerator = 0;
        if (numerator > denominator) numerator = denominator;

        const size = 100;
        const center = size / 2;
        const radius = size / 2;

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.transform = "rotate(-90deg)";

        const bgCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        bgCircle.setAttribute("cx", center);
        bgCircle.setAttribute("cy", center);
        bgCircle.setAttribute("r", radius);
        bgCircle.setAttribute("fill", "#d1d5db");
        svg.appendChild(bgCircle);

        if (numerator > 0) {
            const percentage = numerator / denominator;
            const endAngle = percentage * Math.PI * 2;
            const endX = center + radius * Math.cos(endAngle);
            const endY = center + radius * Math.sin(endAngle);
            const largeArcFlag = percentage > 0.5 ? 1 : 0;

            if (percentage >= 1) {
                const fullCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                fullCircle.setAttribute("cx", center);
                fullCircle.setAttribute("cy", center);
                fullCircle.setAttribute("r", radius);
                fullCircle.setAttribute("fill", filledColor);
                svg.appendChild(fullCircle);
            } else {
                const filledPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
                const pathData = `
                    M ${center} ${center}
                    L ${center + radius} ${center}
                    A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
                    Z`;

                filledPath.setAttribute("d", pathData);
                filledPath.setAttribute("fill", filledColor);
                svg.appendChild(filledPath);
            }
        }

        if (denominator > 1) {
            for (let i = 0; i < denominator; i++) {
                const angle = (i / denominator) * Math.PI * 2;
                const lineX = center + radius * Math.cos(angle);
                const lineY = center + radius * Math.sin(angle);

                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", center);
                line.setAttribute("y1", center);
                line.setAttribute("x2", lineX);
                line.setAttribute("y2", lineY);
                line.setAttribute("stroke", "#ffffff");
                line.setAttribute("stroke-width", "2");
                svg.appendChild(line);
            }
        }

        container.appendChild(svg);
    }

    function generateProblem() {
        feedbackEl.textContent = '';
        feedbackEl.className = 'feedback-message';

        const base = generateRandomFraction();

        numLeftEl.textContent = base.num;
        denLeftEl.textContent = base.den;

        drawPieChart('chart-left', base.num, base.den);

        // limpiar inputs
        numInput.value = '';
        denInput.value = '';

        drawPieChart('chart-right', 0, 1);
    }

    function checkAnswer() {
        const userNum = parseInt(numInput.value);
        const userDen = parseInt(denInput.value);

        // VALIDACIÓN NUEVA: no permitir 0
        if (userNum === 0 || userDen === 0) {
            feedbackEl.textContent = "No puedes poner 0 en numerador o denominador.";
            feedbackEl.className = "feedback-message error";
            return;
        }

        if (isNaN(userNum) || isNaN(userDen)) {
            feedbackEl.textContent = "Por favor, introduce números válidos.";
            feedbackEl.className = "feedback-message error";
            return;
        }

        const baseNum = parseInt(numLeftEl.textContent);
        const baseDen = parseInt(denLeftEl.textContent);

        const isEquivalent = userNum * baseDen === userDen * baseNum;
        const isNotSame = !(userNum === baseNum && userDen === baseDen);

        if (isEquivalent && isNotSame) {
            feedbackEl.textContent = "¡Correcto!";
            feedbackEl.className = "feedback-message success";
            score++;
            scoreElement.textContent = score;
            localStorage.setItem('fraccionesScore', score);

            setTimeout(generateProblem, 1200);
        } else {
            feedbackEl.textContent = "Incorrecto. Intenta de nuevo.";
            feedbackEl.className = "feedback-message error";

            // RESETEAR PUNTOS
            score = 0;
            scoreElement.textContent = 0;
            localStorage.setItem('fraccionesScore', 0);
        }
    }

    btnCheck.addEventListener('click', checkAnswer);

    function updateRightChart() {
        const n = parseInt(numInput.value) || 0;
        const d = parseInt(denInput.value) || 1;
        drawPieChart('chart-right', n, d);
    }

    numInput.addEventListener('input', updateRightChart);
    denInput.addEventListener('input', updateRightChart);

    generateProblem();
});
