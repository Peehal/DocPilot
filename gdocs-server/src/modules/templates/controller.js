import * as templatesService from './service.js';

export async function list(req, res) {
  const templates = await templatesService.listTemplates();
  res.json(templates);
}
