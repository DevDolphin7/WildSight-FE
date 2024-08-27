import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { getINatObservationById } from "../app/iNaturalist-api";
import { useRoute } from "@react-navigation/native";
import { getSightingById } from "@/app/WildSight-api";

export default function SingleWildlife() {
	const [singleWildlife, setSingleWildlife] = useState({});
	const route = useRoute();
	const { iNatId, WildSightSightingId } = route.params;
	// console.log(WildSightSightingId);
	// we will need to also bring in the sighting_id from any clicked WildSight sightings on the map or in users personal list
	if (iNatId) {
		useEffect(() => {
			getINatObservationById(iNatId)
				.then((observation) => {
					setSingleWildlife(observation);
				})
				.catch((error) => console.log(error));
		}, [iNatId]);
	}
	if (WildSightSightingId) {
		useEffect(() => {
			getSightingById(WildSightSightingId)
				.then((sighting) => {
					console.log("SWL hello", sighting);
					setSingleWildlife(sighting);
				})
				.then(() => {
					console.log("SWL", singleWildlife);
				});
		}, [WildSightSightingId]);
	}

	return (
		<ScrollView>
			{!WildSightSightingId && !iNatId ? (
				<View>No sighting ID found</View>
			) : (
				<View style={styles.container}>
					{WildSightSightingId ? (
						<View>
							<Text style={styles.speciesGuess}>
								{singleWildlife?.common_name}
							</Text>
							<Text style={styles.observerInfo}>User ID: {}</Text>
							<Image
								source={{
									uri: singleWildlife?.uploaded_image,
								}}
								style={styles.fullWidthImage}
							/>
							<Text style={styles.summaryTitle}>Wikipedia Summary:</Text>
							<Text style={styles.summaryText}>
								{singleWildlife?.wikipedia_url
									? singleWildlife?.wikipedia_url.replace(/<\/?[^>]+(>|$)/g, "")
									: null}
							</Text>
						</View>
					) : null}
					{iNatId ? (
						<View>
							<Text style={styles.speciesGuess}>
								{singleWildlife.species_guess}
							</Text>
							<Text style={styles.observerInfo}>
								{singleWildlife.user?.name
									? `Observer: ${singleWildlife.user.name}`
									: null}
							</Text>
							<Text style={styles.observationsCount}>
								Observations: {singleWildlife.user?.observations_count}
							</Text>
							{singleWildlife.taxon?.default_photo?.medium_url && (
								<Image
									source={{
										uri: singleWildlife.taxon.default_photo.medium_url,
									}}
									style={styles.fullWidthImage}
								/>
							)}
							<Text style={styles.summaryTitle}>Wikipedia Summary:</Text>
							<Text style={styles.summaryText}>
								{singleWildlife.taxon?.wikipedia_summary.replace(
									/<\/?[^>]+(>|$)/g,
									""
								)}
							</Text>
							<View style={styles.observationPhotosContainer}>
								<Text style={styles.photosTitle}>User Photos:</Text>
								{singleWildlife.observation_photos?.map((photo, index) => (
									<Image
										key={index}
										source={{ uri: photo.photo.url }}
										style={styles.smallPhoto}
									/>
								))}
							</View>
						</View>
					) : null}

				</View>
			)}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 15,
	},
	speciesGuess: {
		fontSize: 28,
		fontWeight: "bold",
	},
	fullWidthImage: {
		height: 250,
		marginBottom: 20,
	},
	observerInfo: {
		marginTop: 10,
	},
	observationsCount: {
		marginBottom: 10,
	},
	summaryTitle: {
		fontSize: 22,
		fontWeight: "bold",
		marginTop: 10,
	},
	summaryText: {
		fontSize: 16,
		marginTop: 10,
	},
	observationPhotosContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		marginTop: 20,
	},
	photosTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 10,
	},
	smallPhoto: {
		width: 60,
		height: 60,
		margin: 5,
	},
});
