import React, { useState, useEffect } from "react";
import MapView, {
	PROVIDER_GOOGLE,
	Heatmap,
	Marker,
	Region,
	Callout,
} from "react-native-maps";
import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import * as Location from "expo-location";
import { getINatObservations } from "../iNaturalist-api";
import { Link } from "expo-router";

export default function Map() {
	const [points, setPoints] = useState([
		{ latitude: 50.2025577053117, longitude: -5.140539490248174, weight: 1 },
	]);
	const [zoomLevel, setZoomLevel] = useState<number>(15);
	const [region, setRegion] = useState(null);
	const [selectedMarker, setSelectedMarker] = useState(null);

	useEffect(() => {
		Location.requestForegroundPermissionsAsync()
			.then(() => {
				return Location.getCurrentPositionAsync({});
			})
			.then((data) => {
				const latitude = data.coords.latitude;
				const longitude = data.coords.longitude;
				setRegion({
					latitude,
					longitude,
					latitudeDelta: 0.035,
					longitudeDelta: 0.035,
				});
				setTimeout(() => {}, 200);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	useEffect(() => {
		if (!region) return;
		const nelat = region.latitude + region.latitudeDelta / 2;
		const nelng = region.longitude + region.longitudeDelta / 2;
		const swlat = region.latitude - region.latitudeDelta / 2;
		const swlng = region.longitude - region.longitudeDelta / 2;
		getINatObservations(nelat, nelng, swlat, swlng, 200)
			.then((observations) => {
				const newPoints = observations.map((observation: any) => {
					const imageUrl = observation.taxon?.default_photo?.medium_url;
					return {
						latitude: observation.geojson.coordinates[1],
						longitude: observation.geojson.coordinates[0],
						weight: 1,
						imageUrl: imageUrl,
						species_guess: observation.species_guess,
						id: observation.id,
						//shall we add in some more deets here?
					};
				});
				setPoints(newPoints);
			})
			.catch((error) => {
				console.error(error);
			});
	}, [region]);

	const handleRegionChangeComplete = (newRegion: Region) => {
		const newZoomLevel =
			Math.log(
				360 / Math.max(newRegion.longitudeDelta, newRegion.latitudeDelta)
			) / Math.LN2;
		setZoomLevel(newZoomLevel);
		setRegion(newRegion);
	};

	const handleMarkerPress = (marker) => {
		setSelectedMarker(marker);
	};

	const handleClose = () => {
		setSelectedMarker(null);
	};
	return (
		<View style={styles.container}>
			{region ? (
				<MapView
					provider={PROVIDER_GOOGLE}
					style={styles.map}
					initialRegion={region}
					onRegionChangeComplete={handleRegionChangeComplete}
				>
					{zoomLevel < 17 ? (
						<Heatmap
							radius={30}
							opacity={1}
							points={points.map((point) => ({
								latitude: point.latitude,
								longitude: point.longitude,
								weight: point.weight,
							}))}
						/>
					) : (
						points.map((point, index) => (
							<Marker
								key={index}
								coordinate={{
									latitude: point.latitude,
									longitude: point.longitude,
								}}
								onPress={() => handleMarkerPress(point)}
							>
								<Callout>
									<View>
										<Text>{point.species_guess || "Unknown"}</Text>
									</View>
								</Callout>
							</Marker>
						))
					)}
				</MapView>
			) : null}

			{selectedMarker ? (
				<View style={styles.sightingInfoContainer}>
					{selectedMarker.imageUrl ? (
						<Image
							source={{ uri: selectedMarker.imageUrl }}
							style={styles.popUpImage}
						/>
					) : null}
					<View style={styles.sightingTextContainer}>
						<View style={styles.headerRow}>
							<Text>Species: {selectedMarker.species_guess}</Text>
							<Pressable onPress={handleClose} style={styles.closeButton}>
								<Text style={styles.closeButtonText}>X</Text>
							</Pressable>
						</View>
						<Pressable style={styles.button}>
							<Link
								href={{
									pathname: "/SingleWildlife",
									params: { iNatId: selectedMarker.id },
								}}
							>
								<Text style={styles.buttonText}>View Details</Text>
							</Link>
						</Pressable>
					</View>
				</View>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	map: {
		width: "100%",
		height: "100%",
	},
	sightingInfoContainer: {
		position: "absolute",
		bottom: 60,
		flexDirection: "row",
		backgroundColor: "white",
		padding: 10,
	},
	popUpImage: {
		width: 100,
		height: 100,
		marginRight: 10,
	},
	sightingTextContainer: {
		flex: 1,
	},
	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	closeButton: {
		backgroundColor: "#d6d6d6",
		borderRadius: 15,
		width: 30,
		height: 30,
		justifyContent: "center",
		alignItems: "center",
	},
	closeButtonText: {
		color: "white",
		fontSize: 14,
	},
	button: {
		backgroundColor: "green",
		paddingVertical: 5,
		paddingHorizontal: 10,
		marginTop: 10,
		alignSelf: "flex-start",
	},
	buttonText: {
		color: "white",
		fontSize: 15,
	},
});
