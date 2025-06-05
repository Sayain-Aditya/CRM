
// import React, {createContext, useContext, useEffect, useState } from 'react'

// const HotelContext = createContext();

// export const useHotels = () => useContext(HotelContext);
// export const HotelProvider = ({ children }) => {

//   const [hotels, setHotels] = useState(() =>{
//     const stored = localStorage.getItem("hotels");
//     return stored ? JSON.parse(stored) : [];
//   })

// const addHotel = (name) =>{
//   const updated = [...hotels, name];
//   setHotels(updated)
//   localStorage.setItem("hotels", JSON.stringify(updated))
// };
//   useEffect(() => {
//     localStorage.setItem("hotels", JSON.stringify(hotels));
//   }, [hotels])

//   return(
//     <HotelContext.Provider value={{hotels, addHotel}}>
//      {children}
//     </HotelContext.Provider>
//   );
// }

// export default HotelContext
