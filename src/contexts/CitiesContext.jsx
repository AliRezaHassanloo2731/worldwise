import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const BASE_URL =
  "http://localhost:9000";
const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState(
    []
  );
  const [currentCity, setCurrentCity] =
    useState({});
  const [isLoading, setIsLoading] =
    useState(false);

  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${BASE_URL}/cities`
        );
        const data = await res.json();
        setCities(data);
      } catch {
        alert(
          "there was an error loading data..."
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${BASE_URL}/cities/${id}`
      );
      const data = await res.json();
      setCurrentCity(data);
    } catch {
      alert(
        "there was an error loading data..."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function getFlagEmoji(countryCode) {
    return [
      ...countryCode.toUpperCase(),
    ]
      .map((char) =>
        String.fromCodePoint(
          127397 + char.charCodeAt(0)
        )
      )
      .reduce((a, b) => `${a}${b}`);
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        getFlagEmoji,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(
    CitiesContext
  );
  if (context === undefined)
    throw new Error(
      "useCities must be used within a CitiesProvider"
    );
  return context;
}

export { CitiesProvider, useCities };
