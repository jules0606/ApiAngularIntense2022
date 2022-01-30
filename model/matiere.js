let mongoose = require('mongoose');
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let Schema = mongoose.Schema;

let MatiereShema = Schema({
    id: Number,
    nom: String,
    urlPhotoProf: String,
    urlImageMatiere: String,
});

MatiereShema.plugin(aggregatePaginate);

module.exports = mongoose.model('matiere', MatiereShema);