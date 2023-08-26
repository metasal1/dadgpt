import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
const TextToSpeech = () => {
    const [answer, setAnswer] = useState('I love Azmeena');

    const speakText = () => {
        const utterance = new SpeechSynthesisUtterance(answer);
        utterance.voice = speechSynthesis.getVoices()[0];
        utterance.pitch = 1;
        utterance.rate = 1;
        utterance.volume = 1;
        speechSynthesis.speak(utterance);
    };

    return (
        <div>
            <h1>Text to Speech</h1>
            <textarea
                value={answer}
                onChange={(e) => setText(e.target.value)}
                rows="4"
                cols="50"
            />
            <button onClick={speakText}>Speak</button>
            <Footer />
        </div>

    );
};

export default TextToSpeech;
