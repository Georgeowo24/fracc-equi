import PieChart from './PieChart.js';

export default class FractionGame {
    constructor() {
        //* Referencias al DOM
        this.dom = {
            score: document.getElementById('score-count'),
            numLeft: document.getElementById('num-left'),
            denLeft: document.getElementById('den-left'),
            numInput: document.getElementById('num-input'),
            denInput: document.getElementById('den-input'),
            btnCheck: document.getElementById('btn-check'),
            feedback: document.getElementById('feedback')
        };

        //* Estado del juego
        this.score = parseInt(localStorage.getItem('fraccionesScore')) || 0;
        
        //* Instancias de las gráficas (Composición)
        this.leftChart = new PieChart('chart-left');
        this.rightChart = new PieChart('chart-right');

        //* Inicialización
        this.init();
    }

    init() {
        this.updateScoreDisplay();
        this.bindEvents();
        this.generateProblem();
    }

    bindEvents() {
        // Usamos .bind(this) o arrow functions para no perder el contexto de la clase
        this.dom.btnCheck.addEventListener('click', () => this.checkAnswer());
        
        const updateListener = () => this.updateUserChart();
        this.dom.numInput.addEventListener('input', updateListener);
        this.dom.denInput.addEventListener('input', updateListener);
    }

    updateScoreDisplay() {
        this.dom.score.textContent = this.score;
    }

    saveScore() {
        localStorage.setItem('fraccionesScore', this.score);
        this.updateScoreDisplay();
    }

    resetScore() {
        this.score = 0;
        this.saveScore();
    }

    generateRandomFraction() {
        let num, den;
        do {
            num = Math.floor(Math.random() * 9) + 1;
            den = Math.floor(Math.random() * 9) + 1;
        } while (num >= den); 
        return { num, den };
    }

    generateProblem() {
        // Limpiar mensajes
        this.dom.feedback.textContent = '';
        this.dom.feedback.className = 'feedback-message';

        // Generar datos
        const base = this.generateRandomFraction();

        // Actualizar vista izquierda (Números y Gráfica)
        this.dom.numLeft.textContent = base.num;
        this.dom.denLeft.textContent = base.den;
        this.leftChart.draw(base.num, base.den);

        // Limpiar vista derecha
        this.dom.numInput.value = '';
        this.dom.denInput.value = '';
        this.rightChart.draw(0, 1);
    }

    updateUserChart() {
        const n = parseInt(this.dom.numInput.value) || 0;
        const d = parseInt(this.dom.denInput.value) || 1;
        this.rightChart.draw(n, d);
    }

    checkAnswer() {
        const userNum = parseInt(this.dom.numInput.value);
        const userDen = parseInt(this.dom.denInput.value);

        //! Validaciones de entrada
        if (userNum === 0 || userDen === 0) {
            this.showFeedback("No puedes poner 0 en numerador o denominador.", "error");
            if (navigator.vibrate) navigator.vibrate(100);
            return;
        }

        if (isNaN(userNum) || isNaN(userDen)) {
            this.showFeedback("Por favor, introduce números válidos.", "error");
            if (navigator.vibrate) navigator.vibrate(100);
            return;
        }

        // Lógica matemática
        const baseNum = parseInt(this.dom.numLeft.textContent);
        const baseDen = parseInt(this.dom.denLeft.textContent);

        const isEquivalent = (userNum * baseDen === userDen * baseNum);
        // Verificar que no sea VISUALMENTE la misma fracción (ej: 1/2 vs 1/2)
        const isNotSame = !(userNum === baseNum && userDen === baseDen);

        if (isEquivalent && isNotSame) {
            this.handleSuccess();
        } else {
            this.handleFailure();
        }
    }

    showFeedback(message, type) {
        this.dom.feedback.textContent = message;
        this.dom.feedback.className = `feedback-message ${type}`;
    }

    handleSuccess() {
        this.showFeedback("¡Correcto!", "success");

        // Vibración (si está soportada)
        if (navigator.vibrate) {
            navigator.vibrate(200);
        }

        this.score++;
        this.saveScore();
        
        // Retraso para el siguiente problema
        setTimeout(() => this.generateProblem(), 1200);
    }

    handleFailure() {
        this.showFeedback("Incorrecto. Intenta de nuevo. (Puntos reiniciados)", "error");

        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }

        this.resetScore();
    }
}