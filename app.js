const express = require ("express");
const app = express ();
const equipmentsData = require ("./models/equipment");
const bodyParser = require ("body-parser");
const csv = require ("csv");
const fs = require ("fs"); 
const multer = require ("multer");
const path = require("path");
const port = 3000;


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

(async () => {
    await equipmentsData.sync();
})(); 

app.listen(port, () => {
    console.log ("Servidor acessado na porta "+port+": https://localhost:"+port);
});

app.get("/", async (req,res) =>{
    const equipments = await equipmentsData.findAll();
    res.send(equipments)
});

app.get("/lastDay", async (req, res) => {
    const lastDay = new Date(); 
    lastDay.setDate(lastDay.getDate() - 1);
    const equipments = [];
    const equipmentPrototypes = await equipmentsData.findAll();
    let sumOfEquipments = 0;
    for (var i=0; i<equipmentPrototypes.length ; i++){
        if (equipmentPrototypes[i].dataValues.timeStamp >= lastDay){
            sumOfEquipments += parseFloat(equipmentPrototypes[i].dataValues.value);
            equipments.push(equipmentPrototypes[i]);
        }
    }
    res.send("A média total dos valores dos "+equipments.length+" equipamentos nas últimas 24h foi de: "+sumOfEquipments/equipments.length);
});

app.get("/lastTwoDays", async (req, res) => {
    const lastTwoDays = new Date(); 
    lastTwoDays.setDate(lastTwoDays.getDate() - 2);
    const equipments = [];
    const equipmentPrototypes = await equipmentsData.findAll();
    let sumOfEquipments = 0;
    for (var i=0; i<equipmentPrototypes.length ; i++){
        if (equipmentPrototypes[i].dataValues.timeStamp >= lastTwoDays){
            sumOfEquipments += parseFloat(equipmentPrototypes[i].dataValues.value);
            equipments.push(equipmentPrototypes[i]);
        }
    }
    res.send("A média total dos valores dos "+equipments.length+" equipamentos nas últimas 48h foi de: "+sumOfEquipments/equipments.length);
});

app.get("/lastWeek", async (req, res) => {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const equipments = [];
    const equipmentPrototypes = await equipmentsData.findAll();
    let sumOfEquipments = 0;
    for (var i=0; i<equipmentPrototypes.length ; i++){
        if (equipmentPrototypes[i].dataValues.timeStamp >= lastWeek){
            sumOfEquipments += parseFloat(equipmentPrototypes[i].dataValues.value);
            equipments.push(equipmentPrototypes[i]);
        }
    }
    res.send("A média total dos valores dos "+equipments.length+" equipamentos na última semana foi de: "+sumOfEquipments/equipments.length);
});

app.get("/lastMonth", async (req, res) => {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const equipments = [];
    const equipmentPrototypes = await equipmentsData.findAll();
    let sumOfEquipments = 0;
    for (var i=0; i<equipmentPrototypes.length ; i++){
        if (equipmentPrototypes[i].dataValues.timeStamp >= lastMonth){
            sumOfEquipments += parseFloat(equipmentPrototypes[i].dataValues.value);
            equipments.push(equipmentPrototypes[i]);
        }
    }
    res.send("A média total dos valores dos "+equipments.length+" equipamentos no último mês foi de: "+sumOfEquipments/equipments.length);
});

app.post("/insert", async (req,res) =>{ 
    await equipmentsData.create(req.body)
    .then(() => {
        return res.json({
            erro:false,
            mensagem: "Equipment registered successfully"
        })
    }).catch(() => {    
        return res.status(400).json({
            erro:true,
            mensagem: "Error: Equipment not registered successfully"
        })
    });
    res.send("Import completed");
});

app.post("/insert_csv", multer({ 
    dest: path.resolve (__dirname + 'uploads/')
    })
    .single("example"), (req,res) => { 
    const file = req.file.path;
    fs.createReadStream(file)
        .pipe(csv.parse({columns:true,delimiter:";"}))
        .on("data", async(stringData) => { 
            await equipmentsData.create(stringData)
        })   
    res.send("Import completed");
});

