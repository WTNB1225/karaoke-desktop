import {useState} from "react";

const map = new Map();
map.set(440.0, "A4");
map.set(466.16, "A#4");
map.set(493.88, "B4");
map.set(523.25, "C5");
map.set(554.37, "C#5");


export default function Play() {
    const [micFrequency, setMicFrequency] = useState<number>(0);
    const [mediaFrequency, setMediaFrequency] = useState<number>(0);
    async function analyzeMediaStream() {
        try {
            const mediaContext = new AudioContext();
            const response = await fetch("/public/BELOVED.mp3");
            const arrayBuffer = await response.arrayBuffer();
            const analyzer = mediaContext.createAnalyser();
            analyzer.fftSize = 1024*8;
            const audioBuffer = await mediaContext.decodeAudioData(arrayBuffer);
            const source = mediaContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(analyzer);
            source.start();
            const dataArray = new Uint8Array(analyzer.frequencyBinCount);
            const sampleRate =mediaContext.sampleRate;
            const audio = new Audio("/public/BELOVED.mp3");
            audio.play();
            function getFrequency() {
                analyzer.getByteFrequencyData(dataArray);
                let maxIndex = 0;
                for (let i = 0; i < dataArray.length; i++) {
                    if (dataArray[i] > dataArray[maxIndex]) {
                        maxIndex = i;
                    }
                }
                const peakFrequency = (maxIndex * sampleRate) / analyzer.fftSize;
                console.log("peakMediaFrequency:", peakFrequency);
                setMediaFrequency(peakFrequency);
        }
            setInterval(getFrequency, 10);
            
        } catch (error) {
            console.error("MediaStreamエラー:", error);
        }
    }

    async function analyzeAudioFrequency() {
        try {
            // ユーザーにマイクアクセスを要求
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // オーディオコンテキストを作成
            const micContext = new AudioContext();

            const micAnalyser = micContext.createAnalyser();
            
            // マイク入力をオーディオノードに接続
            const source = micContext.createMediaStreamSource(stream);
            source.connect(micAnalyser);

            // FFTサイズを設定
            micAnalyser.fftSize = 1024*8;
            const bufferLength = micAnalyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            // サンプリングレート取得
            const sampleRate = micContext.sampleRate;

            // 周波数データを取得して描画
            function getFrequency() {
                micAnalyser.getByteFrequencyData(dataArray);
                let maxIndex = 0;
                for (let i = 0; i < bufferLength; i++) {
                    // 最大振幅のインデックスを見つける
                    if (dataArray[i] > dataArray[maxIndex]) {
                        maxIndex = i;
                    }
                }
                const peakFrequency = (maxIndex * sampleRate) / micAnalyser.fftSize;
                // ピーク周波数の計算と表示
                if(dataArray[maxIndex] > 125 && peakFrequency < 1000 && peakFrequency > 80) {
                    console.log("peakFrequency:", peakFrequency);
                    setMicFrequency(peakFrequency);
                }
            }

            setInterval(getFrequency, 1);
        } catch (error) {
            console.error("マイクアクセスエラー:", error);
        }
    }

    return (
        <div className="flex w-full h-screen bg-gray-950">
            <h1 className="mx-auto mt-10 text-lg">Karaoke</h1>
            <button onClick={analyzeAudioFrequency}>start</button>
            <button onClick={analyzeMediaStream}>start</button>
            <audio src="/public/hz.wav"></audio>
        </div>
    );
}