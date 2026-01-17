import { TwelvelabsApiClient } from 'twelvelabs-js';

if (!process.env.TWELVELABS_API_KEY) {
    throw new Error('TWELVELABS_API_KEY is not defined in environment variables');
}

const client = new TwelvelabsApiClient({
    apiKey: process.env.TWELVELABS_API_KEY,
});

export default client;
