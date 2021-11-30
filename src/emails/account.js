// in which this is for sending emails


const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SEND_GRIP_API_KEY)

const sendNewUSerInvite=(email,name)=>{
    sgMail.send({
        to:email,
        from:'gopivenkataajay5771@gmail.com',
        subject:'Welcome to Gopi Api',
        text:`Hi ${name} thank for chosing us. Glad to meet u`
    })

}

const sendGoodByeEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'gopivenkataajay5771@gmail.com',
        subject:'GoodBye see u soon',
        text:`Hi ${name} we are sad u are leaving us. Be are waiting for u to get back to us`
    })

}

module.exports={sendNewUSerInvite,sendGoodByeEmail}