import express from 'express';
import * as reportController from '../controllers/report.controller.js';

const router = express.Router();

// Create a new report
router.post('/', reportController.createReport);

// Get all reports
router.get('/', reportController.getAllReports);

// Get a report by sender id
router.get('/:senderId', reportController.getReportBySenderId);

export default router;