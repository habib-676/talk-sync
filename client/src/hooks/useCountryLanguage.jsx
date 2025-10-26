import { useState, useEffect } from "react";

export const useCountryLanguage = () => {
  const [countries, setCountries] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,flags,cca2,languages,flag"
        );
        const data = await res.json();

        // Format countries with languages
        const formattedCountries = data
          .map((country) => ({
            name: country.name.common,
            flag: country.flags.png,
            flagEmoji: country.flag,
            code: country.cca2,
            languages: country.languages
              ? Object.values(country.languages)
              : [],
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(formattedCountries);

        // Extract unique global language list
        const allLanguages = data.flatMap((c) =>
          c.languages ? Object.values(c.languages) : []
        );
        const uniqueLanguages = [...new Set(allLanguages)].sort();
        setLanguages(uniqueLanguages);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { countries, languages, loading, error };
};
