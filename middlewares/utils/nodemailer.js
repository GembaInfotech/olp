const dotenv = require('dotenv').config()
const nodemailer = require('nodemailer')
const User = require("../../models/user.model")
const log = require("../../middlewares/utils/log")
const fs = require('fs');
const path = require('path');
const mustache = require('mustache');

exports.transporterForResetPass = async(data) => {
    const user = await User.findOne({
        email: { $eq: data.email },
      });
    // const user = await User.findOne({ where: { email: data.email } })
    
    // const link = process.env.React_ORIGIN+"/verify-account/"+ user.username+"/"
    const link = data.link;
    
    async function main() {

        // Read the HTML file's content
        const templatePath = path.join(__dirname, '..','..', 'emailTemplate', 'resetPassword.html');
        let emailTemplate = fs.readFileSync(templatePath, 'utf8');

        // Replace the placeholders with actual values
        let data= {
            // [user.email]
            to: "s.yadav@gembainfotech.com",
            subject:"Password Reset ",
            html:emailTemplate,
            variables: {
              name: user.name,
              link: link
            },
          }

        let mail = await sendMailHtml(data)
        if(mail){
            return true;
        }
        else{
            return false;
        }  
    }
    main().catch((err) => {
        log.test("nodemailer Error::::", err)
    })
}


var sendMailHtml = async(mailData)=>{
    try{
        console.log("mailData:", mailData);
        let {to, html, text, variables, subject} = mailData;
        if(!html) html='';
        if(!to) to='surabhiya2001@gmail.com';
        if(!variables) variables={};
        console.log('ncjndnc', variables);
        if(!subject) subject='Default support';
        const renderedHtml = mustache.render(html, variables);
        console.log('newvariables',renderedHtml
        );

        // let secure;
        // if (process.env.MAIL_PORT == 465) {
        //     secure = true;
        // } else secure = false;
        
        let transporter= nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "prashantrana9516@gmail.com", // generated ethereal user
                pass: "qqjsatrjwvbynknu", // generated ethereal password
            },
        }) 
console.log("email sent.....");
        let info = await transporter.sendMail({
            from: `"Gemba Infotech " "prashantrana9516@gmail.com" `, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            // html: URL, // html body
            html: renderedHtml
        })
        log.test("",info)
    }catch(err){
        console.log("err 334=> :",err);
        return false;
    }
}

exports.sendMailHtml =sendMailHtml ;