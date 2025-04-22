const mongoose = require('mongoose');

const url = 'mongodb://127.0.0.1:27017/task-manager-api';

// if (!url) {
//     throw new MongooseError('The `uri` parameter to `openUri()` must be a string, got "undefined". Make sure the first parameter to `mongoose.connect()` or `mongoose.createConnection()` is a string.');
// }

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = mongoose;