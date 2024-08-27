import axios from "axios";

interface FormValues {
  username: string;
  email: string;
  password: string;
}

const apiClient = axios.create({
  baseURL: "",
});

export const postSighting = (
  lat: number,
  long: number,
  scientificName: string,
  commonName: string,
  wiki_url: string,
  photoUri: string
) => {
  const sightingObj = {
    uploaded_image: photoUri,
    long_position: long,
    lat_position: lat,
    common_name: commonName,
    taxon_name: scientificName,
    wikipedia_url: wiki_url,
  };

  return apiClient
    .post("endpoint", sightingObj)
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const postUser = (values: FormValues, handleSuccess: Function): void => {
  axios
    .post("https://wildside-be.onrender.com/api/users/", values)
    .then(() => handleSuccess(values))
    .catch((error) => {
      alert(error.response.data.message);
    });
};
