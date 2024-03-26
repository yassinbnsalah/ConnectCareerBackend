const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
    totalNBOpportunite : Number , 
    acceptedOpportunite : Number , 
    nbSummerOP : Number , 
    acceptedSummerOP : Number , 
    nbPFEOP : Number , 
    acceptedPFE : Number ,
    nbFullTimeOP : Number , 
    acceptedFullTimeOP : Number ,
    TotalReach : Number ,
});

const Stats = mongoose.model('Stats', statsSchema);

module.exports = Stats;