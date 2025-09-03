
/* eslint-disable no-undef */
import Sequelize from "sequelize";
import literal from "sequelize";
import QueryTypes from "sequelize";
import category from "../api/model/category.js";
const db = {};
export const connectionWithDB = async () => {
    const sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
        port: process.env.DB_PORT,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        define: {
        charset: "utf8",
        collate: "utf8_general_ci",
        freezeTableName: true,
        timestamps: false,
        },
        pool: {
        max: 2000,
        min: 0,
        acquire: 30000,
        idle: 10000,
        },
        logging: false,
        timezone: "+05:30",
        });
        sequelize
            .authenticate()
            .then(() => {
                console.log(
                    `DB Connection Success -->`,
                );
            })
            .catch((error) => {
                console.log(
                    `DB Connection Failed --> {(${error.name})<<--->>(${error.message})}`,
                );
            })
        
        
        db.Sequelize = Sequelize;
        db.sequelize = sequelize;
        db.literal = literal;
        db.QueryTypes = QueryTypes;
        db.category = category(sequelize, Sequelize);
}
export const returnDBConnection = () => {
    return db;
}