import axios from "axios";

interface SignUpFormValues {
  username: string;
  email: string;
  password: string;
}

interface LoginFormValues {
  usernameOrEmail: string;
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

export const postUser = (
  values: SignUpFormValues,
  handleSuccess: Function
): void => {
  axios
    .post("https://wildside-be.onrender.com/api/users/", values)
    .then((response) => handleSuccess(values, response.data.user))
    .catch((error) => {
      alert(error.response.data.message);
    });
};

export const postLoginAttempt = (
  values: LoginFormValues,
  handleSuccess: Function
): void => {
  axios
    .post("https://wildside-be.onrender.com/api/users/login", values)
    .then((response) => handleSuccess(response.data.user))
    .catch((error) => {
      alert(error.response.data.message);
    });
};
