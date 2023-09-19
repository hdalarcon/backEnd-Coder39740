import dotenv from "dotenv";
dotenv.config();

import AppFactory from "../presentation/factories/appFactory.js" 
import DbFactory from "../data/factories/dbFactory.js"
import e from "express";

const initServer = async() =>
{
  try {
    const db = DbFactory.create(process.env.DB);
    db.init(process.env.DB_URI);
  
    const app = AppFactory.create();
  
    app.init();
    app.build();
  
    return {
      app,
      db
    }
  } catch (error) {
    console.log(e);
  }
};

export default initServer;