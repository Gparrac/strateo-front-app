const path = `${import.meta.env.VITE_API_URL}`;
export async function signIn(user){
  return true;
  // try {
  //   const response = await fetch(`${path}/sign-in`,{
  //     method: "POST",
  //     body: user,
  //   });
  //   if(!response.ok){
  //     throw Error('Fallo de conexión!')
  //   }
  //   const data = await response.json();
  //   return data;

  // } catch (error) {
  //   console.error(error);
  //   return false;
  //}
}
