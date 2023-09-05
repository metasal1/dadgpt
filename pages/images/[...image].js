import { useRouter } from 'next/router'
import Image from 'next/image'

export default function Page() {
    const router = useRouter()
    return <>
        <Image src={`https://i.imgur.com/${router.query.image}.png`} width={400} height={600} />
    </>
}