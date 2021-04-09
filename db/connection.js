const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE, {
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
    // compulsory
})
    .then(() => console.log('Database connected successfully'))