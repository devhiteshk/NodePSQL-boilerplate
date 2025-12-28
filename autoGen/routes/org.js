import express from 'express';
import * as ctrl from '../controllers/orgController.js';

const router = express.Router();

router.post('/', ctrl.createOrg);
router.get('/', ctrl.listOrgs);
router.get('/:id', ctrl.getOrgById);
router.patch('/:id', ctrl.updateOrg);
router.delete('/:id', ctrl.deleteOrg);

export default router;
