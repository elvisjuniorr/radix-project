const Sequelize = require ('sequelize');
const db = require ('./db');
const equipmentsData = db.define('equipmentsData',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNULL: false,
        primaryKey: true
    },
    equipmentId: {
        type: Sequelize.STRING(50),
        allowNULL: false
    },
    timeStamp: {
        type: Sequelize.DATE, 
        defaultValue: Sequelize.NOW,
        allowNULL: false
    },
    value: {
        type: Sequelize.DECIMAL,
        allowNULL: false
    }
});

module.exports = equipmentsData;
