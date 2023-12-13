const path = `${import.meta.env.VITE_API_URL}/cities` ;
export async function getCities(name){
  try {
    console.log(`${path}/?name=${name}`)
    const respose = await fetch(`${path}/?name=${name}`,{
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
