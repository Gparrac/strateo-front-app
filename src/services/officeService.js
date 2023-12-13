const path = `${import.meta.env.VITE_API_URL}/office` ;
export async function getShortOffices(){
  try {
    const respose = await fetch(`${path}/?format=short`,{
      method: "GET",
    });
    if(respose.status != 200){
      throw Error('Error en el fetch');
    }
    const data = await respose.json();

    return data;

  } catch (error) {
    console.error(error);
  }
}
