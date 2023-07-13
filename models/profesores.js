'use strict';
module.exports = (sequelize, DataTypes) => {
  const profesores = sequelize.define('profesores', {
    nombre: DataTypes.STRING,
    dni: DataTypes.STRING
  }, {});
  profesores.associate = function (models) {
    profesores.hasMany(models.materia, {
      as: "materias-de-profesor",
      foreignKey: "id_profesor",
    });
    // associations can be defined here
  };
  return profesores;
};