import axios from 'axios';
import { HEALTH_URL } from '../config/api';

export const checkApiHealth = async () => {
  const { data } = await axios.get(HEALTH_URL, { timeout: 5000 });
  return data;
};
