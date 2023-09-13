import { transport } from '../../utils/index.js';
import mailTicketTemplate from '../../presentation/templates/mailPassword.js';

class EmailManager
{
    async emailTicket(ticketString, userEmail)
    {
        const mailContent = mailTicketTemplate(ticketString);
        const mail = {
            from : 'hdalarcon@gmail.com',
            to: userEmail,
            subject: 'Ticket de compra',
            html: mailContent,
            attachments: [
        ]
        };
        await transport.sendMail(mail);
    }
}

export default EmailManager;
