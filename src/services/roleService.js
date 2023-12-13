const path = `${import.meta.env.VITE_API_URL}/role-parameterization` ;
export async function getRoles(){
  try {

    const respose = await fetch(`${path}/`,{
      method: "GET",
    });
    if(respose.status != 200){
      throw Error('Error en el fetch');
    }
    const data = await respose.json();

    return data.data;

  } catch (error) {
    console.error(error);
  }
}
export async function getShortRoles(){
  try {

    const respose = await fetch(`${path}/?format=short`,{
      method: "GET",
    });
    if(respose.status != 200){
      throw Error('Error en el fetch');

    }
    const data = await respose.json();

    return data.data;

  } catch (error) {
    console.error(error);
  }
}
