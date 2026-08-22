import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// In Android emulator, 10.0.2.2 points to host machine localhost.
// In iOS simulator or web, localhost works.
const DEFAULT_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';

const client = axios.create({
  baseURL: `${DEFAULT_HOST}/api`,
  timeout: 10000,
});

export const setApiBaseUrl = async (url) => {
  if (url) {
    client.defaults.baseURL = `${url}/api`;
    await AsyncStorage.setItem('farmconnect_custom_api_url', url);
  }
};

// Auto-load custom API URL if saved
(async () => {
  try {
    const saved = await AsyncStorage.getItem('farmconnect_custom_api_url');
    if (saved) {
      client.defaults.baseURL = `${saved}/api`;
    }
  } catch (e) {}
})();

export default client;
