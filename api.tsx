
import axios from "axios";

const apiClient = axios.create({
    baseURL: "",
  });

export const postSighting = (lat: number, long: number, scientificName: string, commonName: string, wiki_url: string, photoUri: string) => {
    const sightingObj = {
        uploaded_image: photoUri,
        long_position: long,
        lat_position: lat,
        common_name: commonName,
        taxon_name: scientificName,
        wikipedia_url: wiki_url
    }

    return apiClient.post('endpoint', sightingObj).then((response) => {
        console.log(response)
    }).catch((err) => {
        console.log(err)
    })

}