// import React, { useEffect, useState, createContext, useContext } from 'react'
//   const ContextDestination = createContext();

//   export const useDestination = () =>useContext(ContextDestination);

//   export const DestinationProvider = ({children}) => {
//     const [destinations, setDestinations] = useState(() =>{
//         const stored  = localStorage.getItem("destinations");
//         return stored ? JSON.parse(stored): []
//     })

//     const addDestination = (name)=> {
//         const update = [...destinations, name];
//         setDestinations(update)
//         localStorage.setItem("destinations" .JSON.stringify(update))
//     };
//     useEffect(() => {
//         localStorage.setItem("destinations", JSON.stringify(destinations));
//       }, [destinations])
// return(
//     <ContextDestination.Provider value={{destinations, addDestination}}>
//         {children}
//     </ContextDestination.Provider>
// )
//   }

// export default ContextDestination