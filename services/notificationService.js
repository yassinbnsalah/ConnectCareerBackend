const Notification = require('../models/notification');
const getListOfNotification = async (req, res) => {

    try {
        const notifications = await Notification.find().populate('sender');
        return notifications;
      } catch (error) {
        console.error(error);
        throw new Error('Internal Server Error');
      }
  };
  async function getListOfNotificationsbyid(userId) {
    try {
      const notifications = await Notification.find({ recipient: userId }).populate('sender').sort({ timestamp: -1 }).limit(3); 
      return notifications;
    } catch (error) {
      console.error(error);
      throw new Error('Internal Server Error');
    }
  }
  async function getAllListOfNotificationsbyid(userId) {
    try {
      const notifications = await Notification.find({ recipient: userId }).populate('sender').sort({ timestamp: -1 }); 
      console.log(notifications);
      return notifications;
    } catch (error) {
      console.error(error);
      throw new Error('Internal Server Error');
    }
  }

  async function getNumberofNotificationsbyid(userId) {
    try {
      const countNotifications = await Notification.countDocuments({ recipient: userId });
      return countNotifications;
    } catch (error) {
      console.error(error);
      throw new Error('Internal Server Error');
    }
  }
  module.exports = {
    getListOfNotification,
    getListOfNotificationsbyid,
    getAllListOfNotificationsbyid,
    getNumberofNotificationsbyid
  };