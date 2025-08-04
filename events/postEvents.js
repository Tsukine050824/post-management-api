// events/postEvent.js
const EventEmitter = require('events');
const postEvent = new EventEmitter();

postEvent.on('post:created', (data) => {
  console.log(`📢 Bài viết mới được tạo bởi user ${data.userId}: ${data.title}`);
});

module.exports = postEvent;
