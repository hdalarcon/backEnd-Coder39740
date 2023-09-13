import ticketSchema from '../models/ticket.model.js';

class TicketMongooseRepository
{
    async createNewTicket(data)
    {
        const document = await ticketSchema.create(data);
        return {
            id: document._id,
            code: document.code,
            purchaseDateTime: document.purchaseDateTime,
            amount: document.amount,
            purchaser: document.purchaser
        };
    }
}

export default TicketMongooseRepository;
