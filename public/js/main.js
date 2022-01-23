// -----------------Bootstrap form validation-------------

// Disable form submission if there are invalid fields
(function () {
  "use strict";

  // Fetch all forms to apply Bootstrap validation styles
  var forms = document.querySelectorAll(".needs-validation");

  // Loop over forms array and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();
