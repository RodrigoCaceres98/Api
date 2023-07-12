'use strict';
module.exports = (sequelize, DataTypes) => {
  const inscripciones = sequelize.define('inscripciones', {
    nombre: DataTypes.STRING,
    dni: DataTypes.STRING,
    fecha: DataTypes.STRING
  }, {});
  inscripciones.associate = function(models) {
    // associations can be defined here
  };
  return inscripciones;
};