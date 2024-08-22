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
