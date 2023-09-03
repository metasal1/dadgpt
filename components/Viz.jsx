import React, { useState, useEffect, useRef } from "react";
const Viz = (props) => {
  const canvasRef = useRef(null);
  const [isStarted, setIsStarted] = useState(false);

  const startVisualization = () => {
    setIsStarted(true);
  };

  useEffect(() => {
    console.log(props);
    // if (isStarted) {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const canvas = canvasRef.current;
    if (!canvas) return; // Ensure canvas is available

    const ctx = canvas.getContext("2d");

    // Request microphone access
    if (
      navigator &&
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia
    ) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const source = audioContext.createMediaStreamSource(stream);
          source.connect(analyser);

          const draw = () => {
            analyser.getByteFrequencyData(dataArray);

            const width = canvas.width;
            const height = canvas.height;
            ctx.clearRect(0, 0, width, height);

            const barWidth = (width / dataArray.length) * 20;
            let barHeight;
            let x = 0;

            for (let i = 0; i < dataArray.length; i++) {
              barHeight = dataArray[i];
              ctx.fillStyle =
                "rgb(" +
                (barHeight + 1) +
                "," +
                (barHeight + 100) +
                "," +
                (barHeight + 1) +
                ")";
              ctx.fillRect(x, height - barHeight / 2, barWidth, barHeight / 2);
              x += barWidth + 1;
            }

            requestAnimationFrame(draw);
          };

          draw();
        })
        .catch((err) => {
          console.error("Error accessing microphone:", err);
        });
    }
    // }
  }, [isStarted, props.recording]);

  return (
    <div>
      {props.recording && (
        <canvas ref={canvasRef} width="300" height="100"></canvas>
      )}
    </div>
  );
};

export default Viz;
