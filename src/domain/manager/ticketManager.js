import container from '../../container.js';
import ticketValidation from '../validations/ticket/ticketValidation.js';

class TicketManager
{
    constructor()
    {
        this.repository = container.resolve('TicketRepository');
    }

    async createNewTicket(data)
    {
        await ticketValidation.parseAsync(data);
        return this.repository.createNewTicket(data);
    }

}

export default TicketManager;