$(document).ready(function() {
    var colorPairs = {
        pair1: ['#DEBB00', '#F0E68C'],
        pair2: ['#CB356B', '#BD3F32'],
        pair3: ['#56ab2f', '#a8e063'],
        pair4: ['#a8ff78', '#78ffd6'],
        pair5: ['#4e54c8', '#8f94fb'],
        pair6: ['#DA4453', '#89216B'],
        pair7: ['#a8c0ff', '#3f2b96'],
        pair8: ['#bc4e9c', '#f80759'],
        pair9: ['#11998e', '#38ef7d'],
        pair10: ['#FC5C7D', '#6A82FB'],
        pair11: ['#fc4a1a', '#f7b733'],
        pair12: ['#7F00FF', '#E100FF'],
    };

    var reposArray = [];
    var searchArray = [];
    var username = localStorage?.getItem('username');
    var name =""
    var endPageNumber=localStorage.getItem('endPageNumber') ? localStorage.getItem('endPageNumber') : 1;
    $('#searches').hide();
    function showLoadingIndicator() {
        $('#loader').show();
    }

    function hideLoadingIndicator() {
        $('#loader').hide();
        $('#loader').removeClass('d-flex flex-column justify-content-center align-items-center d-flex');
    }

    showLoadingIndicator();
    async function fetchUserData(){
        try{
            const response = await fetch('https://api.github.com/users/' + username);
            if (!response.ok) {
                if(response.status==404){
                    alert('User does not exist : Enter correct username');
                    window.location.href = "index.html";
                    throw new Error('User does not exist : Enter correct username');
                }
                if(response.status==403 || response.status==429){
                    alert('API rate limit exceeded');
                    window.location.href = "index.html";
                    throw new Error('API rate limit exceeded');
                }
                if(response.status==401){
                    alert('Unauthorized');
                    window.location.href = "index.html";
                    throw new Error('Unauthorized');
                }
                if(response.status==500){
                    alert('Internal Server Error');
                    window.location.href = "index.html";
                    throw new Error('Internal Server Error');
                }
    
                hideLoadingIndicator();
            }

            const data = await response.json();
            hideLoadingIndicator();
            var userData = data;
            console.log(userData);
            name = userData.name;
            $('#public_repos').text(userData.public_repos);
            $('#followers').text(userData.followers);
            $('#following').text(userData.following);
            $('#avatar').html('<img src="' + userData.avatar_url + '" alt="" class="rounded-3 img-fluid" style="width: 12rem; height: auto;">');

            if(userData.location==null){
                userData.location = 'Not Available';
            }
            if(userData.twitter_username==null){
                userData.twitter_username = 'Not Available';
            }

            if(userData.bio==null){
                userData.bio = 'No bio available';
            }
            $('#info').append(`<div class="d-flex flex-column justify-content-center align-items-center p-4">
                <div id="avatar">
                    <img src="` + userData.avatar_url + `" alt="" class="rounded-3 img-fluid" style="width: 12rem; height: auto;">
                </div>
                <p id="name" class="text-white font-weight-bold pt-3 fs-5">`+userData.name+`</p>
                <p id="url" class="text-white">
                    <a href="` + userData.html_url + `" class="text-white">` + userData.html_url + `</a>
                    </p>
                    
                    <p id="description" class="text-white text-center fs-6 line-clamp" style="max-width: 10rem;">`+userData.bio+`</p>
                    
                    <div class="d-flex justify-content-center align-content-center mt-2" style="height: 1.5rem;">
                        <img src="./assets/images/location-pin.png" alt="" class="img-fluid rounded-5" style="max-width: 50%; max-height: 100%;"><p id="location" class="text-white fs-6 ms-3">`+userData.location+`</p>
                    </div>
                    
                    <div class="d-flex justify-content-center align-content-center mt-4" style="height: 2.5rem;">
                    <img src="./assets/images/xlogo.jpg" alt="twitter logo" class="img-fluid rounded-3" style="max-width: 14%; height:auto; object-fit: contain;">
                    <p id="twitter_username" class="text-white fs-6 ms-3 pt-1">`+userData.twitter_username+`</p>
                    </div></div>`)

            const starredResponse = await fetch('https://api.github.com/users/' + username + '/starred?per_page=1');
            if(starredResponse.status==404){
                alert('User does not exist : Enter correct username');
                window.location.href = "index.html";
                throw new Error('User does not exist : Enter correct username');
            }
            if(starredResponse.status==403 || starredResponse.status==429){
                alert('API rate limit exceeded');
                window.location.href = "index.html";
                throw new Error('API rate limit exceeded');
            }
            if(starredResponse.status==401){
                alert('Unauthorized');
                window.location.href = "index.html";
                throw new Error('Unauthorized');
            }
            if(starredResponse.status==500){
                alert('Internal Server Error');
                window.location.href = "index.html";
                throw new Error('Internal Server Error');
            }
            const linkHeader = starredResponse.headers.get('Link');
            if(linkHeader) {
                const lastLink = linkHeader.split(', ').find(s => s.endsWith('rel="last"'));
                const lastPageNumber = lastLink.match(/&page=(\d+)/)[1];
                $('#starred').text(lastPageNumber);
            }else{
                $('#starred').text(0);
            }
    
            fetchRepositories(page);
        } catch (error) {
                console.error('Error:', error);
            }
        }

        window.onload = function() {
            fetchUserData();
        };

        if (!localStorage.getItem('firstLoad')) {
            localStorage.setItem('firstLoad', true);
            setTimeout(function () {
                window.location.reload();
            }, 500); // 1000 milliseconds = 1 second
        } else {
            localStorage.removeItem('firstLoad');
        }

    console.log(name);

    reposArray.forEach(function(repo) {
        topicss = repo.topics;
    });

    var page = localStorage.getItem('currentPage') ? localStorage.getItem('currentPage') : 1;        
    var reposPerPage = localStorage.getItem('reposPerPage') ? localStorage.getItem('reposPerPage') : 10; 

        function fetchRepositories(page) {
            var apiUrl = 'https://api.github.com/users/' + username + '/repos?per_page=' + reposPerPage + '&page=' + page;

            fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    if(response.status==404){
                        alert('User does not exist : Enter correct username');
                        window.location.href = "index.html";
                        throw new Error('User does not exist : Enter correct username');
                    }
                    if(response.status==403 || response.status==429){
                        alert('API rate limit exceeded');
                        window.location.href = "index.html";
                        throw new Error('API rate limit exceeded');
                    }
                    if(response.status==401){
                        alert('Unauthorized');
                        window.location.href = "index.html";
                        throw new Error('Unauthorized');
                    }
                    if(response.status==500){
                        alert('Internal Server Error');
                        window.location.href = "index.html";
                        throw new Error('Internal Server Error');
                    }
                }else{
                    const linkHeader = response.headers.get('Link');
                    if(linkHeader) {
                        if(page==1){
                            const lastLink = linkHeader.split(', ').find(s => s.endsWith('rel="last"'));
                            endPageNumber = parseInt(lastLink.match(/&page=(\d+)/)[1]);
                            localStorage.setItem('endPageNumber', endPageNumber);
                            console.log(endPageNumber);
                        }
                    }
                }
                return response.json();
            })
            .then(data => {
                $('#repos').empty();
                if(data.length==0){
                    $('#repos').append('<div class="text-white text-center fs-4">No repositories available</div>');
                }else{
                reposArray = data;
                console.log(reposArray);
                $.each(reposArray, function(i, repo){
                    var randomPairKey = Object.keys(colorPairs)[Math.floor(Math.random() * Object.keys(colorPairs).length)];
                        var randomPair = colorPairs[randomPairKey];
                        if(repo.language==null){
                            repo.language = 'Other';
                        }
                        if(repo.description==null){
                            repo.description = 'No description available';
                        }
                    $('#repos').append(
                        '<div id="repo" class="me-4 mb-3 text-white bg-dark px-3 rounded-3" style="width: 30%;"><div class="d-flex align-items-center pt-2"><img src="./assets/images/repo-plain.png" alt="" class="img-fluid me-3" style="width:8%; height:100%"><a href="'+repo.html_url+'" class="fs-4 pt-2 mb-3 line-clamp-1 text-overflow-ellipsis" style="max-width:100%">'+ repo.name +'</a></div><div><p class="mb-3 line-clamp-2" style="font-size: smaller;">'+ repo.description +'.</p></div><div id="language" class="d-flex align-items-center"><div class="rounded-circle" style="height: 1.2rem; width: 1.2rem; background: linear-gradient(60deg,' + randomPair[0] + ', '+randomPair[1] +')"></div><p class="ms-2 mb-0 text-white" style="font-size:0.8rem">'+repo.language+'</p></div><div id="topics'+i+'" class="gap-md-4 gap-lg-3 mt-4 mb-4" style="  display: flex; flex-wrap: wrap; width: 100%;"></div></div>'
                    )
                    console.log(repo.topics);
    
                    if(repo.topics.length==0){
                        var randomPairKey = Object.keys(colorPairs)[Math.floor(Math.random() * Object.keys(colorPairs).length)];
                        var randomPair = colorPairs[randomPairKey];
                        $('#topics'+i).append('<div class="topics-child p-1 m-0 rounded-2 d-flex justify-content-center align-items-center min-w-auto overflow-hidden" style=" background: linear-gradient(#202124, #202124) padding-box, linear-gradient(60deg,' + randomPair[0] + ', '+randomPair[1] +') border-box; box-shadow: 0 0 10px '+ randomPair[1] +';max-width:max-content;" >' + '<p class="px-3 m-0 fw-bold" style="font-size: x-small;">No topics available</p></div>');
                    }else{
                        console.log(repo.topics);
                        $.each(repo.topics, function(index, value) {
                            var randomPairKey = Object.keys(colorPairs)[Math.floor(Math.random() * Object.keys(colorPairs).length)];
                            var randomPair = colorPairs[randomPairKey];
                            $('#topics'+i).append('<div class="topics-child p-1 m-0 rounded-2 d-flex justify-content-center align-items-center min-w-auto overflow-hidden"style=" background: linear-gradient(#202124, #202124) padding-box, linear-gradient(60deg,' + randomPair[0] + ', '+randomPair[1] +') border-box; box-shadow: 0 0 10px '+ randomPair[1] +';max-width:max-content;" >' + '<p class="px-3 m-0 fw-bold" style="font-size: x-small">'+ value +'</p>' + '</div>');
                        });
                    }
                })
                $('#prevPageBtn').prop('disabled', page === 1);
                updatePagination(page)
                }
            })
            .catch(error => console.error('Error:', error));
        }

            var totalPagesToShow = 10;
            var mobilePagesToShow = 5; // Number of pages to display in the pagination container
            var paginationContainer = $('#paginationContainer');

            function updatePagination(currentPage) {
                paginationContainer.empty();
                var isMobile = window.innerWidth < 768;
                var pagesToShow = isMobile ? mobilePagesToShow : totalPagesToShow;
                let startPage = 1;
                if(page >pagesToShow){
                    startPage = page - pagesToShow + 1;
                }
                let endPage = startPage + pagesToShow - 1;

                for (var i = startPage; i <= endPage && i <= endPageNumber; i++) {
                    var pageButton = $('<button id="'+ i +'" class="pagee btn btn-dark mx-1">' + i + '</button>');
                    if(i == page) {
                        pageButton.addClass('active border border-white');
                    }
                    pageButton.on('click', function() {
                        $('.pagee').removeClass('active border border-white');
                        page = parseInt($(this).text());
                        $(this).addClass('active border border-white');
                        fetchRepositories(page);
                        localStorage.setItem('currentPage', page);
                    });
                    paginationContainer.append(pageButton);
                }
            }

        $('#nextPageBtn').on('click', function() {
            page++;
            fetchRepositories(page);
            localStorage.setItem('currentPage', page);
            $('#nextPageBtn').prop('disabled', page === endPageNumber);
            updatePagination(page);
        });

        $('#prevPageBtn').on('click', function() {
            page--; 
            fetchRepositories(page);
            localStorage.setItem('currentPage', page);
            $('#prevPageBtn').prop('disabled', page === 1);
            $('#nextPageBtn').prop('disabled', page === endPageNumber);
            updatePagination(page);
        });

        $('#changeButton').on('click', function () {
            $('#sliderContainer').toggle();
            $('#changeButton').toggle();
        });
    
        $('#requestsPerPage').on('input', function () {
            reposPerPage = $(this).val();
            localStorage.setItem('reposPerPage', reposPerPage);
            $('#requestsPerPageValue').text(reposPerPage);
        });
    
        $('#submitChanges').on('click', function () {
            fetchRepositories(page);
            updatePagination(page);
            $('#sliderContainer').toggle();
            $('#changeButton').toggle();
        });
        
        $('#searchButton').on('click', function () {
            $('#searches').show();
            var searchQuery = $('#searchBox').val();
            searchQuery = searchQuery.replace(/[^\w\s]/gi, '');
            var searchUrl = 'https://api.github.com/search/repositories?q=' + searchQuery + '+user:' + username;
            fetch(searchUrl)
            .then(response => {
                if (!response.ok) {
                    if(response.status==404){
                        alert('User does not exist : Enter correct username');
                        window.location.href = "index.html";
                        throw new Error('User does not exist : Enter correct username');
                    }
                    if(response.status==403 || response.status==429){
                        alert('API rate limit exceeded');
                        window.location.href = "index.html";
                        throw new Error('API rate limit exceeded');
                    }
                    if(response.status==401){
                        alert('Unauthorized');
                        window.location.href = "index.html";
                        throw new Error('Unauthorized');
                    }
                    if(response.status==500){
                        alert('Internal Server Error');
                        window.location.href = "index.html";
                        throw new Error('Internal Server Error');
                    }
                }
                return response.json();
            })
            .then(data => {
                $('#searchesContainer').empty();
                searchArray = data.items;
                
                console.log(searchArray);
                $.each(searchArray, function(i, repo){
                    $('#searchesContainer').append(
                        '<div id="repo" class="me-4 mb-3 text-white bg-dark px-3 rounded-3" style="width: 30%;"><div class="d-flex align-items-center pt-2"><img src="./assets/images/repo-plain.png" alt="" class="img-fluid me-3" style="width:8%; height:100%"><a href="'+repo.html_url+'" class="fs-4 pt-2 mb-3 line-clamp-1 text-overflow-ellipsis" style="max-width:100%">'+ repo.name +'</a></div><div><p class="mb-2 line-clamp-2" style="font-size: smaller;">'+ repo.description +'.</p></div><div id="topics'+i+'" class="gap-md-4 gap-lg-3 mt-4 mb-4" style="  display: flex; flex-wrap: wrap; width: 100%;">'+ repo.topics +'</div></div>'
                    )
                    console.log(repo.topics);
    
                    if(repo.topics.length==0){
                        var randomPairKey = Object.keys(colorPairs)[Math.floor(Math.random() * Object.keys(colorPairs).length)];
                        var randomPair = colorPairs[randomPairKey];
                        $('#topics'+i).append('<div class="topics-child p-1 m-0 rounded-2 d-flex justify-content-center align-items-center min-w-auto overflow-hidden" style=" background: linear-gradient(#202124, #202124) padding-box, linear-gradient(60deg,' + randomPair[0] + ', '+randomPair[1] +') border-box; box-shadow: 0 0 10px '+ randomPair[1] +';max-width:max-content;" >' + '<p class="px-3 m-0 fw-bold" style="font-size: x-small;">No topics available</p></div>');}else{
                            console.log(repo.topics);
                        $.each(repo.topics, function(index, value) {
                            var randomPairKey = Object.keys(colorPairs)[Math.floor(Math.random() * Object.keys(colorPairs).length)];
                            var randomPair = colorPairs[randomPairKey];
                            $('#topics'+i).append('<div class="topics-child p-1 m-0 rounded-2 d-flex justify-content-center align-items-center min-w-auto overflow-hidden"style=" background: linear-gradient(#202124, #202124) padding-box, linear-gradient(60deg,' + randomPair[0] + ', '+randomPair[1] +') border-box; box-shadow: 0 0 10px '+ randomPair[1] +';max-width:max-content;" >' + '<p class="px-3 m-0 fw-bold" style="font-size: x-small">'+ value +'</p>' + '</div>');
                        });
                    }
                })
            })
            .catch(error => console.error('Error:', error));
        });

        $('#hide-search').on('click', function () {
            $('#searches').toggle();
        })

        $('#searchBox').on('keypress', function (e) {
            if (e.which == 13) { 
                $('#searchButton').click(); 
            }
        });

        var lastPage = localStorage.getItem('currentPage');
        if (lastPage) {
            page = parseInt(lastPage);
        }
        fetchRepositories(page);
});