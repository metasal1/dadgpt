import Link from "next/link";

const Footer = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <>
      <Link href="/safari-tts">TTS</Link> |<Link href="/safari-stt">SST</Link>
      <button onClick={handleReload}>Refresh</button>
    </>
  );
};

export default Footer;
