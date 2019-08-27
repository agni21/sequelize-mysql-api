const { table, user, password } = require('./config.js');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const sequelize = new Sequelize(table, user, password, {
  host: 'localhost',
  dialect: 'mysql'
});

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));

searchApi = (app, model) => {
  app.get( "/search/:query", (req, res) =>
    model.findAll({
      limit: 10,
      offset: 0,
      where: {
        'Product Name': {
          [Op.like]: `%${req.params.query}%`
        },
        'Is Active': 'TRUE'
      },
      attributes: {
        exclude: ['Is Active']
      },
    }).then(result => res.json(result))
  );
};

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    app.listen(8001, () => console.log("App listening on port 8001!"));
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const Product = sequelize.define('product', {
  // attributes
  'CF Product Code': {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false
    // allowNull defaults to true
  },
  'Product Name': {
    type: Sequelize.STRING
  },
  'Processed Product Name': {
    type: Sequelize.STRING
  },
  'Product URL': {
    type: Sequelize.STRING
  },
  'ISV Name': {
    type: Sequelize.STRING
  },
  'Contact ISV Name': {
    type: Sequelize.STRING
  },
  'Is Active': {
    type: Sequelize.BOOLEAN
  }
}, {
  // options
    timestamps: false
});

searchApi(app, Product);
