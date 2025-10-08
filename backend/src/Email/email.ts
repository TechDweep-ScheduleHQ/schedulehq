import nodemailer ,{SendMailOptions} from "nodemailer";

export const sendEmail = async(mailoptions:SendMailOptions): Promise<boolean> => {
    try{
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            },
            tls : {
                rejectUnauthorized: false
            }
        });
        const info = await transporter.sendMail(mailoptions);
        console.log("Email sent",info.messageId);
        return true;
    }
    catch(error:any){
        console.log("email sending error",error.message)
        return false;
    }
}