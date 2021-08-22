import React, {useEffect, useRef} from 'react';


type Coordinate = {
    x: number;
    y: number;
};

class Canvas {
    context: CanvasRenderingContext2D

    // canvasRef: React.RefObject<HTMLCanvasElement>
    constructor(context: CanvasRenderingContext2D/*, canvasRef: React.RefObject<HTMLCanvasElement>*/) {
        // this.canvasRef = canvasRef;
        this.context = context;
    }

    drawLine(originalMousePosition: Coordinate, newMousePosition: Coordinate) {
        const context = this.context;
        context.strokeStyle = 'red';
        context.lineJoin = 'round';
        context.lineWidth = 5;

        context.beginPath();
        context.moveTo(originalMousePosition.x, originalMousePosition.y);
        context.lineTo(newMousePosition.x, newMousePosition.y);
        context.closePath();

        context.stroke();
    };
}

export function CanvasElement(props: {draw: (canvas: Canvas) => void}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const context = canvasRef.current.getContext('2d')
        if (context) {
            props.draw(new Canvas(context))
        }
    });

    return <canvas ref={canvasRef} height={window.innerHeight} width={window.innerWidth}/>;
}


//            <CanvasElement draw={(canvas) => {
//                 canvas.drawLine({x: 0, y: 0}, {x: 50, y: 50})
//                 canvas.drawLine({x: 100, y: 0}, {x: 100, y: 100})
//                 canvas.drawLine({x: 0, y: 150}, {x: 100, y: 150})
//             }}/>