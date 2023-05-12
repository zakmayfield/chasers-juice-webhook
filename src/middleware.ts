export const validateDomain = (req, res, next) => {
  const ALLOWED_DOMAINS = ['localhost'];

  const origin = req.headers.origin;
  const referringDomain = origin ? new URL(origin).hostname : '';

  if (!ALLOWED_DOMAINS.includes(referringDomain)) {
    res.status(403).json({
      error: 'Unauthorized domain',
    });
    return;
  }

  next();
};
