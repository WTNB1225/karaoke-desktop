import {useState, useEffect} from "react";

type Data = {
    note: string;
    frequency: number;
    start_time: number;
    end_time: number;
}

const noteRange = ["C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5", "C#5", "D5", "D#5", "E5", "F5", ];
// 判定枠の上側のY座標 
const noteLeneTop = [100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400, 420, 440, 460, 480, 500, 520, 540, 560, 580, 600, 620, 640, 660, 680];
const noteData: Data[] = [];

function drawBall(ctx: CanvasRenderingContext2D, x: number, y: number) {
    let posX = x;
    let posY = y;
    const radius = 7;
    const intervalId = setInterval(() => {
        console.log("drawBall");
        // 前回の円を消す
        ctx.clearRect(posX - radius - 1, posY - radius - 1, radius * 2 + 2, radius * 2 + 2);

        // 新しい円を描く
        ctx.beginPath();
        ctx.fillStyle = "Red";
        ctx.arc(posX, posY, radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.closePath();

        posY += 1;
    }, 20);
    return () => clearInterval(intervalId); // コンポーネントのアンマウント時にインターバルをクリア
}

function drawNote(ctx: CanvasRenderingContext2D, noteData: Data[]) {
    ctx.fillStyle = "Red";
    let note = "A4";
    let note_index = noteRange.indexOf(note);
    ctx.fillRect(100, noteLeneTop[note_index] + 2, 50, 15);
}

export default function Play() {
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
    const [ballCtx, setBallCtx] = useState<CanvasRenderingContext2D | null>(null);
    const [noteCtx, setNoteCtx] = useState<CanvasRenderingContext2D | null>(null);

    const canvasWidth = 800;
    const canvasHeight = 600;

    noteData.push({note: "A4",frequency: 440.0, start_time: 1.0, end_time: 2.0});
    noteData.push({note: "A4",frequency: 440.0, start_time: 2.0, end_time: 4.0});

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
    if (ctx !== null) {
        ctx.fillStyle = "White";

        noteLeneTop.forEach((top, index) => {
            ctx.fillStyle = "White";
            ctx.fillRect(100, top, canvasWidth, 1);
        })
        ctx.fillStyle = "White";
        ctx.fillRect(100, noteLeneTop[noteLeneTop.length - 1] + 20, canvasWidth, 1);
    }

    // ノーツの描画
    if (noteCtx !== null) {
        drawNote(noteCtx, noteData);
    }


    return ( 
        <div className="flex w-full h-screen bg-gray-950">
            <canvas id="canvas" width={1000} height={1000} className="absolute top-0 left-0"></canvas>
            <canvas id="canvas1" width={1000} height={1000} className="absolute top-0 left-0"></canvas>
            <canvas id="canvas2" width={1000} height={1000} className="absolute top-0 left-0"></canvas>
        </div>
    );
}