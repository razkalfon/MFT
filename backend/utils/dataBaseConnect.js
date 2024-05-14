import mongoose from 'mongoose';


const contentTodatabase = () => { 
mongoose.connect('mongodb+srv://raz:ruzp1o52Vgl2ocZ3@cluster0.jrlg0cv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('connected to MongoDB...'))
.catch(err => console.error('could not connect to MongoDB', err));
 }
//password:ruzp1o52Vgl2ocZ3
//name:raz

export default contentTodatabase;