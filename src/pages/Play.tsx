import { useState, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";

type NoteData = {
    frequency: number;
    start_time: number;
    end_time: number;
}

const canvasWidth = 1200;
const canvasHeight = 800;
// ノートの音階
const noteFreq = [130, 138, 146, 155, 164, 174, 184, 195, 207, 219, 232, 246, 261, 277, 293, 311, 329, 349, 369, 391, 415, 440, 466, 493, 523, 554, 587, 622, 659, 698];
noteFreq.reverse();
const noteRange = ["C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5", "C#5", "D5", "D#5", "E5", "F5", ];
noteRange.reverse();
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
    height: number; // ノーツの高さ
    length: number; // ノーツの長さ

    constructor(ctx: CanvasRenderingContext2D, speed: number, startTime: number, endTime: number, y: number, height: number) {
        this.ctx = ctx;
        this.speed = speed;
        this.judgeXPos = 100;
        this.startTime = startTime;
        this.endTime = endTime;
        this.y = y;
        this.height = height;
        this.x = this.judgeXPos + this.startTime * this.speed;
        this.duration = this.endTime - this.startTime;
        this.length = this.speed * this.duration;
    }

    update(deltaTime: number) {
        this.x -= this.speed * deltaTime;
    }

    draw() {
        this.ctx.fillStyle = "lightgreen";
        this.ctx.fillRect(this.x, this.y, this.speed * this.duration, this.height);
    }

    check(judgeYIndex: number) {  
        if (this.x < this.judgeXPos && this.x + this.length > this.judgeXPos) {
            const freqPosY = noteLeneTop[judgeYIndex]; // ボールの描画のためにY座標を10pxプラスしているから10を足す
            const notePosY = this.y - 2; 
            const diff = Math.abs(freqPosY - notePosY);
            if (diff < 20) {
                console.log("Good");
            } else {
                console.log("Bad");
            }
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
    const [fetchedNotes, setFetchedNotes] = useState<NoteData[]>([]);
    const [frequecy, setFrequency] = useState<number>(0);
    const posYIndex = useRef<number>(0);
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

    //TODO: ノーツの判定
    const checkNote = (notes: Note[]) => {
        notes.forEach(note => {
            note.check(posYIndex.current);
        });
    } 

    const drawBall = (ctx: CanvasRenderingContext2D, frequecy: number) => {
        let min = 1000;
        let noteIndex = 0;
        noteFreq.forEach((note, index) => {
            if (Math.abs(note - frequecy) < min) {
                min = Math.abs(note - frequecy);
                noteIndex = index;
            }
        });
        posYIndex.current = noteIndex;
        //console.log("noteIndex", posYIndex);
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.beginPath();
        ctx.fillStyle = "Red";
        ctx.arc(100, noteLeneTop[noteIndex] + 10, 7, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
    }

    async function analyzeAudioFrequency() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); // マイクの使用を許可
            const audioCtx = new AudioContext();
            const analyser = audioCtx.createAnalyser();
    
            // マイクの音声をオーディオノードに接続
            const source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);
    
            // FFTの設定
            analyser.fftSize = 1024 * 8; // FFTのサイズ これが上限
            const bufferLength = analyser.frequencyBinCount; // フーリエ変換の結果の配列の長さ FFTサイズの半分
            const dataArray = new Uint8Array(bufferLength); // フーリエ変換の結果を格納する配列
            
            //サンプルレートの取得
            const sampleRate = audioCtx.sampleRate;
    
            const getFrequency = () => {
                analyser.getByteFrequencyData(dataArray);
                const max = Math.max(...dataArray);
                const index = dataArray.indexOf(max);
                const peakFreqency = sampleRate / bufferLength * index;
                // 小さい音の時やノイズが多いときは無視
                if (dataArray[index] < 100 || peakFreqency < 80 || peakFreqency > 1000) {
                    //setFrequency(0); // ボールを一番下にする
                    return;
                }
                setFrequency((peakFreqency / 2));
            }
            const updateFrequency = () => {
                getFrequency();
                requestAnimationFrame(updateFrequency);
            }

            updateFrequency();
        } catch(e) {
            console.error("マイクの入力を許可してください");
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const canvas1 = canvas1Ref.current;
        const canvas2 = canvas2Ref.current;

        analyzeAudioFrequency();

        if (!canvas || !canvas1 || !canvas2) return;

        const ctx = canvas.getContext("2d");
        const judgeCtx = canvas1.getContext("2d");
        const noteCtx = canvas2.getContext("2d");

        if (!ctx || !judgeCtx || !noteCtx) return;

        noteLeneTop.forEach((y) => {
            ctx.fillStyle = "white";
            ctx.fillRect(100, y, canvasWidth, 2);
        });

        setNoteCtx(noteCtx);
        setJudgeCtx(judgeCtx);
    },[]);

    // TauriのAPIを使ってノーツデータを取得
    useEffect(() => {
        invoke("get_notes_data").then((notes) => {
            (notes as NoteData[]).forEach((note) => {
                console.log("note", note);
                let diff = 10000;
                noteFreq.forEach((freq, index) => {
                    if (Math.abs(freq - note.frequency) < diff) {
                        diff = Math.abs(freq - note.frequency);
                        note.frequency = freq;
                    }
                });
            })
            setFetchedNotes(notes as NoteData[]);
        });
    }, []);

    useEffect(() => {
        if (noteCtx) {
            //const newNotes = fetchedNotes.map((note) => {
            //    console.log("note", note);
            //    
            //    return new Note(noteCtx, 1, note.start_time, note.end_time, noteLeneTop[note.frequency], 20);
            //});
            setNotes((prev) => [...prev, new Note(noteCtx, 200, 1, 5, 100, 20), new Note(noteCtx, 200, 5, 6, 120, 20), new Note(noteCtx, 200, 6, 7, 140, 20), new Note(noteCtx, 200, 7, 20, 400, 20)]);
        }
    }, [noteCtx]);

    console.log("notes", notes);

    // ノーツの描画と更新
    useEffect(() => {
        if (noteCtx) {
            const gameLoop = (time: number) => {
                const deltaTime = (time - lastTime) / 1000; // フレーム間の時間差を秒に変換
                lastTime = time;
                updateNotes(notes, deltaTime);
                drawNotes(notes, noteCtx);
                checkNote(notes);
                requestAnimationFrame(gameLoop);
            }
            requestAnimationFrame(gameLoop);
        }
    },[noteCtx, notes]);

    // 判定枠の描画
    useEffect(() => {
        if (judgeCtx) {
            drawBall(judgeCtx, frequecy);
        }
    }, [judgeCtx, frequecy]);

    return (
        <>
            <a href="/">home</a>
            <div className="flex w-full h-screen bg-gray-950">
                <canvas id="canvas" ref={canvasRef} width={canvasWidth} height={canvasHeight} className="absolute top-0 left-0"></canvas>
                <canvas id="canvas1" ref={canvas1Ref} width={canvasWidth} height={canvasHeight} className="absolute top-0 left-0"></canvas>
                <canvas id="canvas2" ref={canvas2Ref} width={canvasWidth} height={canvasHeight} className="absolute top-0 left-0"></canvas>
            </div>
        </>
    );
}