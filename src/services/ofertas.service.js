import { sequelize } from "../databases/databases.js";

const createOferta = async (body) => {
    console.log("cuerpo de la oferta en el servicio: ", body)
    try {
        const createdOferta = await sequelize.models.Ofertas.create({
            nombre: body.nombre,
            precioSinOferta: body.precioSinOferta,
            precioConOferta: body.precioConOferta,
            idSubCategoria: body.idSubCategoria,
            descripcion: body.descripcion
        })

        // Obtiene las medidas basadas en los IDs proporcionados (medidas = [1,2,3])
        const medidas = await sequelize.models.Medidas.findAll({
            where: {
                id: body.medidas
            },
        })

        // Crea los registros en la tabla Medidas_Productos
        await Promise.all(medidas.map((medida) =>
            createdOferta.addMedidas(medida)
        ));

        return createdOferta.dataValues
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') { // si viola las restricciones UNIQUE de nombre de producto
            // Manejar el error de restricción única
            return { error: 'Ya existe una oferta con ese nombre' };
        } else {
            // Manejar otros errores
            console.log("ERROR AL CREAR OFERTA: ", error);
            return { error: 'Error al crear la oferta.' };
        }
    }
}   

const getSeccionOfertas = async () => {
   const categorias = await sequelize.models.Categorias_Ofertas.findAll({
         include: {
              model: sequelize.models.SubCategorias_Ofertas,
              include: {
                model: sequelize.models.Ofertas,
                include: [
                    {
                        model: sequelize.models.Fotos_Ofertas
                    },
                    {
                        model: sequelize.models.Medidas,
                        attributes: ['id', 'nombre'],
                    }
                ],
              }
         }
   })

   return categorias.map(categoria => {
        return {
            id: categoria.id,
            nombre: categoria.nombre,
            subcategorias: categoria.SubCategorias_Ofertas.map(subcategoria => {
                return {
                    id: subcategoria.id,
                    nombre: subcategoria.nombre,
                    ofertas: subcategoria.Ofertas.map(oferta => {
                        return {
                            id: oferta.id,
                            nombre: oferta.nombre,
                            precioSinOferta: oferta.precioSinOferta,
                            precioConOferta: oferta.precioConOferta,
                            descripcion: oferta.descripcion,
                            fotos: oferta.Fotos_Ofertas.map(foto => {
                                return {
                                    id: foto.id,
                                    url: foto.url
                                }
                            }),
                            medidas: oferta.Medidas.map(medida => {
                                return {
                                    id: medida.id,
                                    nombre: medida.nombre
                                }
                            })
                        }
                    })
                }
            })
        }
   })
}

const updateOferta = async (id, body) => {
    try {
        const ofertaAActualizar = await sequelize.models.Ofertas.findByPk(id);
        if (!ofertaAActualizar) return { error: "No existe esa oferta" };

        ofertaAActualizar.nombre = body.nombre;
        ofertaAActualizar.precioSinOferta = body.precioSinOferta;
        ofertaAActualizar.precioConOferta = body.precioConOferta;
        ofertaAActualizar.descripcion = body.descripcion;

        // borrar las medidas asociadas al profesional encontrado
        await sequelize.models.Medidas_Ofertas.destroy({
            where: {
                OfertaId: id
            }
        });

        for (const idMedida of body.nuevasMedidas) {
            await sequelize.models.Medidas_Ofertas.create({
                OfertaId: id,
                MedidaId: idMedida
            });
        }


        await ofertaAActualizar.save();
    } catch (error) {
        console.log("error en update: ", error);
        if (error.name === 'SequelizeUniqueConstraintError') { // si viola las restricciones UNIQUE de nombre de producto
            // Manejar el error de restricción única
            return { error: 'Ya existe una oferta con ese nombre' };
        } else {
            // Manejar otros errores
            console.log("ERROR AL CREAR OFERTA: ", error);
            return { error: 'Error al crear la oferta.' };
        }
    }
}

const deleteOferta = async (id) => {
    try {
        const ofertaABorrar = await sequelize.models.Ofertas.findByPk(id);
        if (!ofertaABorrar) {
            return { error: 'No existe una oferta con ese id.' };
        }

        await sequelize.models.Medidas_Ofertas.destroy({
            where: {
                OfertaId: id
            }
        });

        await sequelize.models.Fotos_Ofertas.destroy({
            where: {
                idOferta: id
            }
        });

        await sequelize.models.Ofertas.destroy({
            where: {
                id: id
            }
        })

        return { message: 'Oferta eliminada con éxito' }
    } catch (error) {
        // Manejar otros errores
        console.log("ERROR AL ELIMINAR OFERTA: ", error);
        return { error: 'Error al eliminar la oferta.' };
    }
}

const ofertas_services = {
    createOferta,
    getSeccionOfertas,
    updateOferta,
    deleteOferta
}

export { ofertas_services }