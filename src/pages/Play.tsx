import {useState, useEffect} from "react";

type Data = {
    note: string;
    frequency: number;
    start_time: number;
    end_time: number;
}

const noteRange = ["C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5", "C#5", "D5", "D#5", "E5", "F5", ];
// 判定枠の上側のY座標 
const noteLeneTop = [100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400, 420, 440, 460, 480, 500, 520, 540, 560, 580, 600, 620, 640, 660, 680, 700];
const notesData: Note[] = [];
const canvasWidth = 1200;
const canvasHeight = 800;

class Note {
    ctx: CanvasRenderingContext2D;
    x: number;
    y: number;
    height: number;
    speed: number;
    duration: number;

    constructor(ctx: CanvasRenderingContext2D, x: number, y: number, height: number, speed: number, duration: number) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.height = height;
        this.speed = speed;
        this.duration = duration;
    }

    update(deltaTime: number) {
        this.x -= this.speed * deltaTime
    }

    draw() {
        this.ctx.fillStyle = "lightblue";
        this.ctx.fillRect(this.x, this.y, this.speed * this.duration, this.height);
    }
}

function updateNotes(deltatime: number) {
    notesData.forEach((note) => {
        note.update(deltatime);
    });
}

function drawNotes(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    notesData.forEach((note) => {
        note.draw();
    });
}

export default function Play() {
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
    const [ballCtx, setBallCtx] = useState<CanvasRenderingContext2D | null>(null);
    const [noteCtx, setNoteCtx] = useState<CanvasRenderingContext2D | null>(null);
    const [lastTime, setLastTime] = useState<number>(0);

    // domが読み込まれた後に実行
    useEffect(() => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const ballCanvas = document.getElementById("canvas1") as HTMLCanvasElement;
        const noteCanvas = document.getElementById("canvas2") as HTMLCanvasElement;

        setCtx(canvas.getContext("2d"));
        setBallCtx(ballCanvas.getContext("2d"));
        setNoteCtx(noteCanvas.getContext("2d"));
    }, []);


    // ノーツのレーンを描画している
    //if (ctx !== null) {
    //    ctx.fillStyle = "White";

    //    noteLeneTop.forEach((top) => {
    //        ctx.fillStyle = "White";
    //        ctx.fillRect(100, top, canvasWidth, 1);
    //    })
    //}

    // ノーツの描画
    if (noteCtx !== null) {
        notesData.push(new Note(noteCtx, 500, 100, 20, 200, 5));
    }

    if (ballCtx != null) {
        const gameLoop = (time: number) => {
            const deltaTime = time - lastTime;
            setLastTime(time);
            updateNotes(deltaTime);
            drawNotes(ballCtx);
            requestAnimationFrame(gameLoop);
        }
        requestAnimationFrame(gameLoop);
    }



    return ( 
        <div className="flex w-full h-screen bg-gray-950">
            <canvas id="canvas" width={canvasWidth} height={canvasHeight} className="absolute top-0 left-0"></canvas>
            <canvas id="canvas1" width={canvasWidth} height={canvasHeight} className="absolute top-0 left-0"></canvas>
            <canvas id="canvas2" width={canvasWidth} height={canvasHeight} className="absolute top-0 left-0"></canvas>
        </div>
    );
}