export const setUser =(data)=>{
    console.log('userdata-->',data);
    
     localStorage.setItem('user',JSON.stringify(data))
}


export const  getUser = ()=>{
 const user = JSON.parse(localStorage.getItem('user'))
 if(user) return user
 
 
}

