const express = require('express');
const fetch = require('node-fetch');

const app = express();
const port = 3000;

const steamApiKey = 'YOUR_STEAM_API_KEY';

app.get('/getPrice', async (req, res) => {
	const { itemID } = req.query;
	if (!itemID) {
		return res.status(400).send('Brak ID przedmiotu');
	}

	const url = `https://api.steampowered.com/ISteamEconomy/GetAssetPrices/v1/?key=${steamApiKey}&currency=PLN&appid=730&market_hash_name=${itemID}`;

	try {
		const response = await fetch(url);
		const data = await response.json();

		if (data.result && data.result.assets) {
			const price = data.result.assets[0].prices[0].lowest_price;
			res.json({ price: price });
		} else {
			res.json({ error: 'Nie znaleziono przedmiotu' });
		}
	} catch (error) {
		res.status(500).send('Błąd serwera');
	}
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
