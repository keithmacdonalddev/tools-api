// server/routes/caseRoutes.js
import express from 'express';
import {
    getCases,
    getCase,
    createCase,
    updateCase,
    deleteCase,
    getCustomFields,
    addCustomField,
    deleteCustomField,
} from '../controllers/caseController.js';

const router = express.Router();

// Case routes
router.route('/').get(getCases).post(createCase);

router.route('/:id').get(getCase).put(updateCase).delete(deleteCase);

// Custom fields routes
router.route('/custom-fields').get(getCustomFields).post(addCustomField);

router.route('/custom-fields/:id').delete(deleteCustomField);

export default router;
