export default function ({store,route,redirect}){
    const user = store.state.users.user
    const blockedRouteUser = /\/payment\/*/g
    const blockedRoute = /\/admin\/*/g
    const homeRoute = "/"
    console.log(user);

    // if (user) {
    //     if(user.email !== 'test@gmail.com'){
    //         if(route.path.match(blockedRoute)){
    //             redirect("/shop")

    //         }
    //     }  
        
    // }

    // if (!user) {
    //     if (route.path.match(blockedRouteUser)) {
    //         redirect("/login")
    //     }
    //     if (route.path.match(blockedRoute)) {
    //         redirect("/login")
            
    //     }
    // }
    
  

}