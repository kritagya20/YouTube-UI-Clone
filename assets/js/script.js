try{
    const videoCardContainer = document.querySelector('.video-container'); // selecting the parent container for adding the api data

    const searchInput = document.querySelector('.search-bar'); //selecting the search bar for making it functional
    const searchBtn = document.querySelector('.search-btn'); //selecting the search btn for intiating the search on click
    const filterSearch = document.querySelectorAll('.filter-options'); //selecting the filter buttons for making them searchable
    const searchLink = 'https://www.youtube.com/results?search_query='; //defining the search link of youtube for further use

    const menuIcon = document.querySelector(".toggle-btn"); //selecting the hamberger icon for making sidebar move on click
    const sidebar = document.querySelector(".side-bar"); //selecting the sidebar for making it fuctional
    const container = document.querySelector(".container"); //selecting the container class to change the display according to the sidebar width
    const filter = document.querySelector(".filters"); //selecting the parent element of filter buttons to make the display according to the sidebar width

    const api_key = "AIzaSyDPfodqTF1aoEAo-_Ea5h_wZbgCxIN0NVg"; //defining our api key
    const video_http = "https://www.googleapis.com/youtube/v3/videos?"; //defining our video http link for fetching the data of videos
    const channel_http = "https://www.googleapis.com/youtube/v3/channels?"; //defining our channel-icon http link for fetching the data of channel icon 

    // using (video_http + api_key) all the details of video is provided in snippet, except the channel-icon.
    fetch(video_http + new URLSearchParams({
        key: api_key,
        part: 'snippet',
        chart: 'mostPopular',
        maxResults: 100,
        regionCode: 'IN'
    }))
    .then(res => res.json())
    .then(data => {
        //passing each fetched video to other fuction to fetch out channel icon
        data.items.forEach(item => {
            getChannelIcon(item);
        })
    })
    .catch(err => console.log(`Error in youtube video-list api: ${err}`));

    const getChannelIcon = (video_data) => {
        fetch (channel_http + new URLSearchParams({
            key: api_key,
            part: 'snippet',
            id: video_data.snippet.channelId
        }))
        .then(res => res.json())
        .then(data => {
            video_data.channelThumbnail = data.items[0].snippet.thumbnails.default.url;
            makeVideoCard(video_data); //calling the function to send the fetched data for display
        })
        .catch(err => console.log(`Error in youtube channel-icon api: ${err}`));
    }

    //fuction for displaying our fetched data on screen
    const makeVideoCard = (data) => {
        videoCardContainer.innerHTML += `
        <div class="video" onclick = "location.href = 'https://youtube.com/watch?v=${data.id}'"> 
            <img src="${data.snippet.thumbnails.high.url}" alt="thumbnail" class="thumbnail"> 
            <div class="content"> 
                <img src="${data.channelThumbnail}"  class="channel-icon"> 
                <div class="info"> 
                    <h4 class="title">${data.snippet.title}</h4> 
                    <p class="channel-name">${data.snippet.channelTitle}</p>  
                </div> 
            </div> 
        </div> 
        `;
    }

    //making search bar fuctionable
    searchBtn.addEventListener('click', () => {
        if(searchInput.value.length){
            location.href = searchLink + searchInput.value;
        }
    })

    //making filter buttons searchable through clicks
    filterSearch.forEach((filter) => {
        filter.addEventListener('click', () => {
            clickedFilter = filter.innerText;
            searchInput.value = clickedFilter;
            if(searchInput.value.length){
                location.href = searchLink + searchInput.value;
            }
        })
    });

    //making sidebar movable
    menuIcon.addEventListener('click',  function(){
        sidebar.classList.toggle("small-side-bar");
        container.classList.toggle("large-container");
        filter.classList.toggle("small-side-bar");
    });
}
catch(e) {
    console.log(`Error in js: ${e}`);
}
