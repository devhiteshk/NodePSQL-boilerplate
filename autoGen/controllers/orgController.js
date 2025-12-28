import * as service from '../services/orgService.js';

export const createOrg = async (req, res) => {
  try {
    const item = await service.createOrg(req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getOrgById = async (req, res) => {
  try {
    const item = await service.getOrgById(Number(req.params.id));
    if (!item) return res.status(404).json({ error: 'Org not found' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const listOrgs = async (req, res) => {
  try {
    const items = await service.listOrgs(req.query || {});
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateOrg = async (req, res) => {
  try {
    const item = await service.updateOrg(Number(req.params.id), req.body);
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteOrg = async (req, res) => {
  try {
    await service.deleteOrg(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
