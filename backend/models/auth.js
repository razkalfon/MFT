import mongoose from 'mongoose';
const  stockSchema = new mongoose.Schema({
    symbol:{
    type: String,
    lowercase: true,
    minlength: 2,
    maxlength: 20,
    trim: true,
    },
    datebuy:{
    type: String,
    },
     quantity:{
    type: String,
    },
    openPrice:{
    type: String,
    },
    pldaily:{
        },
});
const userSchema = new mongoose.Schema({
    username:{
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
    trim: true,
    },
        email:{
            type: String,
            required: true,
            minlength: 3,
            maxlength: 200,
            trim: true,
            lowercase: true,
            unique: true,
            },
            password:{
                type: String,
                required: true,
                minlength: 5,
                maxlength: 75,
                },
            listStockSchema:[stockSchema],
            stockHistorySchema:[stockSchema],
                resetPasswordToken: String,
                resetPasswordExpires: Date,   
});
const User = mongoose.model('User',userSchema);
export default User;