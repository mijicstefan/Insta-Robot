import axios from "axios";


//Adapter
const request = async (config) => {
  config.headers = {
      ...config.headers,
      'Content-Type':'application/json'
  };
  const { data } = await axios(config);
  return data;
};


export default request;