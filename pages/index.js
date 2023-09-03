import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'
import Counter from '../components/Counter'
import html2canvas from 'html2canvas';
import { Analytics } from '@vercel/analytics/react';
import Viz from '../components/Viz';
import { useSearchParams } from 'next/navigation'
import ChromeDetection from '../components/ChromeDetection';
export default function Home() {

  const searchParams = useSearchParams()

  const [isChrome, setIsChrome] = useState(false);
  const [question, setQuestion] = useState();
  const [answer, setAnswer] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [perms, setPerms] = useState(false);
  const [permsmsg, setPermsmsg] = useState();
  // const [recognition, setRecognition] = useState();
  const [image, setImage] = useState(null);
  const [imgurlink, setImgurlink] = useState(null);
  const [audio, setAudio] = useState(null);
  const audioRef = useRef(null);
  const [tweet, setTweet] = useState();
  const recognitionRef = useRef(null);


  function capitializeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const playStartSound = () => {
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

  useEffect(() => {
    if (question && answer) {
      createImage();
      // downloadImage();
    }
  }, [question, answer]);

  const createImage = async () => {
    console.log('createImage');
    html2canvas(document.getElementById('og')).then(canvas => {
      const imageData = canvas.toDataURL('image/png');
      setImage(imageData);
      uploadImage(imageData);
    });
  }

  useEffect(() => {
    if (answer) {
      // createMp3(answer);
    }
  }, [answer]);

  const createMp3 = async (a) => {
    console.log('createMp3');

    const url = await fetch('api/voice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answer: a })
    })
    const response = await url.json();
    console.log(response);
    setAudio(response.url);
  }

  const downloadImage = async () => {
    console.log('downloadImage');
    const link = document.createElement('a');
    link.href = image;
    link.download = link.href;
    link.click();
  }

  const uploadImage = async (i) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "image": i
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    const data = await fetch("api/upload", requestOptions)
    const response = await data.json();
    console.log('imgurlink', response.link);
    setImgurlink(response.link);
  }

  const shareImageToTwitter = async () => {
    const maxTweetLength = 280;
    const url = "https://dadgippity.com"
    const encodedUrl = encodeURIComponent(url);
    let tweetText = question + '? ' + answer;
    // let tweetText = '1234567890 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum. Donec in efficitur leo. In hac habitasse platea dictumst. Sed ullamcorper, nunc egestas consequat tincidunt, diam nibh euismod magna, quis facilisis orci nisi eget lectus. Fusce non urna vitae'

    if (tweetText.length > maxTweetLength) {
      tweetText = tweetText.slice(0, maxTweetLength - 36) + '... ' + url;
    } else {
      tweetText += ' ' + url;
    }

    setTweet(tweetText);

    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(tweetUrl, '_blank');
  }

  async function getAnswer(question) {
    setLoading(true);
    if (question.includes('joke')) {

      const joke = await fetch('https://icanhazdadjoke.com/', { headers: { 'Accept': 'application/json' } })
      const jokeResponse = await joke.json();
      console.log(jokeResponse.joke)
      setAnswer(jokeResponse.joke)
      setLoading(false);
      const speech = new SpeechSynthesisUtterance(jokeResponse.joke);
      window.speechSynthesis.speak(speech);

    }
    else {
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
    // speakText(answer);
  }

  useEffect(() => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    // setRecognition(recognition)
    recognitionRef.current = recognition;
    // recognition.interimResults = true;
    recognition.maxAlternatives = 10;
    // recognition.continuous = true;
    recognition.lang = 'en-US';
  }, []);

  const start = () => {

    playStartSound();
    setAnswer('');
    setQuestion('');
    setRecording(true);

    const recognition = recognitionRef.current; // Get the instance from the ref

    recognition.onresult = async function (event) {
      const q = event.results[0][0].transcript
      setRecording(false);
      setQuestion(capitializeFirstLetter(q))
      getAnswer(q)
    }

    recognition.onerror = (event) => {
      setError('Error occurred in recognition: ' + event.error);
    }

    recognition.onend = () => {
      recognition.stop();
    }

    recognition.onspeechend = () => {
      console.log("Speech has stopped being detected");
    };

    recognition.start();
  }

  const stop = () => {
    playStartSound();
    const recognition = recognitionRef.current; // Get the instance from the ref
    recognition.stop();
    setRecording(false);
  }

  return (
    <div className={styles.container} >
      <Head>
        <title>DadGippity by Salim Karim</title>
        <meta name="description" content="When Dads not around to answer your questions" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@metasal_" />
        <meta name="twitter:creator" content="@metasal_" />
        <meta property="twitter:title" content="Come talk to DadGippit" />
        <meta property="twitter:image" content={imgurlink ? `https://dadgippity.com/api/og?image=${imgurlink}` : 'https://dadgippity.com/api/og'} />
        <meta property="og:image" content={imgurlink ? `https://dadgippity.com/api/og?image=${imgurlink}` : 'https://dadgippity.com/api/og'} />
        <meta property="twitter:description" content="When dad is not around to answer questions you have" />
        <meta property="og:url" content="http:/dadgippity.com" />
        <meta property="og:title" content="Come talk to DadGippity" />
        <meta property="og:description" content="When dad is not around to answer questions you have" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div id='og' className={styles.og}>
          <div className={styles.dad}>
            <Image className={styles.pixelate} src="/dad1.png" width={100} height={100} alt="Brown Dad" />
            <Image className={styles.pixelate} src="/dad2.png" width={100} height={100} alt="Old Dad" />
            <Image className={styles.pixelate} src="/dad3.png" width={100} height={100} alt="White Dad" />
          </div>
          <h1 className={styles.title}>
            DadGippity
          </h1>

          <p className={styles.description}>
            Talk to DadGippity to answer your questions
          </p>
          <div className={styles.recording} hidden={!recording}></div>
          <Viz recording={recording} />
          <div className={styles.grid}>
            {!recording && <button onClick={start} className={styles.button}>🎙️ Start</button>}
            {recording && <button onClick={stop} className={styles.button}>🛑 Stop</button>}
            <audio id="audio" ref={audioRef} src="start.mp3" hidden></audio>
            <div className={styles.container}>
              <div className={styles.loader} hidden={!loading}></div>
            </div>
          </div>
          <div>{error}</div>
          <div>
            {!question ? <div className={styles.output}>{permsmsg}</div> : null}
            {question && <div className={styles.question}>{question}?</div>}
            <div className={styles.answer}>{answer}</div>
            {question && answer && <button className={styles.share} onClick={() => shareImageToTwitter()}>Share</button>}
          </div>
          <footer className={styles.footer}>
            <Counter />
            <ChromeDetection />
          </footer>
        </div>
      </main >
      <Analytics />
    </div >
  )
}
