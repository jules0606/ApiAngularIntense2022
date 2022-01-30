let Utilisateurs = require('../model/utilisateurs');
const jwt = require("jsonwebtoken");

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

function logIn(req, res) {
    // Validate user input
    const { login, mdp } = req.body;

    console.log(login);
    console.log(mdp);

    if (!(login && mdp)) {
        res.status(400).send("All input is required");
    }

    Utilisateurs.findOne({login, mdp}, (err, user) => {
        console.log(err)
        if(err){res.send(err)}
        if(user) {
            // Creation JWT
            user.token = jwt.sign(
                {user_id: user._id, login, mdp},
                process.env.TOKEN_KEY,
                {
                    expiresIn: "1d",
                }, null
            );

            user.admin = login === 'admin';
            delete user.mdp;
             res.status(200).json(user);
        } else {
             res.send(false);
        }
    });
}

module.exports = { getUtilisateurs, logIn };
