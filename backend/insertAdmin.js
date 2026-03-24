const mongoose = require('mongoose');
const User = require('./models/User');

const run = async () => {
    try {
        await mongoose.connect('mongodb+srv://2023harshwardhanchinchkhedkar_db_user:syTt6Q2xbFEviF4f@vitaeats.6aqcxtk.mongodb.net/vitaeats_db?retryWrites=true&w=majority');
        
        let admin = await User.findOne({ email: 'admin@vitaeats.com' });
        if (admin) {
            console.log('Admin found! Deleting to ensure clean fresh password hash...');
            await User.deleteOne({ email: 'admin@vitaeats.com' });
        }
        
        console.log('Creating fresh admin...');
        const newAdmin = new User({
            name: 'Master Admin',
            email: 'admin@vitaeats.com',
            password: 'adminpassword123',
            role: 'admin'
        });
        
        await newAdmin.save();
        console.log('SUCCESS! Admin created. Verifying matching hash...');
        
        const verification = await User.findOne({ email: 'admin@vitaeats.com' });
        const isMatch = await verification.matchPassword('adminpassword123');
        console.log('Password hash match test result: ', isMatch);
        
        process.exit(0);
    } catch(err) {
        console.error('FATAL DB ERROR:', err);
        process.exit(1);
    }
}
run();
