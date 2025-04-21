const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['like', 'comment'], required: true },
  interactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Interaction', required: true },
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: String,
  title: String,      
  year: Number,        
  actionType: String,  
  isRead: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Notification', notificationSchema);
