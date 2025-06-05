import axiosInstance from "./axiosInstance";

export const addPhoneNumber = async (payload) => {
    try {
        const response = await axiosInstance.post('http://116.202.210.102:8000/add-phone-number', payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};



export const createPhoneAgent = async (payload) => {
    try {
        const response = await axiosInstance.post('http://116.202.210.102:8000/create-phone-agent', payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const createPhoneCampaign= async (payload) => {
    try {
        const response = await axiosInstance.post('http://116.202.210.102:8000/create-phone-campaign', payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};



export const getPhoneNumber= async () => {
    try {
        const response = await axiosInstance.get('http://116.202.210.102:8000/get-phone-numbers');
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const getPhoneCampaign= async () => {
    try {
        const response = await axiosInstance.get('http://116.202.210.102:8000/get-phone-campaigns');
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const getPhoneCampaignDetail= async (id) => {
    try {
        const response = await axiosInstance.get(`http://116.202.210.102:8000/phone-campaign-detail/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getCallAgent=async()=>{
     try{
        const response = await axiosInstance.get('http://116.202.210.102:8000/get-phone-agents');
        return response;
     }catch (error) {
        console.error(error);
        return error;
}
}


export const updatePhoneNumberStatus=async (id)=>{
      try{
      const response = await axiosInstance.patch(`http://116.202.210.102:8000/phone-number-status/${id}`);
      return response;
      }catch(error){
        console.error(error);
        return error;
      }
}

export const updatePhoneNumberAgentStatus=async (id)=>{

      try{
      const response = await axiosInstance.patch(`http://116.202.210.102:8000/phone-agent-status/${id}`);
      return response;
      }catch(error){
        console.error(error);
        return error;
      }
}

export const deletePhoneNumber=async (id)=>{
      try{
      const response = await axiosInstance.delete(`http://116.202.210.102:8000/phone-number/${id}`);
      return response;
      }
      catch(error){
        console.error(error);
        return error;
      }
}

export const deletePhoneCampaign=async(id)=>{

      try{
      const response = await axiosInstance.delete(`http://116.202.210.102:8000/phone-campaign/${id}`);
      return response;
      }
      catch(error){
        console.error(error);
        return error;
      }

}

export const updatePhoneCampaign=async ( payload)=>{
      try{
      const response = await axiosInstance.put("http://116.202.210.102:8000/update-phone-campaign/"+payload.id, payload);
        return response;
        }
        catch(error){
        console.error(error);
        return error;
        }
}

export const duplicateCampaign=async (id)=>{
      try{
      const response = await axiosInstance.post(`http://116.202.210.102:8000/duplicate-phone-campaign/${id}`);
      return response;
      }
      catch(error){
        console.error(error);
        return error;
      }
}