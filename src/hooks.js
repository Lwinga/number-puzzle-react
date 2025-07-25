import { useEffect, useState } from "react";

export function useLocalStorage(initialData) {

  const [data, setData] = useState(null);

  useEffect(() => {
    if (initialData && !localStorage.getItem(Object.keys(initialData)[0])) {
      //  Populate the localStorage with initialData
      setData(initialData);
    } else {
      // Read all data from localStorage
      const localStorageData = {};
      Object.entries(localStorage).forEach(([key, value]) => {
        localStorageData[key] = value;
      });
      setData(localStorageData);
    }
  }, []);

  useEffect(() => {
    if (data !== null) {
      //  Update localStorage with the latest data
      Object.entries(data).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
    }
  }, [data]);

  return [
    data,
    d => setData({ ...data, ...d }),
  ];
}
