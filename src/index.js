import dotenv from "dotenv";
dotenv.config();

import AppFactory from "./presentation/factories/appFactory.js";
import DbFactory from "./data/factories/dbFactory.js";

void(async()=>
{
    try {
        const db = DbFactory.create(process.env.DB);
        
        db.init(process.env.DB_URI);

        const app  = AppFactory.create();

        app.init();
        app.build();
        app.listen();

    } catch (error) {
        console.log(e);
    }
})();
