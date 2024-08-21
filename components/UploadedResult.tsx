import axios from "axios";

export const UploadedResult = () => {
  //Plant Name back from AI
  let scientificName = "Narcissus pseudonarcissus"; //must change this to marry up with the AI response.
  let family = "";
  let species = "";

  function splitString(inputString: string): void {
    const [f, ...rest] = inputString.split(" ");
    family = f;
    species = rest.join(" ");
  }

  splitString(scientificName);

  //parametic endpoint of /taxa
  let url = `https://api.inaturalist.org/v1/taxa?q=${family}%20${species}&per_page=1&order=desc&order_by=observations_count`;

  return axios
    .get<ApiResponse>(url)
    .then((apiResponse) => {
      const extractedData = extractData(apiResponse.data);
      console.log(extractedData);
      return extractedData;
    })
    .catch((error) => {
      console.error("Error fetching data from API:", error);
    });

  interface Record {
    preferred_common_name: string;
    wikipedia_url: string;
  }

  interface Results {
    record: Record;
  }

  interface ApiResponse {
    results: Results[];
  }

  function extractData(data: ApiResponse) {
    const result = data.results[0].record;
    const preferredCommonName = result.preferred_common_name;
    const wikipediaUrl = result.wikipedia_url;

    return {
      preferredCommonName,
      wikipediaUrl,
    };
  }
};
