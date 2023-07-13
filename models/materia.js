"use strict";
module.exports = (sequelize, DataTypes) => {
  const materia = sequelize.define(
    "materia",
    {
      nombre: DataTypes.STRING,
      id_carrera: DataTypes.INTEGER,
      id_profesor: DataTypes.INTEGER,
    },
    {}
  );

  materia.associate = function (models) {
    //asociacion a carrera (pertenece a:)
    materia.belongsTo(
      models.carrera, // modelo al que pertenece
      {
        as: "Carrera-Relacionada", // nombre de mi relacion
        foreignKey: "id_carrera", // campo con el que voy a igualar
      }
    );

    materia.belongsTo(
      models.profesores, // modelo al que pertenece
      {
        as: "Profesor-Relacionado", // nombre de mi relacion
        foreignKey: "id_profesor", // campo con el que voy a igualar
      }
    );
  };

  return materia;
};