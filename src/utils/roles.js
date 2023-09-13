const roles = {
    role: ['getRole', 'getRoles', 'putRole', 'deleteRole'],
    user: ['getUsers', 'getUser', 'postUser', 'postCartInUser', 'postUser', 'deleteUser'],
    cart: ['getCarts', 'getCart', 'postCart', 'postProdCart', 'purchase', 'putCart', 'putProdCart', 'deleteProdCart', 'deleteAllProdCart']
};

export const client = [roles.cart[1], roles.cart[2], roles.cart[4], roles.cart[6], roles.cart[7], roles.cart[8]];

export const premium = roles.cart;