let Utilisateurs = require('../model/utilisateurs');

// Récupérer tous les utilisateurs (GET)
function getUtilisateurs(req, res) {
    var aggregateQuery = Utilisateurs.aggregate();
    Utilisateurs.aggregatePaginate(aggregateQuery,
        {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
        },
        (err, assignments) => {
            if (err) {
                res.send(err);
            }
            res.send(assignments);
        }
    );
}

function isLoggedIn(req, res) {
    Utilisateurs.findOne({login: req.params.login, mdp: req.params.mdp}, (err, user) => {
        console.log(err)
        if(err){res.send(err)}
        if(user) {
            res.send(true);
        } else {
            res.send(false)
        }
    });
}

module.exports = { getUtilisateurs, isLoggedIn };
