import Image from 'next/image'
import PlayStore from '../public/google-play-badge.png'
import AppStore from '../public/app-store-badge.svg'

export default function Stores() {

    const handlePress = async () => {
        console.log('handlePress');
        alert('Coming soon!');
    }

    return <div style={{ display: 'grid', alignItems: 'center', justifyContent: 'center' }}>
        <Image onClick={handlePress} style={{ cursor: 'pointer' }} src={PlayStore} width={162.5} height={62.5} alt="Available on the Google Play Store" />
        <Image onClick={handlePress} style={{ cursor: 'pointer' }} src={AppStore} width={162.5} height={62.5} alt="Available on the Apple App Store" />
    </div>
}