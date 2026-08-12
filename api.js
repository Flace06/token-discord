const express = require('express');
const axios = require('axios');
const router = express.Router();
const Guild = require('../../database/models/Guild');
const Warning = require('../../database/models/Warning');
const Ticket = require('../../database/models/Ticket');
const { requireAuth, requireGuildAdmin } = require('../middleware/auth');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

// Aktueller User
router.get('/user', requireAuth, (req, res) => {
  res.json(req.session.user);
});

// Server-Liste des Users (nur wo er Admin ist)
router.get('/guilds', requireAuth, async (req, res) => {
  const guilds = req.session.guilds || [];
  const adminGuilds = guilds.filter(g => {
    const perms = BigInt(g.permissions);
    return !!(perms & BigInt(0x8)) || !!(perms & BigInt(0x20));
  });
  res.json(adminGuilds);
});

// Server-Einstellungen laden
router.get('/guild/:guildId', requireAuth, requireGuildAdmin, async (req, res) => {
  const config = await Guild.findOneAndUpdate(
    { guildId: req.params.guildId },
    { guildId: req.params.guildId },
    { upsert: true, new: true }
  );
  res.json(config);
});

// Server-Einstellungen speichern
router.put('/guild/:guildId', requireAuth, requireGuildAdmin, async (req, res) => {
  const allowed = ['welcome', 'logging', 'moderation', 'tickets', 'customCommands', 'rolePermissions'];
  const update = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) update[key] = req.body[key];
  }
  const config = await Guild.findOneAndUpdate({ guildId: req.params.guildId }, update, { new: true });
  res.json({ success: true, config });
});

// Rollen des Servers
router.get('/guild/:guildId/roles', requireAuth, requireGuildAdmin, async (req, res) => {
  try {
    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
    const roles = await rest.get(Routes.guildRoles(req.params.guildId));
    res.json(roles);
  } catch {
    res.json([]);
  }
});

// Kanäle des Servers
router.get('/guild/:guildId/channels', requireAuth, requireGuildAdmin, async (req, res) => {
  try {
    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
    const channels = await rest.get(Routes.guildChannels(req.params.guildId));
    res.json(channels);
  } catch {
    res.json([]);
  }
});

// Custom Command hinzufügen
router.post('/guild/:guildId/commands', requireAuth, requireGuildAdmin, async (req, res) => {
  const { name, description, response, ephemeral } = req.body;
  if (!name || !response) return res.status(400).json({ error: 'Name und Antwort erforderlich' });

  const config = await Guild.findOne({ guildId: req.params.guildId });
  const exists = config.customCommands.find(c => c.name === name);
  if (exists) return res.status(400).json({ error: 'Befehl existiert bereits' });

  config.customCommands.push({ name, description, response, ephemeral: !!ephemeral });
  await config.save();
  res.json({ success: true });
});

// Custom Command löschen
router.delete('/guild/:guildId/commands/:name', requireAuth, requireGuildAdmin, async (req, res) => {
  await Guild.findOneAndUpdate(
    { guildId: req.params.guildId },
    { $pull: { customCommands: { name: req.params.name } } }
  );
  res.json({ success: true });
});

// Statistiken
router.get('/guild/:guildId/stats', requireAuth, requireGuildAdmin, async (req, res) => {
  const [warnings, openTickets, closedTickets] = await Promise.all([
    Warning.countDocuments({ guildId: req.params.guildId, active: true }),
    Ticket.countDocuments({ guildId: req.params.guildId, status: 'open' }),
    Ticket.countDocuments({ guildId: req.params.guildId, status: 'closed' })
  ]);
  res.json({ warnings, openTickets, closedTickets });
});

module.exports = router;
