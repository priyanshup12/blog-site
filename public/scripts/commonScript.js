$(".view").click(()=>{
    location.href = "/blogs";
})

$(".post").click(()=>{
    location.href = "/post";
})

$(".view-blog").click((event) => {
    const buttonId = event.target.id; // Get the ID of the clicked button
    location.href = `/view?id=${buttonId}`; // Redirect to the appropriate URL
});

$(".edit-button").click((event)=>{
    const postId = event.target.id;
    location.href = `/edit?id=${postId}`;
})

$(".delete-button").click((event)=>{
    const postId = event.target.id;
    location.href = `/delete?id=${postId}`;
})
