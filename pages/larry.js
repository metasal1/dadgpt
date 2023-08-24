import React, { useState } from 'react';

function TextToSpeech() {
    const [text, setText] = useState('some text here to convert to speech');
    const [voice, setVoice] = useState('larry');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/voice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answer: text })
            });

            if (response.ok) {
                const audioData = await response.json();
                const audioUrl = audioData.url;
                const audio = new Audio(audioUrl);
                audio.play();
            } else {
                console.error('An error occurred:', await response.text());
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }

        setLoading(false);
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder="Enter your text here"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <select value={voice} onChange={(e) => setVoice(e.target.value)}>
                    {/* Add more voice options here */}
                    <option value="larry">Larry</option>
                </select>
                <button type="submit" disabled={loading}>
                    {loading ? 'Processing...' : 'Convert to Speech'}
                </button>
            </form>
        </>
    );
}

export default TextToSpeech;
