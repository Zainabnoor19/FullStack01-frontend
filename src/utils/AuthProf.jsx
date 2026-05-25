// export const setUser =(data)=>{
//     console.log('userdata-->',data);
    
//      localStorage.setItem('user',JSON.stringify(data))
// }


// export const  getUser = ()=>{
//  const user = JSON.parse(localStorage.getItem('user'))
//  if(user) return user
 
 
// }

export const setUser = (data) => {
    console.log('Saving user to localStorage:', data?.name);
    localStorage.setItem('user', JSON.stringify(data));
}

export const getUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            console.log('Retrieved user from localStorage:', user?.name);
            return user;
        } catch (e) {
            console.log('Error parsing user');
            return null;
        }
    }
    return null;
}