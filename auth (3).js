const express = require('express');
const axios = require('axios');
const router = express.Router();

const DISCORD_API = 'https://discord.com/api/v10';
const REDIRECT_URI = `${process.env.DASHBOARD_URL}/auth/callback`;
const SCOPES = 'identify guilds';

router.get('/login', (req, res) => {
  const url = `https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(SCOPES)}`;
  res.redirect(url);
});

router.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect('/');

  try {
    const tokenRes = await axios.post(`${DISCORD_API}/oauth2/token`, new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI
    }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

    const { access_token } = tokenRes.data;
    const headers = { Authorization: `Bearer ${access_token}` };

    const [userRes, guildsRes] = await Promise.all([
      axios.get(`${DISCORD_API}/users/@me`, { headers }),
      axios.get(`${DISCORD_API}/users/@me/guilds`, { headers })
    ]);

    req.session.user = userRes.data;
    req.session.guilds = guildsRes.data;
    req.session.accessToken = access_token;

    res.redirect('/servers');
  } catch (err) {
    console.error('OAuth Fehler:', err.response?.data || err.message);
    res.redirect('/?error=auth_failed');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
