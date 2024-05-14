import { Router } from "express";
import purify from "../utils/sanitize.js";
import User from '../models/auth.js';
import { userAuthentication } from '../validation/auth.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import sendEmail from "../utils/sendEmail.js";

const router = Router();

// רישום משתמש חדש
router.post('/register', async (req, res) => {
    try {
        // סניטיזציה של קלט המשתמש
        Object.keys(req.body).forEach(key => {
            req.body[key] = purify.sanitize(req.body[key]);
        });

        // אימות נתוני המשתמש
        const { error } = userAuthentication.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        // בדיקה אם המשתמש כבר קיים במערכת
        const user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send({
           error: 'האימייל כבר רשום במערכת'
        });

        // הצפנת הסיסמה
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // יצירת משתמש חדש
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        res.status(201).send({
            message: 'המשתמש נוצר בהצלחה',
            user: newUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('שגיאת שרת פנימית');
    }
});

// התחברות משתמש קיים
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // בדיקה אם המשתמש קיים במערכת
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send({
            error: 'דוא"ל או סיסמה שגויים'
        });
        // בדיקת סיסמה
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).send({
            error: 'דוא"ל או סיסמה שגויים'
        });
        res.status(200).send({
           message: 'התחברת בהצלחה'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('שגיאת שרת פנימית');
    }
});

// איפוס סיסמה - שליחת קישור באימייל
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).send({
                error:"המייל שהוזן שגוי"
            });
        }
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        const link = `http://localhost:3001/api/auth/reset-password/${token}`;
        const message = `<h1>ביקשת איפוס הסיסמה </h1>
        <p><a href="${link}">לחץ על קישור זה לאיפוס הסימה שלך</p>`
        const isEmailSend = await sendEmail(email, "בקשה לאיפוס סיסמה", message);
        if (isEmailSend) {
            res.status(200).send({
                message:"בדוק את האיימיל שלך"
            });
        } else {
            res.status(500).send({
               error: "השליחה לאימייל נכשלה"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('שגיאת שרת פנימית');
    }
});

// איפוס סיסמה - עדכון הסיסמה במסד הנתונים
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(401).send('פג תוקף משתמש או משתמש לא חוקי');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.status(200).send('הסיסמה עודכנה בהצלחה');
    } catch (error) {
        console.error(error);
        res.status(500).send('שגיאת שרת פנימית');
    }
});

export default router;
