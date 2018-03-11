$("#addContact").on("submit", function(event) {
	event.preventDefault();
	var newContact = {
		firstName: $("#firstName").val().trim(),
		lastName: $("#lastName").val().trim(),
		contactType: $("#contactType").val(),
		phoneNumber: $("#phoneNum").val().trim(),
		emailAddress: $("#emailAddr").val().trim()
	}
	$.ajax("/api/contacts",{
		method: "POST",
		data: newContact
	}).then(function(data){
		console.log(data);
		location.href = "/";
	})
})
