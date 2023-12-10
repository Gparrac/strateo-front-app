const path = `${import.meta.env.VITE_API_URL}/user-parameterization` ;
export async function getUsers(){
  try {

    const respose = await fetch(`${path}`,{
      method: "GET",
    });
    const data = await respose.json();
    return data.data;

  } catch (error) {
    console.error(error);
  }
}
