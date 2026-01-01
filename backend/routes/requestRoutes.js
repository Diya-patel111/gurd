const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

router.post('/', requestController.createRequest);
router.put('/:id', requestController.updateRequest);
router.get('/', requestController.getAllRequests);
router.get('/equipment/:equipmentId/count', requestController.getOpenRequestCount);

module.exports = router;
