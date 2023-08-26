import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
const SpeechToText = () => {
    const [transcript, setTranscript] = useState('press start to begin');
    const [btnStart, setBtnStart] = useState('Start');
    const [btnStop, setBtnStop] = useState('Stop');
    const [status, setStatus] = useState('Status:');
    const [recognition, setRecognition] = useState();
    const [answer, setAnswer] = useState('I love Azmeena');

    useEffect(() => {
        setRecognition(new (window.SpeechRecognition || window.webkitSpeechRecognition)())
    }, []);

    const speakText = () => {
        const utterance = new SpeechSynthesisUtterance('Sending to server:' + transcript);
        utterance.voice = speechSynthesis.getVoices()[0];
        utterance.pitch = 1;
        utterance.rate = 1;
        utterance.volume = 1;
        speechSynthesis.speak(utterance);
    };

    const recognizeSpeech = () => {
        setTranscript('')

        // recognition.interimResults = true;
        recognition.maxAlternatives = 10;
        recognition.continuous = true;
        recognition.lang = 'en-US';
        recognition.onstart = () => {
            setStatus('Listening...')
        }
        recognition.onresult = (event) => {
            setTranscript(event.results[0][0].transcript);
        };

        recognition.onerror = (event) => {
            setStatus('Error occurred in recognition: ' + event.error);
        }

        recognition.start();

        recognition.onend = () => {
            recognition.stop();
        }

    };

    useEffect(() => {
        if (transcript.includes('told')) {
            setStatus('Sending to server...' + transcript);
            recognition.stop();
            speakText();
        }
    }, [transcript]);

    const stopSpeech = () => {
        recognition.stop();
        setStatus('Stop pressed');
    }
    return (
        <div>
            <h1>Speech to Text</h1>
            <button onClick={recognizeSpeech}>{btnStart}</button>
            <button onClick={stopSpeech}>{btnStop}</button>
            <textarea defaultValue={transcript}></textarea>
            <div>{transcript}</div>
            <div>{status}</div>
            <Footer />
        </div>
    );
};

export default SpeechToText;
