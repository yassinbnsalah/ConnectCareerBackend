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
      const countNotifications = await Notification.countDocuments({ recipient: userId, isRead: false });
      return countNotifications;
    } catch (error) {
      console.error(error);
      throw new Error('Internal Server Error');
    }
  }
  
  async function SetIsReadTrue(notificationId) {
    try {
      // Mettre à jour la notification avec isRead=true
      const updatedNotification = await Notification.findByIdAndUpdate(
        notificationId,
        { $set: { isRead: true } },
        { new: true } // Pour retourner la notification mise à jour
      );
  
      // Vérifier si la notification existe et a été mise à jour
      if (!updatedNotification) {
        throw new Error('Notification not found');
      }
  
      return updatedNotification;
    } catch (error) {
      console.error(error);
      throw new Error('Internal Server Error');
    }
  }
  
  module.exports = {
    getListOfNotification,
    getListOfNotificationsbyid,
    getAllListOfNotificationsbyid,
    SetIsReadTrue,
    getNumberofNotificationsbyid
  };