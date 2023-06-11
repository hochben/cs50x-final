document.addEventListener('DOMContentLoaded', function() {
  /*----- SIDEBAR TOGGLE -----*/

  var sidebarOpen = false;
  var sidebar = document.getElementById("sidebar");

  function openSidebar() {
    if (!sidebarOpen) {
      sidebar.classList.add("sidebar-responsive");
      sidebarOpen = true;
    }
  }

  function closeSidebar() {
    if (sidebarOpen) {
      sidebar.classList.remove("sidebar-responsive");
      sidebarOpen = false;
    }
  }

  // Assign functions to global scope
  window.openSidebar = openSidebar;
  window.closeSidebar = closeSidebar;



  /*----- ACCOUNT DROPDOWN MENU -----*/

  var dropdownArrow = document.getElementById("dropdown-arrow");
  var dropdownMenu = document.getElementById("dropdown-menu");

  dropdownArrow.addEventListener("click", function () {
    dropdownMenu.style.display = "block";
  });

  document.addEventListener("click", function (event) {
    var targetElement = event.target; // Clicked element

    // Check if the clicked element is outside the dropdown menu
    if (
      targetElement != dropdownArrow &&
      targetElement != dropdownMenu &&
      !dropdownMenu.contains(targetElement)
    ) {
      dropdownMenu.style.display = "none";
    }
  });



  /*----- CHARTS -----*/

  // Fetch budget_data from Flask route
  fetch("/budget_data")
    .then(response => response.json())
    .then(data => {
      // Debugging
      console.log(data);
      

      // Create columnChart
      

      // Create pieChart
      
    });



  /*----- ADD EXPENSE ENTRY -----*/

  // Dynamically add new expense entry when pressing "Add Entry" button
  var addEntryButton = document.getElementById("add-entry");
  var expenseContainer = document.getElementById("expense-container");
  var expenseCountInput = document.getElementById("expense_count");

  var expenseCount = 0; // Track the number of expense entries

  if (addEntryButton) {
    addEntryButton.addEventListener("click", function () {
      var newEntry = document.createElement("div");
      newEntry.classList.add("expense-entry");
      newEntry.innerHTML = `
        <label for="category">Category:</label>
        <select name="category[]" class="category" required>
          <option value="">Select a category</option>
          <option value="Childcare">Childcare</option>
          <option value="Debt-Payments">Debt Payments</option>
          <option value="Dining Out">Dining Out</option>
          <option value="Education">Education</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Gifts/Donations">Gifts/Donations</option>
          <option value="Groceries">Groceries</option>
          <option value="Health/Medical">Health/Medical</option>
          <option value="Hobbies/Recreation">Hobbies/Recreation</option>
          <option value="Home-Maintenance">Home Maintenance</option>
          <option value="Insurance">Insurance</option>
          <option value="Pet-Expenses">Pet Expenses</option>
          <option value="Personal-Care">Personal Care</option>
          <option value="Rent/Mortgage">Rent/Mortgage</option>
          <option value="Shopping">Shopping</option>
          <option value="Subscriptions">Subscriptions</option>
          <option value="Taxes">Taxes</option>
          <option value="Transportation">Transportation</option>
          <option value="Travel">Travel</option>
          <option value="Utilities">Utilities</option>
          <option value="">------</option>
          <option value="Miscellaneous">Miscellaneous</option>
        </select>

        <label for="amount">Amount:</label>
        <input type="number" id="amount" name="amount[]" class="amount-input" placeholder="0.00" required>

        <span class="remove-entry material-icons-outlined">delete</span>
      `;

      expenseContainer.appendChild(newEntry);
      expenseCount++; // Increment the expense count
      expenseCountInput.value = expenseCount; // Update expense count input value
    });
    };

  // Dynamically remove expense entry when pressing "Remove Entry" button
  if (expenseContainer) {
    expenseContainer.addEventListener("click", function (event) {
        var targetElement = event.target; // Clicked element

        if (targetElement.classList.contains("remove-entry")) {
          targetElement.parentElement.remove();
          expenseCount--; // Decrement the expense count
          expenseCountInput.value = expenseCount; // Update the hidden expense count input value
        }
      });
  }

});