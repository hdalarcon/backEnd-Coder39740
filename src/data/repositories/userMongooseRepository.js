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
      isAdmin: document.isAdmin,
      role: document.role,
      cart: document.cart,
      lastConnection: document.lastConnection,
      documents: document.documents,  
    }));

    return userDocuments;
  }

  async getOne(id)
  {
    const userDocument = await userSchema.findOne({ _id: id }).populate(['role cart']);

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
        role: userDocument.role,
        cart: userDocument.cart,
        lastConnection: userDocument.lastConnection,
        documents: userDocument.documents,  
        
    }
  }

  async getOneByEmail(email)
  {
    const userDocument = await userSchema.findOne({ email }).populate(['role cart']);
  
    return {
        id: userDocument?._id,
        firstName: userDocument?.firstName,
        lastName: userDocument?.lastName,
        email: userDocument?.email,
        age: userDocument?.age,
        password: userDocument?.password,
        isAdmin: userDocument?.isAdmin,
        role: userDocument?.role,
        cart: userDocument?.cart,
        lastConnection: userDocument?.lastConnection,
        documents: userDocument?.documents,
    }
  }

  async create(data)
  {
    const userDocument = await userSchema.create(data);
    const uDocument= await userSchema.findById(userDocument._id).populate('cart role').exec();

    return {
        id: uDocument._id,
        firstName: uDocument.firstName,
        lastName: uDocument.lastName,
        email: uDocument.email,
        age: uDocument.age,
        cart: uDocument.cart,
        role: uDocument.role,
        password: uDocument.password,
        isAdmin: uDocument?.isAdmin,
        lastConnection: uDocument.lastConnection,
        documents: uDocument.documents,
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
        cart: userDocument.cart,
        role: userDocument.role,
        isAdmin: userDocument?.isAdmin,
        documents: userDocument.documents,
        lastConnection: userDocument.lastConnection
    }
  }

  async updateConnection(id, data)
  {
      const userDocument = await userSchema.findOneAndUpdate({ _id: id }, data, { new: true });
      
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
          password: userDocument.password,
          cart: userDocument.cart,
          role: userDocument.role,
          isAdmin: userDocument.isAdmin,
          documents: userDocument.documents,
          lastConnection: userDocument.lastConnection
      };
  }

  async deleteOne(id)
  {
    return userSchema.deleteOne({ _id: id });
  }
}

export default UserMongooseRepository;
