const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// const mailOptions = {
//     from: 'hamzaa098poi@gmail.com',
//     to: 'hamzaa098poi@gmail.com',
//     subject: 'first',
//     text: 'this is my first trial'
// };


const sendwelcome= (email, name)=>{
    const mailOptions = {
        from: process.env.MAIL,
        to: email,
        subject: 'Welcome to the App',
        text:`Welcome to the app, ${name}. Let me know how you get along with the app.`
    }
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email is sent ' + info.response);
        }
    });
}

const senddelete= (email, name)=>{
    const mailOptions = {
        from: process.env.MAIL,
        to: email,
        subject: 'Account deleted',
        text:` ${name}, your account has been deleted.`
    }
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email is sent ' + info.response);
        }
    });
}


module.exports={
    sendwelcome,
    senddelete
}
