const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

module.exports = {
  // Get enrolled course
  getEnrollment: async (req, res, next) => {
    try {
      const { id: courseId } = req.params;
      const course = await Course.countDocuments({ _id: courseId });
      if (!course) return res.status(404).json({ message: "Course not found" });
      const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: courseId,
      });
      res.status(200).json({ success: true, enrollment });
    } catch (error) {
      next(error);
    }
  },

  getSalesHistory: async (req, res, next) => {
    try {
      const { page, count } = req.query;
      const totalSales = await Enrollment.countDocuments();
      const sales = await Enrollment.find()
        .populate("course", "title")
        .populate("student", "email")
        .populate("teacher", "email")
        .limit(count)
        .skip((page - 1) * count);
      res.status(200).json({ success: true, totalSales, sales });
    } catch (error) {
      next(error);
    }
  },

  getEnrollmentHistory: async (req, res, next) => {
    try {
      const { page, count } = req.query;
      const totalSales = await Enrollment.countDocuments();
      const sales = await Enrollment.find()
        .populate("course", "title")
        .populate("student", "email")
        .populate("teacher", "email")
        .limit(count)
        .skip((page - 1) * count);
      res.status(200).json({ success: true, totalSales, sales });
    } catch (error) {
      next(error);
    }
  },

  markAsComplete: async (req, res, next) => {
    try {
      const { courseId } = req.params;
      const { chapterId, segmentId } = req.body;
      const course = await Course.countDocuments({ _id: courseId });
      if (!course) return res.status(404).json({ message: "Course not found" });
      const enrollment = await Enrollment.findOneAndUpdate(
        { student: req.user._id, course: courseId },
        { $addToSet: { progress: segmentId } }
      );
	  console.log(enrollment);
      res.status(200).json({ success: true, enrollment });
    } catch (error) {
      next(error);
    }
  },
};
