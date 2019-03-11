// global variables
var siteName = "";
var siteAddress = "";
var siteSupervisor = "";
var mealType = "";
var deliveryTemp = "";
var sitePhone = [{ "mask": " ### - ### - ####"}];

var mealsNew;
var mealsPrevious;
var mealsAvailable = 0;
var mealsFirst = 0;
var mealsSecond = 0;
var mealsProgAdult = 0;
var mealsNonProgAdult = 0;
var mealsServed = 0;
var mealsDamaged = 0;
var mealsUtilized = 0;
var mealsLeftover = 0;
var mealsAddlNeeded = 0;

// notification strings other than bootstrap form validation
// used on card3-counterCard
var secondExceeds = "Second Meals cannot exceed First Meals";
var firstExceeds = "First Meals must exceed Second Meals";
var noMeals = "No Meals Remaining to serve";
var readyServe = "Ready to serve!";


// current date using moment.js
var now = moment();
var longDate = moment(now).format("ddd, MMM DD, YYYY");
var shortDate = moment(now).format("YYYY-DD-MM")
$(".longDate").text(longDate);
$(".shortDate").text(shortDate);

// must initialize jSignature before jquery hiding secondary cards 2-6
$("#signature").jSignature();

$(".secondary-cards").fadeOut('fast');
//comment above line to see all cards at start
//does not alter navigation by toggleClass display of cards

// check local storage for previous site info, or whether a meal counting session is in progress
document.getElementById("siteName-input").value = localStorage.getItem("mealCounter-siteName");
document.getElementById("siteAddress-input").value = localStorage.getItem("mealCounter-siteAddress");
document.getElementById("siteSupervisor-input").value = localStorage.getItem("mealCounter-siteSupervisor");

// tracking of meal categories
function sumMeals() {
  mealsServed = mealsFirst + mealsSecond + mealsProgAdult + mealsNonProgAdult;
  mealsUtilized = mealsServed + mealsDamaged;
  mealsLeftover = mealsAvailable - mealsUtilized;
  $(".mealsAvailable").text(mealsAvailable);
  $(".mealsFirst").text(mealsFirst);
  $(".mealsSecond").text(mealsSecond);
  $(".mealsProgAdult").text(mealsProgAdult);
  $(".mealsNonProgAdult").text(mealsNonProgAdult);
  $(".mealsServed").text(mealsServed);
  $(".mealsDamaged").text(mealsDamaged);
  $(".mealsUtilized").text(mealsUtilized);
  $(".mealsLeftover").text(mealsLeftover);
  $("#mealsDamaged").attr({
    "max": mealsAvailable - mealsServed //sets max value allowed for mealsDamaged on card4
  });
}


<!---// card1-siteMealInfo functionality --->

// validation for mealType onclick
// https://getbootstrap.com/docs/4.2/components/forms/#validation
// https://www.codeply.com/go/LYdmkkTZUS/bootstrap-4-validation-example
$("#meal-type-btns").click(function(event) {
  // Fetch form to apply custom Bootstrap validation
  var form = $("#site-meal-form");
  if (form[0].checkValidity() === false) { // check form fields using built-in validation in html
    event.preventDefault();
    event.stopPropagation();
  } else if (form[0].checkValidity() == true) { // must have siteName, siteAddress, siteSupervisor
    event.preventDefault();
    var meal = document.activeElement.getAttribute('value');
    selectSiteMeal(meal);
    $(".siteName").text(siteName);
    $("#card1-siteMealInfo").fadeOut('fast');
    $("#card2-mealsAvailable").fadeIn();
  }
  form.addClass('was-validated');
});

// upon successful mealType validation
function selectSiteMeal(meal) {
  siteName = document.getElementById("siteName-input").value;
  siteAddress = document.getElementById("siteAddress-input").value;
  siteSupervisor = document.getElementById("siteSupervisor-input").value;
  localStorage.setItem("mealCounter-siteName", siteName);
  localStorage.setItem("mealCounter-siteAddress", siteAddress);
  localStorage.setItem("mealCounter-siteSupervisor", siteSupervisor);
  switch (meal) {
    case "b":
      mealType = "Breakfast";
      break;
    case "l":
      mealType = "Lunch";
      break;
    case "sn":
      mealType = "Snack";
      break;
    case "su":
      mealType = "Supper";
      break;
  }
  $(".mealType").text(mealType);
};


<!---// card2-mealsAvailable functionality --->

function sumMealsAvail() {
  mealsNew = document.getElementById("mealsNew").value;
  mealsPrevious = document.getElementById("mealsPrevious").value;
  var mealsTotal = 0;
  mealsTotal += numNaN(mealsNew);
  mealsTotal += numNaN(mealsPrevious);
  mealsAvailable = mealsTotal;
  $('.mealsAvailable').val(mealsAvailable);
  if (mealsAvailable > 0 && (mealsNew != "" && mealsPrevious != "")) {
    document.getElementById("startCounting-btn").setAttribute("class", "btn-lg w-100 btn-success");
  } else {
    document.getElementById("startCounting-btn").setAttribute("class", "btn-lg w-100 btn-danger");
  }
};

$("#startCounting-btn").click(function(event) {
  var form = $("#meals-available-form")
  if (mealsAvailable == 0) { //form cannot validate without mealsAvailable
    event.preventDefault()
    event.stopPropagation()
    $("#noMeals-invalidFeedback").toggleClass('d-none')
    setTimeout(function() {
      $("#noMeals-invalidFeedback").toggleClass('d-none');
    }, 3000);
  } else if (mealsAvailable < mealsUtilized) { // cannot validate if mealsUtilized exceeds mealsAvailable
    event.preventDefault()
    event.stopPropagation()
    $("#servedExceeds-invalidFeedback").toggleClass('d-none')
    setTimeout(function() {
      $("#servedExceeds-invalidFeedback").toggleClass('d-none');
    }, 3000);
  } else if (form[0].checkValidity() === false) { // check form fields using built-in validation in html
    event.preventDefault()
    event.stopPropagation()
  } else if (form[0].checkValidity() == true) { // must have non-zero on inputs & mealsAvailable > 0
    event.preventDefault();
    sumMeals();
    deliveryTemp = document.getElementsByClassName("deliveryTemp")[0].value;
    console.log(deliveryTemp);
    $("#notify").toggleClass('text-primary');
    $("#notify").val(readyServe);
    setTimeout(function() {
      $("#notify").val("").toggleClass('text-danger');
    }, 3000);
    $("#card2-mealsAvailable").fadeOut('fast');
    $("#card3-mainCounters").fadeIn();
  }
  form.addClass('was-validated');
});


<!---// card3-counterCard functionality --->

$('#first-plus-btn').click(function(e) {
  if (mealsLeftover == 0) {
    $("#notify").val(noMeals);
    setTimeout(function() {
      $("#notify").val("");
    }, 3000);
  } else if (mealsLeftover >= 1) {
    mealsFirst++;
    sumMeals();
  } else {
    $("#notify").val(noMeals);
    setTimeout(function() {
      $("#notify").val("");
    }, 3000);
  }
});

$('#first-minus-btn').click(function(e) {
  if (mealsFirst >= 1 && mealsFirst > mealsSecond) {
    mealsFirst--;
    sumMeals();
  } else if (mealsFirst = mealsSecond) {
    $("#notify").val(firstExceeds);
    setTimeout(function() {
      $("#notify").val("");
    }, 3000);
  }
});

$('#second-plus-btn').click(function(e) {
  if (mealsLeftover == 0) {
    $("#notify").val(noMeals);
    setTimeout(function() {
      $("#notify").val("");
    }, 3000);
  } else if (mealsLeftover >= 1 && mealsSecond < mealsFirst) {
    mealsSecond++;
    sumMeals();
  } else if (mealsSecond == mealsFirst) {
    $("#notify").val(secondExceeds);
    setTimeout(function() {
      $("#notify").val("");
    }, 3000);
  }
});

$('#second-minus-btn').click(function(e) {
  if (mealsSecond >= 1) {
    mealsSecond--;
    sumMeals();
  }
});

$('#mealsProgAdult-plus-btn').click(function(e) {
  if (mealsLeftover == 0) {
    $("#notify").val(noMeals);
    setTimeout(function() {
      $("#notify").val("");
    }, 3000);
  } else if (mealsLeftover > 0) {
    mealsProgAdult++;
    sumMeals();
  }
});

$('#mealsProgAdult-minus-btn').click(function(e) {
  if (mealsProgAdult >= 1) {
    mealsProgAdult--;
    sumMeals();
  }
});

$('#mealsNonProgAdult-plus-btn').click(function(e) {
  if (mealsLeftover == 0) {
    $("#notify").val(noMeals);
    setTimeout(function() {
      $("#notify").val("");
    }, 3000);
  } else if (mealsLeftover > 0) {
    mealsNonProgAdult++;
    sumMeals();
  }
});

$('#mealsNonProgAdult-minus-btn').click(function(e) {
  if (mealsNonProgAdult >= 1) {
    mealsNonProgAdult--;
    sumMeals();
  }
});

$('#doneCounting-btn').click(function(e) {
  sumMeals();
  $("#card3-mainCounters").fadeOut('fast');
  $("#card4-addlMeals").fadeIn();
});

<!---// card4-addlMeals functionality -->

function inputDamaged() {
  mealsDamaged = document.getElementById("mealsDamaged").value;
  mealsDamaged = numNaN(mealsDamaged);
  sumMeals();
  if (mealsLeftover <= -1) {
    mealsDamaged = parseInt(document.getElementById("mealsDamaged").value);
    $("#mealsDamaged-invalidFeedback").toggleClass('d-none');
    setTimeout(function() {
      $("#mealsDamaged-invalidFeedback").toggleClass('d-none');
    }, 2500);
  }
};

$('#mealsAddlNeeded-plus-btn').click(function(e) {
  if (mealsLeftover > 0) {
    $("#addlMeals-invalidFeedback").toggleClass('d-none');
    setTimeout(function() {
      $("#addlMeals-invalidFeedback").toggleClass('d-none');
    }, 3000);
  } else
    mealsAddlNeeded++;
  $('.mealsAddlNeeded').text(mealsAddlNeeded);
});

$('#mealsAddlNeeded-minus-btn').click(function(e) {
  if (mealsAddlNeeded >= 1) {
    mealsAddlNeeded--;
    $('.mealsAddlNeeded').text(mealsAddlNeeded);
  }
});

function signFinish() {
$('deliveryTemp').attr('placeholder', deliveryTemp);
};



<!-- // card5-signature functionality  --->
$('#sitePhone').inputmask({
        mask: sitePhone,
        greedy: false,
        definitions: { '#': { validator: "[0-9]", cardinality: 1}} });

// jSignature was called on line 35
function goToDone() {
  if ($('#signature').jSignature("getData", 'native').length > 0) {
    // jsSigDataValid = true;
    createPDF();
    deliveryTemp = document.getElementsByClassName("deliveryTemp")[0].value;
    $("#card5-signature").fadeOut('fast');
    $("#card6-done").fadeIn();
  } else {
        $("#needSigModal").modal()
  }
};


// card navigations

function goBackTo1() {
  $("#card2-mealsAvailable").fadeOut('fast');
  $("#card1-siteMealInfo").fadeIn();
};

function goBackTo2() {
  // $("#mealsAvailable-input").attr({
  //   "min": mealsUtilized
  // });
  $("#card3-mainCounters").fadeOut('fast');
  $("#card2-mealsAvailable").fadeIn();
};

function goBackTo3() {
  $("#card4-addlMeals").fadeOut('fast');
  $("#card3-mainCounters").fadeIn();
};

function goBackTo4() {
  $("#signature").jSignature("clear");
  $("#card5-signature").fadeOut('fast');
  $("#card4-addlMeals").fadeIn();
};

// function goBackTo5() {
//   $("#signature").jSignature("reset");
//   $("#card6-done").fadeOut('fast');
//   $("#card5-signature").fadeIn();
// };

function goToSign() {
  if (deliveryTemp != "") {
      $('.deliveryTemp').attr('value', deliveryTemp);
  }

  $("#card4-addlMeals").fadeOut('fast');
  $("#card5-signature").fadeIn();
  // Initialize jSignature
  // $("#signature").jSignature();

  // $("#signature").jSignature({'UndoButton':true});
}

// for calculation of NaN without console error-
// allows Bootstrap form validation to work properly with blanks,
// and when user enters zero directly into number input
// https://stackoverflow.com/questions/7540397/convert-nan-to-0-in-javascript
function numNaN(str) {
  return /[0-9]*\.?[0-9]+/.test(str) ? parseFloat(str) : 0;
}

// function resetApp() {
//   var x = confirm("Do you wish to clear all data and restart the Meal Counter app?")
//   if (x == true) {
//     localStorage.clear();
//     window.onbeforeunload = null;
//     window.location.reload();
//   }
// };

function resetApp() {
  var modalConfirm = function(callback) {
    $("#resetModal").modal()
    $("#resetModal-yes").on("click", function() {
      callback(true);
      $("#resetModal").modal('hide');
    });
    $("#resetModal-no").on("click", function() {
      callback(false);
      $("#resetModal").modal('hide');
    });
  };

  modalConfirm(function(confirm) {
    if (confirm) {
      localStorage.clear();
      window.onbeforeunload = null;
      window.location.reload();
    }
  });
};

function restartApp() {
  window.onbeforeunload = null;
  window.location.reload();
}

function beforeUnload() {
  return 'Use the "Go Back" button, or you may lose your changes.';
}

function createPDF() {
  /****************************************************************
   *
   *		get page variables
   *
   ******************************************************************/
  $(this).css("background-color", "green");
  // var siteName = siteName;
  // var siteAddress = siteAddress;
  // var siteSupervisor = siteSupervisor;
  //
  // // set elsewhere: mealType;mealsDamaged, mealsLeftover, mealsAvailable (mealsPrevious+mealsNew), mealsProgAdult, mealsNonProgAdult
  // //
  // var mealsPrevious = mealsPrevious;
  // var mealsNew = mealsNew;
  // var mealsFirst = mealsFirst;  //first meals to children
  // var mealsSecond = mealsSecond;  //second meals to children
  // var mealsServed = mealsServed;

  //write a second page to handle numbers greater than defined below
  if (mealsFirst > 160) {
    //divide then round up and multiply again
    r = Math.ceil(mealsFirst / 20);
    r = r * 20;
  } else {
    r = 160;
  }

  if (mealsSecond > 15) {
    r2 = Math.ceil(mealsSecond / 15);
    r2 = r2 * 15;
  } else {
    r2 = 15;
  }
  if (mealsProgAdult > 15) {
    r3 = Math.ceil(mealsProgAdult / 15);
    r3 = r3 * 15;
  } else {
    r3 = 15;
  }
  if (mealsNonProgAdult > 15) {
    r4 = Math.ceil(mealsNonProgAdult / 15);
    r4 = r4 * 15;
  } else {
    r4 = 15;
  }
  var doc = new jsPDF('p', 'mm', 'letter');
  // starting x, starting y, width, height
  doc.rect(9, 9, 192, 257);
  doc.rect(10, 10, 190, 255); // outline of the page for A4 paper in mm is 10,10,190,275
  //Font size 12 gives me 69 capital A's across and font-size 10 gets me 83
  doc.setFontSize(10);
  doc.text(85, 16, 'DAILY MEAL COUNT FORM');
  doc.line(10, 19, 200, 19); //horizontal line:
  doc.line(10, 26, 200, 26); //horizontal line:
  doc.line(10, 36, 200, 36); //horizontal line:
  doc.line(10, 46, 200, 46); //horizontal line:
  doc.line(10, 56, 200, 56);

  doc.text(12, 25, 'Site: ' + siteName);
  doc.text(130, 25, 'Meal: ' + mealType);
  doc.text(12, 35, 'Address: ' + siteAddress);

  doc.text(12, 45, "Supervisor\'s Name: " + siteSupervisor);
  doc.text(130, 45, 'Date: ' + longDate);
  var txt = 'Meals Received: ' + mealsNew + ' +	  Meals available from previous day: ' + mealsPrevious + ' =  Total meals available: ';
  doc.setFontType("bold");
  doc.text(12, 55, txt);
  doc.text(175, 55, mealsAvailable.toString());
  doc.setFontType("normal");
  doc.text(12, 62, 'First Meals Served to Children:');

  //put lines through the served meals
  var x, tx, b = 1;
  var c = 68;
  for (j = 0; j < (r / 20); j++) {
    x = 13;
    if (j > 4) {
      x = 12;
    }
    for (i = b; i < (b + 20); i++) {
      tx = i.toString();
      doc.text(x, c, tx);
      if (i <= mealsFirst) {
        doc.line(x - 1, c + 1, x + 4, c - 3);
      }
      x = x + 9;
    }
    b = i;
    c += 7;
  }


  doc.setFontType("bold");
  doc.text(156, c, 'Total First Meals: ' + mealsFirst);
  doc.setFontType("normal");

  doc.line(10, (c + 2), 200, (c + 2));
  doc.text(12, (c + 8), 'Second meals served to children:');
  b = 1;
  c = c + 14;
  for (j = 0; j < (r2 / 15); j++) {
    x = 13;
    for (i = b; i < (b + 15); i++) {
      tx = i.toString();
      doc.text(x, c, tx);
      if (i <= mealsSecond) {
        doc.line(x - 1, c + 1, x + 3, c - 2);
      }
      x = x + 7;
    }
    b = i;
    c += 7;
  }
  c = c - 7;
  doc.setFontType("bold");
  doc.text(150, c, 'Total Second Meals+ ' + mealsSecond);
  doc.setFontType("normal");

  doc.line(10, (c + 2), 200, (c + 2));
  doc.text(12, (c + 8), 'Meals served to Program adults:');
  b = 1;
  c = c + 14;
  for (j = 0; j < (r3 / 15); j++) {
    x = 13;
    for (i = b; i < (b + 15); i++) {
      tx = i.toString();
      doc.text(x, c, tx);
      if (i <= mealsProgAdult) {
        doc.line(x - 1, c + 1, x + 3, c - 2);
      }
      x = x + 7;
    }
    b = i;
    c += 7;
  }
  c = c - 7;
  doc.setFontType("bold");
  doc.text(140, c, 'Total Program Adult Meals+ ' + mealsProgAdult);
  doc.setFontType("normal");

  doc.line(10, (c + 2), 200, (c + 2));
  doc.text(12, (c + 8), 'Meals served to non-Program adults:');
  b = 1;
  c = c + 14;
  for (j = 0; j < (r4 / 15); j++) {
    x = 13;
    for (i = b; i < (b + 15); i++) {
      tx = i.toString();
      doc.text(x, c, tx);
      if (i <= mealsNonProgAdult) {
        doc.line(x - 1, c + 1, x + 3, c - 2);
      }
      x = x + 7;
    }
    b = i;
    c += 7;
  }
  c = c - 7;
  doc.setFontType("bold");
  doc.text(133, c, 'Total non-Program Adult Meals+ ' + mealsNonProgAdult);

  doc.setLineWidth(1);
  doc.line(10, (c + 2), 200, (c + 2));
  doc.setLineWidth(.2);
  doc.text(138, (c + 8), 'TOTAL MEALS SERVED = ' + mealsServed);
  doc.line(10, (c + 10), 200, (c + 10));
  c += 16;
  doc.text(90, c, 'Total damaged/incomplete/other non-reimbursable meals+ ' + mealsDamaged);
  doc.line(10, (c + 2), 200, (c + 2));
  doc.text(148, (c + 8), 'Total mealsLeftover meals+ ' + mealsLeftover);
  doc.setLineWidth(1);
  doc.line(10, (c + 10), 200, (c + 10));
  doc.setLineWidth(.2);
  c += 16;
  doc.setFontType("normal");
  doc.text(12, c, "By signing below, I certify that the above information is true and accurate:");
  doc.text(148, (c + 23), longDate);

  var canvas = document.body.querySelector('canvas');

  if (canvas === null) {
    alert(
      'Site Representative must sign the form', // message
      null, // callback
      'Signature Needed', // title
      'OK' // buttonName
    );
    return false;
  } else if (canvas !== null) {
    var st = canvas.toDataURL("image/png");
    var data = st.slice('data:image/png;base64,'.length);
    data = atob(data);
    doc.addImage(data, 'PNG', 12, (c + 8), 80, 25);
  }
  doc.save("MealCount_" + siteName + "_" + longDate + ".pdf");
  // if (isApple) {
  //   window.location=doc.output('datauristring');
  // } else {
  //    doc.save("MealCount_" + siteName+ "_" + longDate + ".pdf");
  // }
}

// console.log(`Meal Totals`);
// console.log(`mealsNew: ${mealsNew}`);
// console.log(`mealsPrevious: ${mealsPrevious}`);
// console.log(`mealsAvailable: ${mealsAvailable}`);
// console.log(`mealsServed: ${mealsServed}`);
// console.log(`mealsDamaged: ${mealsDamaged}`);
// console.log(`mealsLeftover: ${mealsLeftover}`);
// console.log(`mealsUtilized: ${mealsUtilized}`);
// console.log(`------------------------`);

// console.log(`${siteName}-${shortDate}-${mealType}`);
