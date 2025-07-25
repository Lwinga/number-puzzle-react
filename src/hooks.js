import { useEffect, useState } from "react";

// Stores objects and primitives, if keys is array the data is object
export function useLocalStorage(keys, initialData) {

  const [data, setData] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem(Array.isArray(keys) ? keys[0] : keys)) {
      //  Populate the localStorage with initialData
      setData(initialData);
    } else {
      // Retrieve data from localStorage
      if (Array.isArray(keys)) {
        const localStorageData = {};
        keys.forEach(key => localStorageData[key] = localStorage.getItem(key));
        setData(localStorageData);
      } else {
        setData(localStorage.getItem(keys));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data === null) return;
    //  Update localStorage with the latest data
    if (Array.isArray(keys)) {
      keys.forEach(key => localStorage.setItem(key, data[key]));
    } else {
      localStorage.setItem(keys, data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return [
    data && typeof initialData === 'number' ? Number(data) : data,
    Array.isArray(keys) ? d => setData({ ...data, ...d }) : setData,
  ];
}
