const Registration = require('../models/Registration');
const SessionAttendance = require('../models/SessionAttendance');
const Feedback = require('../models/Feedback');
const Event = require('../models/Event');
const mongoose = require('mongoose');

exports.getEventAnalytics = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ success: false, error: 'Invalid Event ID' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    if (event.organizerId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    const registrationStats = await Registration.aggregate([
      { $match: { eventId: new mongoose.Types.ObjectId(eventId) } },
      { $group: {
          _id: null,
          totalRegistrations: { $sum: 1 },
          totalRevenue: { $sum: '$finalPrice' },
          checkedInCount: {
              $sum: { $cond: [{ $eq: ['$status', 'CHECKED_IN'] }, 1, 0] }
          }
      }}
    ]);

    const stats = registrationStats[0] || { totalRegistrations: 0, totalRevenue: 0, checkedInCount: 0 };
    const attendanceRate = stats.totalRegistrations > 0 ? (stats.checkedInCount / stats.totalRegistrations) * 100 : 0;

    const ticketSales = await Registration.aggregate([
      { $match: { eventId: new mongoose.Types.ObjectId(eventId) } },
      { $group: {
          _id: '$ticketTypeId',
          count: { $sum: 1 },
          revenue: { $sum: '$finalPrice' }
      }}
    ]);

    const sessionPopularity = await SessionAttendance.aggregate([
      { $match: { eventId: new mongoose.Types.ObjectId(eventId) } },
      { $group: {
          _id: '$sessionId',
          attendanceCount: { $sum: 1 }
      }},
      { $lookup: {
          from: 'sessions',
          localField: '_id',
          foreignField: '_id',
          as: 'sessionDetails'
      }},
      { $unwind: '$sessionDetails' },
      { $project: {
          title: '$sessionDetails.title',
          attendanceCount: 1
      }},
      { $sort: { attendanceCount: -1 } }
    ]);

    const feedbackRatings = await Feedback.aggregate([
      { $match: { eventId: new mongoose.Types.ObjectId(eventId) } },
      { $group: {
          _id: '$sessionId',
          averageRating: { $avg: '$rating' },
          totalFeedbacks: { $sum: 1 }
      }},
      { $lookup: {
          from: 'sessions',
          localField: '_id',
          foreignField: '_id',
          as: 'sessionDetails'
      }},
      { $unwind: '$sessionDetails' },
      { $project: {
          title: '$sessionDetails.title',
          averageRating: { $round: ['$averageRating', 2] },
          totalFeedbacks: 1
      }}
    ]);

    const analyticsData = {
        totalRegistrations: stats.totalRegistrations,
        totalRevenue: stats.totalRevenue,
        checkedInCount: stats.checkedInCount,
        attendanceRate: attendanceRate.toFixed(2),
        ticketSales,
        sessionPopularity,
        feedbackRatings
    };

    res.status(200).json({ success: true, data: analyticsData });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
