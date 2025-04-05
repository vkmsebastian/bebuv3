import { useEffect, useState } from "react";

export default function useListLogic() {
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState(null);
  const searchUrl = process.env.NEXT_PUBLIC_SPOTIFY_SEARCH_URL;

  const handleSearchItemClick = async (uri) => {
    const requestUrl = "https://api.spotify.com/v1/me/player/play?";
    const params = new URLSearchParams({
      device_id: localStorage.getItem("spotify_device_id") ?? "",
    }).toString();

    console.log("URI:", params);

    const response = await fetch(`${requestUrl}${params}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("spotify_access_token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        context_uri: "spotify:album:1Je1IMUlBXcx1Fz0WE7oPT",
        offset: { position: 0 },
        position_ms: 0,
      }),
    });

    console.log("Response:", response);
  };

  useEffect(() => {
    if (searchInput.length > 0) {
      const searchParams = new URLSearchParams({
        q: searchInput,
        type: "track,artist,album",
        limit: "10",
      }).toString();

      const fetchSearchResults = async () => {
        try {
          const response = await fetch(`${searchUrl}${searchParams}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "spotify_access_token"
              )}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            setSearchResults(data);
          }
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      };
      fetchSearchResults();
    }
  }, [searchInput, searchUrl]);

  return {
    searchInput,
    setSearchInput,
    searchResults,
    setSearchResults,

    handleSearchItemClick
  };
}
