import * as service from '../services/userService.js';

export const createUser = async (req, res) => {
  try {
    const item = await service.createUser(req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const item = await service.getUserById(Number(req.params.id));
    if (!item) return res.status(404).json({ error: 'User not found' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const listUsers = async (req, res) => {
  try {
    const items = await service.listUsers(req.query || {});
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const item = await service.updateUser(Number(req.params.id), req.body);
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await service.deleteUser(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
