// pages/api/uploadToImgur.js

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb' // Set desired value here
        }
    }
}

export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).end(); // Method Not Allowed if not POST
    }

    const { image } = req.body;

    if (!image) {
        return res.status(400).json({ error: 'Image data is required' });
    }

    const formData = new URLSearchParams();
    formData.append('image', image.split(',')[1]);

    try {
        const response = await fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            headers: {
                Authorization: 'Client-ID ' + process.env.IMGUR_CLIENT_ID,
            },
            body: formData,
        });

        const data = await response.json();

        if (data.success) {
            res.status(200).json({ link: data.data.link });
        } else {
            res.status(400).json({ error: 'Failed to upload to Imgur' });
        }
    } catch (error) {
        console.error('Error uploading to Imgur:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
