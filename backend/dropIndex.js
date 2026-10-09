const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb://127.0.0.1:27017/siddhicorp');
  try {
    await mongoose.connection.collection('rfqs').dropIndex('rfqNumber_1');
    console.log('Successfully dropped rfqNumber_1 index');
  } catch (e) {
    console.log('Index not found or already dropped', e.message);
  }
  process.exit(0);
}
run();
