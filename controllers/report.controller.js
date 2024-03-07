import Report from '../models/Report.model.js';

export const createReport = async (req, res) => {
  try {
    const { senderId, senderName, text, url } = req.body;

    const newReport = new Report({
      senderId,
      senderName,
      text,
      url,
    });

    const savedReport = await newReport.save();

    res.status(201).json(savedReport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating report' });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find();

    res.status(200).json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting reports' });
  }
};

export const getReportBySenderId = async (req, res) => {
  try {
    const { senderId } = req.params;

    const report = await Report.findOne({ senderId });

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting report' });
  }
};
