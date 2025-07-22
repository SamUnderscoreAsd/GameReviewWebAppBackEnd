class IGDBToken{

    constructor(clientID,clientSecret){
        this.clientID = clientID;
        this.clientSecret = clientSecret;
        this.accessToken = null;
        this.tokenExpiry = null;
    }

    async getToken(){
        const url =`https://id.twitch.tv/oauth2/token?client_id=${this.clientID}&client_secret=${this.clientSecret}&grant_type=client_credentials`;
        try{
            const response = await fetch(url,{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });

            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json();

            this.accessToken = data.access_token;
            this.tokenExpiry = Date.now() + (data.expires_in * 1000);

            console.log(`Token expires in: ${Math.floor(data.expires_in/3600)} hours`);
        }
        catch(err){
            print(err);
        }
    }

    async getValidToken(){
        //if there is 5 minutes or less left on the currect access token, then refresh the token
        const fiveMinutes = 5 * 60 * 1000;
        const shouldRefresh = !this.accessToken || !this.tokenExpiry || (Date.now() + fiveMinutes) >= this. tokenExpiry;

        if(shouldRefresh){
            return await this.getAccessToken();
        }
        else{
            return this.accessToken;
        }
    }
}

module.exports = IGDBToken;