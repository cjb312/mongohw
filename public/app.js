
//on click to make favorite
$(document).on("click", ".favorite", function () {



	$(this).attr("data-status", true);

	var id = $(this).attr("data-id");

	$.ajax({
		method: "POST",
		url: "/favorites/" + id,
		data: {
			saved: true
		}
	})
	.done(function(data) {
		console.log(data);
	});
});

$(document).on("click", ".unfavorite", function () {

	
	// var status = $(this).attr("data-status");
	var id = $(this).attr("data-id");

	$(this).attr("data-status", false);

	$.ajax({
		method: "POST",
		url: "/unfavorite/" + id,
		data: {
			saved: false
		}
	}).done(function(data) {
		console.log(data);
	});
});

//on click for showing comment field to make comment
$(document).on("click", ".commentButton", function () {
	$(".addComment").empty();
	var id = $(this).attr("data-id");

	$.ajax({
		method: "GET",
		url: "/comment/" + id
	}).done(function(data) {
		console.log(data);
		$(".addComment").append("<textarea id = 'bodyinput' name = 'body' ></textarea>");
		$(".addComment").append("<br><button data-id='" + data._id + "'id = 'saveComment' class='btn btn-default btn-sm'> Save Comment</button>");
		
		if(data.comment) {
			$("#titleinput").val(data.comment.title);
			$("#bodyinput").val(data.comment.body);
		}
	});
});

//save comment to db
$(document).on("click", "#saveComment", function() {

	var id = $(this).attr("data-id");

	$.ajax({
		method: "POST",
		url: "/comment/" + id,
		data: {
			title: $("#news").val(),
			body: $("#bodyinput").val()
		}
	}).done(function(data) {
		$(".addComment").empty();
	});

	$("#titleinput").val("");
	$("#bodyinput").val("");
});

