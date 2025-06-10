// CarContext.js
import React, { createContext, useState, useEffect } from "react";

export const CarContext = createContext();

export const CarProvider = ({ children }) => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("cars");
    if (saved) setCars(JSON.parse(saved));
  }, []);

  const addCar = (car) => {
    const updated = [...cars, car];
    setCars(updated);
    localStorage.setItem("cars", JSON.stringify(updated));
  };

  const deleteCar = (index) => {
    const updated = cars.filter((_, i) => i !== index);
    setCars(updated);
    localStorage.setItem("cars", JSON.stringify(updated));
  };

  return (
    <CarContext.Provider value={{ cars, addCar, deleteCar }}>
      {children}
    </CarContext.Provider>
  );
};
