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



const savedTheme = sessionStorage.getItem("theme");
if (savedTheme) {
    $("body").attr("data-bs-theme", savedTheme); 
}
