import roleSchema from "../models/role.model.js";

class RoleMongooseRepository
{
  async paginate(paginate){
    try {
        const { limit = 10, page = 1, sort, query } = paginate;
        const options = {
            limit,
            page,
            sort: sort && { price: SORTVALUE[sort] },
        };

        const { docs, ...rest } = await roleSchema.paginate(query, options)
        const roles = docs.map(item => ({
            id: item._id,
            title: item.title,
            name: item.name,
            permissions: item.permissions
        }));
        if(page > rest.totalPages || page < 0 || isNaN(page) )
        { return console.log({ message: `Error al ingresar el numero de pagina.` });}

        rest.prevLink = rest.hasPrevPage ? `http://localhost:8080/api/products?page=${rest.prevPage}&limit=${limit}&sort=${sort}` : ''
        rest.nextLink = rest.hasNextPage ? `http://localhost:8080/api/products?page=${rest.nextPage}&limit=${limit}&sort=${sort}` : ''

        return { payload: roles, ...rest };
    } catch (error) {
        throw new Error('Error al realizar la paginacion.');
    }
}

  async getOne(id)
  {
    const roleDocument = await roleSchema.findOne({ _id: id });

    if(!roleDocument)
    {
      throw new Error('Role dont exist.');
    }

    return {
        id: roleDocument?._id,
        name: roleDocument?.name,
        permissions: roleDocument?.permissions
    }
  }

  async create(data)
  {
    const roleDocument = await roleSchema.create(data);

    return {
        id: roleDocument._id,
        name: roleDocument.name,
        permissions: roleDocument.permissions
    }
  }

  async updateOne(id, data)
  {
    const roleDocument = await roleSchema.findOneAndUpdate({ _id: id }, data, { new: true});

    if(!roleDocument)
    {
      throw new Error('Role dont exist.');
    }

    return {
        id: roleDocument._id,
        name: roleDocument.name,
        permissions: roleDocument.permissions
    }
  }

  async createRoleByName(role)
  {
      let permissions;
      if (role === 'client')
      {
          permissions = client;
      }
      else if (role === 'premium')
      {
          permissions = premium;
      }
          const dto = {
              name : role,
              permissions
          };

      const document = await roleSchema.create(dto);
      return {
          id: document._id,
          name: document.name,
          permissions: document.permissions
      };
  }

  async deleteOne(id)
  {
    return roleSchema.deleteOne({ _id: id });
  }
}

export default RoleMongooseRepository;
