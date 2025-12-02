export default class PieChart {
    constructor(containerId, filledColor = '#3f51b5') {
        this.container = document.getElementById(containerId);
        this.filledColor = filledColor;
        this.svgNamespace = "http://www.w3.org/2000/svg";
    }

    //? Dibuja el gráfico basado en el numerador y denominador
    draw(numerator, denominator) {
        // Limpieza y validaciones visuales
        this.container.innerHTML = '';
        if (denominator <= 0) denominator = 1;
        if (numerator < 0) numerator = 0;
        if (numerator > denominator) numerator = denominator;

        const size = 100;
        const center = size / 2;
        const radius = size / 2;

        //* Crear SVG
        const svg = document.createElementNS(this.svgNamespace, "svg");
        svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.transform = "rotate(-90deg)";

        //* Círculo de fondo (Gris)
        const bgCircle = document.createElementNS(this.svgNamespace, "circle");
        bgCircle.setAttribute("cx", center);
        bgCircle.setAttribute("cy", center);
        bgCircle.setAttribute("r", radius);
        bgCircle.setAttribute("fill", "#d1d5db");
        svg.appendChild(bgCircle);

        //* Parte rellena (Color)
        if (numerator > 0) {
            const percentage = numerator / denominator;
            
            if (percentage >= 1) {
                const fullCircle = document.createElementNS(this.svgNamespace, "circle");
                fullCircle.setAttribute("cx", center);
                fullCircle.setAttribute("cy", center);
                fullCircle.setAttribute("r", radius);
                fullCircle.setAttribute("fill", this.filledColor);
                svg.appendChild(fullCircle);
            } else {
                const endAngle = percentage * Math.PI * 2;
                const endX = center + radius * Math.cos(endAngle);
                const endY = center + radius * Math.sin(endAngle);
                const largeArcFlag = percentage > 0.5 ? 1 : 0;

                const filledPath = document.createElementNS(this.svgNamespace, "path");
                const pathData = `
                    M ${center} ${center}
                    L ${center + radius} ${center}
                    A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
                    Z`;

                filledPath.setAttribute("d", pathData);
                filledPath.setAttribute("fill", this.filledColor);
                svg.appendChild(filledPath);
            }
        }

        //* Líneas divisorias
        if (denominator > 1) {
            for (let i = 0; i < denominator; i++) {
                const angle = (i / denominator) * Math.PI * 2;
                const lineX = center + radius * Math.cos(angle);
                const lineY = center + radius * Math.sin(angle);

                const line = document.createElementNS(this.svgNamespace, "line");
                line.setAttribute("x1", center);
                line.setAttribute("y1", center);
                line.setAttribute("x2", lineX);
                line.setAttribute("y2", lineY);
                line.setAttribute("stroke", "#ffffff");
                line.setAttribute("stroke-width", "2");
                svg.appendChild(line);
            }
        }

        this.container.appendChild(svg);
    }
}