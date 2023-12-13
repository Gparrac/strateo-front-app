const path = `${import.meta.env.VITE_API_URL}` ;
export async function getUsers(){
  try {

    const response = await fetch(`${path}/user-parameterization`,{
      method: "GET",
    });
    if(response.status != 200){
      throw Error('Error en el fetch');
    }
    const data = await response.json();
    return data.data;

  } catch (error) {
    console.error(error);
  }
}

export async function getUser(userId){
  try {

    const response = await fetch(`${path}/user-parameterization?user_id=${userId}`,{
      method: "GET",
    });
    if(response.status != 200){
      throw Error('Error en el fetch');
    }
    const data = await response.json();
    return data.data;

  } catch (error) {
    console.error(error);
  }
}
export async function getTypeDocument(){
  try {

    const response = await fetch(`${path}/type-document-user`,{
      method: "GET",
    });
    if(response.status != 200){
      throw Error('Error en el fetch');
    }
    const data = await response.json();

    return data.data;

  } catch (error) {
    console.error(error);
  }
}
// post methods ⚠️
export async function createUser(user){
  try {
    console.log(user)
    const response = await fetch(`${path}/user-parameterization`,{
      method: "POST",
      body: user,
    });

    const data = await response.json();
    return data;

  } catch (error) {
    console.error(error);
    return false;
  }
}
export async function deleteUsers(users){
  try {

    const response = await fetch(`${path}/user-parameterization`,{
      method: "DELETE",
      body: users
    });
    if(response.status != 200){
      throw Error('Error en el fetch');
    }
    const data = await response.json();
    return data.data;

  } catch (error) {
    console.error(error);
  }
}
export async function updateUser(user){
  console.log('user',user)
  try {

    const response = await fetch(`${path}/user-parameterization`,{
      method: "PUT",
      body: {type_identification:'122222222'}
    });
    if(response.status != 200){
      return data;
    }
    const data = await response.json();
    return data.data;

  } catch (error) {
    console.error(error);
  }
}
