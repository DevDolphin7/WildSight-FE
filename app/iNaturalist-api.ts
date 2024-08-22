import axios from "axios";

const inatApi = axios.create({
	baseURL: "https://api.inaturalist.org/v1/",
});

export const getINatObservations = (
	nelat: number,
	nelng: number,
	swlat: number,
	swlng: number,
	per_page: number
) => {
	const d1 = "2021-08-20";
	const d2 = "2024-08-20";

	return inatApi
		.get("/observations", {
			params: { d1, d2, nelat, nelng, swlat, swlng, per_page },
		})
		.then((response) => {
			return response.data.results;
		})
		.catch((error) => {
			console.log("Error getting iNat observations:", error);
		});
};

export const getINatObservationById = (id: number) => {
	return inatApi
		.get(`/observations/${id}`)
		.then((response) => {
			return response.data.results[0];
		})
		.catch((error) => {
			console.log("Error getting unique observation:", error);
		});
};

export const getObservIdBySciName = (scientificName: string) => {
	return inatApi
		.get(`/observations/?q=${scientificName}&per_page=1`)
		.then((response) => {
			return response.data.results[0].id;
		})
		.catch((error) => {
			console.log("Error getting observations by scientific name", error);
		});
};

/*to go into AiSingleResultcard
-----top---
import {
	getINatObservationById,
	getObservIdBySciName,
} from "@/app/iNaturalist-api";
----in handleSubmit function----
		getObservIdBySciName(scientificName).then((iNatId) => {
			console.log(iNatId);
			getINatObservationById(iNatId).then((observation) => {
				console.log(observation.taxon.wikipedia_summary);
			});
		});
*/
