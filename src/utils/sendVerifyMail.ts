import nodemailer from "nodemailer"
import {Request} from "express"

export const sendVerifyMail = (req:Request,userName:any,email:string)=>{

    try {
        const sessionData = req.session;
        const otp = sessionData.otp
        sessionData.otpGeneratedTime = Date.now()
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'akshayskurup@gmail.com', 
                pass: 'sdln denw yhdu ctvg' 
            }
        });
    
        
        const mailOptions = {
            from: 'nexus@gmail.com', 
            to: email, 
            subject: 'Verification Email', 
            html: `
            
            <html>
            <head>
              <style>
              body {
                font-family: 'Arial', sans-serif; 
                margin: 0; 
              }
              
              .container {
                max-width: 600px;
                margin: 30px auto; 
                padding: 30px; 
                border: 1px solid #eee;  
                border-radius: 8px;       
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); 
              }
              
              h1 {
                color: #333; 
                margin-bottom: 20px;
              }
              
              p {
                color: #666;
                line-height: 1.6; 
                margin-bottom: 15px;
              }
              
              .otp-box {
                font-size: 24px;
                font-weight: bold;
                padding: 15px;
                text-align: center;
                background-color: #f5f5f5;
                border-radius: 6px;
                margin-bottom: 20px;
              }
              
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Verification Email</h1>
                <p>Dear ${userName},</p>
                <p>Please enter this OTP to complete your registration:</p>
                <div class="otp-box">
                  ${otp}
                </div>
                <p>Best regards,<br>Nexus Team</p>
              </div>
            </body>
            </html>
            
            `
        };
    
        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Error sending email: ", error);
            } else {
                console.log("Email sent: ", info.response);
            }
        });
    } catch (error) {
        console.log(error)
    }
    
};