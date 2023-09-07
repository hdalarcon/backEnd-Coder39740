import roleSchema from "../models/role.model.js";

class RoleMongooseRepository
{
  async paginate(criteria)
  {
    const { limit, page } = criteria;
    const roleDocuments = await roleSchema.paginate({}, { limit, page });

    roleDocuments.docs = roleDocuments.docs.map(document => ({
      id: document._id,
      name: document.name,
      permissions: document.permissions
    }));

    return roleDocuments;
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
