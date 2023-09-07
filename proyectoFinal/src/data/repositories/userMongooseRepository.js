import userSchema from "../models/user.model.js";

class UserMongooseRepository
{
  async paginate(paginate)
  {
    const { limit, page } = paginate;
    const userDocuments = await userSchema.paginate({}, { limit, page });

    userDocuments.docs = userDocuments.docs.map(document => ({
      id: document._id,
      firstName: document.firstName,
      lastName: document.lastName,
      email: document.email,
      age: document.age,
      isAdmin: document.isAdmin
    }));

    return userDocuments;
  }

  async getOne(id)
  {
    const userDocument = await userSchema.findOne({ _id: id });

    if(!userDocument)
    {
      throw new Error('User dont exist.');
    }

    return {
        id: userDocument?._id,
        firstName: userDocument?.firstName,
        lastName: userDocument?.lastName,
        email: userDocument?.email,
        age: userDocument?.age,
        password: userDocument?.password,
        isAdmin: userDocument.isAdmin,
        role: userDocument.role
    }
  }

  async getOneByEmail(email)
  {
    const userDocument = await userSchema.findOne({ email });
  
    return {
        id: userDocument?._id,
        firstName: userDocument?.firstName,
        lastName: userDocument?.lastName,
        email: userDocument?.email,
        age: userDocument?.age,
        password: userDocument?.password,
        isAdmin: userDocument?.isAdmin,
        role: userDocument.role          
    }
  }

  async create(data)
  {
    const userDocument = await userSchema.create(data);

    return {
        id: userDocument._id,
        firstName: userDocument.firstName,
        lastName: userDocument.lastName,
        email: userDocument.email,
        age: userDocument.age,
        cart: userDocument.cart,
        role: userDocument.role,
        password: userDocument.password,
        isAdmin: userDocument?.isAdmin,
        lastConnection: userDocument.lastConnection,
        documents: userDocument.documents,
    }
  }

  async updateOne(id, data)
  {
    const userDocument = await userSchema.findOneAndUpdate({ _id: id }, data, { new: true});

    if(!userDocument)
    {
      throw new Error('User dont exist.');
    }

    return {
        id: userDocument._id,
        firstName: userDocument.firstName,
        lastName: userDocument.lastName,
        email: userDocument.email,
        age: userDocument.age,
        isAdmin: userDocument?.isAdmin,
        lastConnection: userDocument.lastConnection
    }
  }

  async deleteOne(id)
  {
    return userSchema.deleteOne({ _id: id });
  }
}

export default UserMongooseRepository;
