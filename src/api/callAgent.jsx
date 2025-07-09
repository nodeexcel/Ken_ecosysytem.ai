import axiosInstance from "./axiosInstance";

export const addPhoneNumber = async (payload) => {
    try {
        const response = await axiosInstance.post('https://agents.ecosysteme.ai/add-phone-number', payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};



export const createPhoneAgent = async (payload) => {
    try {
        const response = await axiosInstance.post('https://agents.ecosysteme.ai/create-phone-agent', payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const createPhoneCampaign= async (payload) => {
    try {
        const response = await axiosInstance.post('https://agents.ecosysteme.ai/create-phone-campaign', payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};



export const getPhoneNumber= async () => {
    try {
        const response = await axiosInstance.get('https://agents.ecosysteme.ai/get-phone-numbers');
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const getPhoneCampaign= async () => {
    try {
        const response = await axiosInstance.get('https://agents.ecosysteme.ai/get-phone-campaigns');
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const getPhoneCampaignDetail= async (id) => {
    try {
        const response = await axiosInstance.get(`https://agents.ecosysteme.ai/phone-campaign-detail/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getCallAgent=async()=>{
     try{
        const response = await axiosInstance.get('https://agents.ecosysteme.ai/get-phone-agents');
        return response;
     }catch (error) {
        console.error(error);
        return error;
}
}


export const updatePhoneNumberStatus=async (id)=>{
      try{
      const response = await axiosInstance.patch(`https://agents.ecosysteme.ai/phone-number-status/${id}`);
      return response;
      }catch(error){
        console.error(error);
        return error;
      }
}

export const updatePhoneNumberAgentStatus=async (id)=>{

      try{
      const response = await axiosInstance.patch(`https://agents.ecosysteme.ai/phone-agent-status/${id}`);
      return response;
      }catch(error){
        console.error(error);
        return error;
      }
}

export const deletePhoneNumber=async (id)=>{
      try{
      const response = await axiosInstance.delete(`https://agents.ecosysteme.ai/phone-number/${id}`);
      return response;
      }
      catch(error){
        console.error(error);
        return error;
      }
}

export const deletePhoneCampaign=async(id)=>{

      try{
      const response = await axiosInstance.delete(`https://agents.ecosysteme.ai/phone-campaign/${id}`);
      return response;
      }
      catch(error){
        console.error(error);
        return error;
      }

}

export const updatePhoneCampaign=async ( payload)=>{
      try{
      const response = await axiosInstance.put("https://agents.ecosysteme.ai/update-phone-campaign/"+payload.id, payload);
        return response;
        }
        catch(error){
        console.error(error);
        return error;
        }
}

export const duplicateCampaign=async (id)=>{
      try{
      const response = await axiosInstance.post(`https://agents.ecosysteme.ai/duplicate-phone-campaign/${id}`);
      return response;
      }
      catch(error){
        console.error(error);
        return error;
      }
}