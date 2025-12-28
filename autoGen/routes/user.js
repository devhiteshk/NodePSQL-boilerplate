import express from 'express';
import * as ctrl from '../controllers/userController.js';

const router = express.Router();

router.post('/', ctrl.createUser);
router.get('/', ctrl.listUsers);
router.get('/:id', ctrl.getUserById);
router.patch('/:id', ctrl.updateUser);
router.delete('/:id', ctrl.deleteUser);

export default router;
