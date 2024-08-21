export type RootStackParamList = {
  Camera: undefined;
  PhotoPreview: {
    photoUri: string;
    latPosition: number;
    longPosition: number;
  };
  PlantIdentification: {
    photoUri: string;
    latPosition: number;
    longPosition: number;
  }
  AiResult: {
    data: any; 
    latPosition: number;
    longPosition: number;
    photoUri: string;
  };
};