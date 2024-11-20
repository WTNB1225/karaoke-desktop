import { useState, useEffect, useRef } from "react";

const canvasWidth = 1200;
const canvasHeight = 800;
// ノートの音階
const noteRange = ["C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5", "C#5", "D5", "D#5", "E5", "F5", ];
// 判定時のY座標
const noteLeneTop = [100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400, 420, 440, 460, 480, 500, 520, 540, 560, 580, 600, 620, 640, 660, 680, 700];
class Note {
    ctx: CanvasRenderingContext2D; // 描画するコンテキスト
    speed: number; // ノーツのスピード
    judgeXPos: number; // 判定ラインのX座標
    startTime: number; // ノーツの開始時間
    endTime: number; // ノーツの終了時間
    duration: number; // ノーツの持続時間
    x: number; // ノーツのX座標
    y: number; // ノーツのY座標
    width: number; // ノーツの幅
    height: number; // ノーツの高さ
    length: number; // ノーツの長さ

    constructor(ctx: CanvasRenderingContext2D, speed: number, startTime: number, endTime: number, y: number, width: number, height: number) {
        this.ctx = ctx;
        this.speed = speed;
        this.judgeXPos = 100;
        this.startTime = startTime;
        this.endTime = endTime;
        this.y = y;
        this.width = width;
        this.height = height;
        this.x = this.judgeXPos + this.startTime * this.speed;
        this.duration = this.endTime - this.startTime;
        this.length = this.speed * this.duration;
    }

    update(deltaTime: number) {
        this.x -= this.speed * deltaTime;
    }

    draw() {
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(this.x, this.y, this.speed * this.duration, this.height);
    }

    check() {
        if (this.x + this.width < this.judgeXPos) {
            console.log("pass");
            return true;
        }
    }
}

export default function Play() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvas1Ref = useRef<HTMLCanvasElement>(null);
    const canvas2Ref = useRef<HTMLCanvasElement>(null);
    const [noteCtx, setNoteCtx] = useState<CanvasRenderingContext2D | null>(null);
    const [judgeCtx, setJudgeCtx] = useState<CanvasRenderingContext2D | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    let lastTime = 0;


    const drawNotes = (notes: Note[], noteCtx: CanvasRenderingContext2D) => {
        if (!noteCtx) return;
        noteCtx.clearRect(0, 0, canvasWidth, canvasHeight);
        notes.forEach(note => {
            note.draw();
        });
    }

    const updateNotes = (notes: Note[], deltaTime: number) => {
        notes.forEach(note => {
            note.update(deltaTime);
        });
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const canvas1 = canvas1Ref.current;
        const canvas2 = canvas2Ref.current;

        if (!canvas || !canvas1 || !canvas2) return;

        const ctx = canvas.getContext("2d");
        const judgeCtx = canvas1.getContext("2d");
        const noteCtx = canvas2.getContext("2d");

        if (!ctx || !judgeCtx || !noteCtx) return;

        noteLeneTop.forEach((y, index) => {
            ctx.fillStyle = "white";
            ctx.fillRect(100, y, canvasWidth, 2);
        });

        setNoteCtx(noteCtx);
        setJudgeCtx(judgeCtx);
    },[]);

    useEffect(() => {
        console.log(noteCtx);
        if (noteCtx) {
            setNotes(prevNotes => [...prevNotes, new Note(noteCtx, 200, 10, 15, 102, 20, 18), new Note(noteCtx, 200, 2, 10, 122, 20, 18)]);
        }
    },[noteCtx]);

    useEffect(() => {
        if (noteCtx && judgeCtx) {
            const gameLoop = (time: number) => {
                const deltaTime = (time - lastTime) / 1000; // フレーム間の時間差を秒に変換
                lastTime = time;
                updateNotes(notes, deltaTime);
                drawNotes(notes, noteCtx);
                requestAnimationFrame(gameLoop);
            }
            requestAnimationFrame(gameLoop);
        }
    },[noteCtx, notes, judgeCtx]);

    console.log(notes);
    console.log(lastTime);

    return (
        <div className="flex w-full h-screen bg-gray-950">
            <canvas id="canvas" ref={canvasRef} width={canvasWidth} height={canvasHeight} className="absolute top-0 left-0"></canvas>
            <canvas id="canvas1" ref={canvas1Ref} width={canvasWidth} height={canvasHeight} className="absolute top-0 left-0"></canvas>
            <canvas id="canvas2" ref={canvas2Ref} width={canvasWidth} height={canvasHeight} className="absolute top-0 left-0"></canvas>
        </div>
    );
}