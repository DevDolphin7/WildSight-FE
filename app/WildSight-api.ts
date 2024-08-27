import axios from "axios";

const wildSightApi = axios.create({
  baseURL: "https://wildside-be.onrender.com/api",
});

export const addUserSighting = (user_id: number, userSighting: any) => {
  return wildSightApi
    .post(`/sightings/user/${user_id}`, userSighting)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("Error:", error);
    });
};

export const getSightingById = (sighting_id: number) => {
  return wildSightApi.get(`/sightings/${sighting_id}`).then((response) => {
    return response.data.sighting;
  });
};

export const getFavouritesById = (user_id: number) => {
  return wildSightApi.get(`/mywildlife/users/${user_id}`).then((response) => {
    return response.data.wildlife;
  });
};

export const deleteFavouritesById = (user_id: number, sighting_id: number) => {
  return wildSightApi
    .delete(`/mywildlife/${sighting_id}/users/${user_id}`)
    .then((response) => {
      return response.data;
    });
};

export const addFavouritesById = (user_id: number, sighting_id: number) => {
  return wildSightApi
    .post(`/mywildlife/${sighting_id}/users/${user_id}`)
    .then((response) => {
      return response.data;
    });
};

export const getSightingsByUserId = (
  user_id: Number,
  nelat: number,
  nelng: number,
  swlat: number,
  swlng: number
) => {
  return wildSightApi
    .get(
      `/sightings/user/${user_id}?swlat=${swlat}&swlong=${swlng}&nelat=${nelat}&nelong=${nelng}`
    )
    .then((response) => {
      return response.data.sightings;
    });
};
