import Template from '../../models/Template.js';

export function listTemplates() {
  return Template.find({ isPublic: true }).sort({ category: 1, name: 1 });
}

export function getTemplate(id) {
  return Template.findById(id);
}
