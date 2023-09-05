import { useRouter } from 'next/router'
import Image from 'next/image'
import Head from 'next/head'

export default function Page() {
    const router = useRouter()
    return <>
        <Head>
            <title>DadGippity by Salim Karim</title>
            <meta name="description" content="When Dads not around to answer your questions" />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content="@dadgippity" />
            <meta name="twitter:creator" content="@metasal_" />
            <meta property="twitter:title" content="Come talk to DadGippity" />
            <meta property="twitter:image" content={`https://dadgippity.com/images/${router.query.image}`} />
            <meta property="og:image" content={`https://dadgippity.com/images/${router.query.image}`} />
            <meta property="twitter:description" content="When dad is not around to answer questions you have" />
            <meta property="og:url" content="https://dadgippity.com" />
            <meta property="og:title" content="Come talk to DadGippity" />
            <meta property="og:description" content="When dad is not around to answer questions you have" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Image src={`https://i.imgur.com/${router.query.image}.png`} width={500} height={800} />
    </>
}