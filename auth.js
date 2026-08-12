function requireAuth(req, res, next) {
  if (!req.session?.user) {
    return res.redirect('/login');
  }
  next();
}

function requireGuildAdmin(req, res, next) {
  const { guildId } = req.params;
  const guild = req.session?.guilds?.find(g => g.id === guildId);
  if (!guild) {
    return res.status(403).json({ error: 'Kein Zugriff auf diesen Server' });
  }
  // Prüfe ob User Admin-Rechte hat (permission bit 0x8 = Administrator oder 0x20 = Manage Guild)
  const perms = BigInt(guild.permissions);
  if (!(perms & BigInt(0x8)) && !(perms & BigInt(0x20))) {
    return res.status(403).json({ error: 'Keine Berechtigung' });
  }
  next();
}

module.exports = { requireAuth, requireGuildAdmin };
