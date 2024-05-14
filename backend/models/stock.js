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
const Stock = mongoose.model('Stock',stockSchema);
export default Stock;