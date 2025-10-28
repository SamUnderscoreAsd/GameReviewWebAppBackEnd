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
            //console.log(data);

            this.accessToken = data.access_token;
            console.log(this.accessToken);
            this.tokenExpiry = Date.now() + (data.expires_in * 1000);

            //console.log(`Token expires in: ${Math.floor(data.expires_in/3600)} hours`);
        }
        catch(err){
            console.log(err);
        }
    }

    async getValidToken(){
        //if there is 5 minutes or less left on the currect access token, then refresh the token
        const fiveMinutes = 5 * 60 * 1000;
        const shouldRefresh = !this.accessToken || !this.tokenExpiry || (Date.now() + fiveMinutes) >= this.tokenExpiry;

        if(shouldRefresh){
            return await this.getToken();
        }
        else{
            console.log("the token is ok");
            return this.accessToken;
        }
    }

    async getRandomGames(){
        const url = "https://api.igdb.com/v4/games"
        try{
            const results = await fetch(url,{
                method: 'POST',
                headers: {
                    "Accept": "application/json",
                    "Client-ID" : this.clientID,
                    "Authorization" : `Bearer ${this.accessToken}`,
                },
                body : "fields name,artworks,artworks.image_id,aggregated_rating,aggregated_rating_count;"
            })

            const data = await results.json();
            return data;
        }
        catch(e){
            console.log("the Get Random Games method failed ig :(" + e);
            console.error(e);
        }
    }
}

module.exports = IGDBToken;