const mailTicketTemplate = (ticket) =>
{
const mailTemplate =  `<html>
                            <head>
                                <style>
                                    pre {
                                    padding: 5px;
                                    color: rgb(75, 104,150)
                                    font-family 'Tahoma', sans-serif;
                                    }
                                </style>
                            </head>
                            <body>
                                <pre>
                                    <div>
                                        <h1 style= color:blue>Ticket de compra</h1>
                                        <h2>${ticket}</h2>
                                        <h3 style= color:blue>Gracias por tu compra!<h3>
                                        <h3 style= color:red>@Ecommerce<h3>
                                        <img src="cid:1" style="height:200px; width:200 px"/>
                                    </div>
                                </pre>
                            </body>
                        </html>`;

    return mailTemplate;
};

export default mailTicketTemplate;