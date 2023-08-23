import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'
import dad1 from '../public/dad1.png'
import dad2 from '../public/dad2.png'
import dad3 from '../public/dad3.png'
import Counter from '../components/Counter'
import html2canvas from 'html2canvas';

export default function Home() {

  const [question, setQuestion] = useState();
  const [answer, setAnswer] = useState();
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [perms, setPerms] = useState(false);
  const [permsmsg, setPermsmsg] = useState();
  const [recognition, setRecognition] = useState();
  const [image, setImage] = useState(null);
  const [imgurlink, setImgurlink] = useState(null);

  const audioRef = useRef(null);

  function capitializeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const playStart = () => {
    audioRef.current.play();
  };

  useEffect(() => {
    async function init() {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setPerms(true);
        setPermsmsg('Press START to begin');
      } catch (error) {
        console.error('Microphone access not granted:', error);
        setPerms(false);
        setPermsmsg('Microphone access not granted');
      }
    }

    init();
  }, [])

  const createImage = () => {
    html2canvas(document.body).then(canvas => {
      const imageData = canvas.toDataURL('image/png');
      setImage(imageData);
      downloadImage();
    });
  }

  const downloadImage = () => {
    if (image) {
      const link = document.createElement('a');
      link.href = image;
      link.download = 'dadgpt.png';
      link.click();
    }
  }

  const shareToTwitter = (text) => {
    const maxTweetLength = 280;
    const url = 'https://dadgpt.vercel.app';
    const encodedUrl = encodeURIComponent(url);
    let tweetText = text + ' ' + url;

    if (tweetText.length > maxTweetLength) {
      tweetText = text.substring(0, maxTweetLength - encodedUrl.length - 5) + '...' + ' #dadgpt ' + url; // -4 for ellipsis and space
    }

    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(tweetUrl, '_blank');
  }

  async function getAnswer(question) {
    setLoading(true);
    const request = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question })
    })

    const response = await request.json();
    console.log(response)
    const answer = response.answer;
    setAnswer(answer);
    setLoading(false);

    const speech = new SpeechSynthesisUtterance(answer);
    window.speechSynthesis.speak(speech);
  }

  function start() {

    playStart();
    setAnswer('');
    setQuestion('');
    setRecording(true);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onerror = function (event) {
      console.error('An error occurred: ' + event.error);
    };

    recognition.start();

    recognition.onresult = async function (event) {
      const q = event.results[0][0].transcript
      setRecording(false);
      setQuestion(capitializeFirstLetter(q))
      getAnswer(q)
    }

    setRecognition(recognition);
  }

  function stop() {
    playStart();
    recognition.stop();
    setRecording(false);
  }

  return (
    <div className={styles.container} >
      <Head>
        <title>Dad GPT by Salim Karim</title>
        <meta name="description" content="When Dads not around to answer your questions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.dad}>
          <Image className={styles.pixelate} src={dad1} alt="Dad" />
          <Image className={styles.pixelate} src={dad2} alt="Dad" />
          <Image className={styles.pixelate} src={dad3} alt="Dad" />
        </div>
        <h1 className={styles.title}>
          Dad GPT
        </h1>

        <p className={styles.description}>
          Call DadGPT to answer your questions
        </p>

        <div className={styles.grid}>
          <button onClick={start} className={styles.button} disabled={recording}>🎙️ Start</button>
          <button onClick={stop} className={styles.button} disabled={!recording}>🛑 Stop</button>
          <audio id="audio" ref={audioRef} src="start.mp3" hidden></audio>
          <div className={styles.container}>
            <div className={styles.recording} hidden={!recording}></div>
            <div className={styles.loader} hidden={!loading}></div>
          </div>
          {!question ? <div className={styles.output}>{permsmsg}</div> : null}
          {question && <div className={styles.question}>{question}?</div>}
          <div className={styles.answer}>{answer}</div>
          <button onClick={() => shareToTwitter("https://imgur.com/TxOd4pw")}>Share to X</button>
          {/* <button onClick={createImage}>Create Image</button> */}
          {/* <button onClick={downloadImage}>Download Image</button> */}
          {image && <Image src={image} alt="Dad" width={"100"} height={"50"} />}
        </div>
        <footer className={styles.footer}>
          <Counter />

        </footer>
      </main >
    </div >
  )
}
