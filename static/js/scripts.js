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

    // Extract data from JSON response
    var expenseCategory = data.expense_category;
    var expenseAmount = data.expense_amount;
    var incomeCategory = data.income_category;
    var incomeAmount = data.income_amount;

    // Log data to console
    console.log(expenseCategory);
    console.log(expenseAmount);
    console.log(incomeCategory);
    console.log(incomeAmount);

    /* PIE CHART */
    var pieChartOptions = {
      series: amount,
      chart: {
        type: 'donut',
        height: 350,
        background: "transparent",
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
              enabled: true,
              delay: 150
          },
          dynamicAnimation: {
              enabled: true,
              speed: 350
          }
        }
      },
      labels: category,
      
      fill: {
        opacity: 1,
      },
      legend: {
        labels: {
          color: "#f5f7ff",
        },
        color: "#f5f7ff",
        show: true,
        position: "bottom",
      },
      stroke: {
        colors: ["transparent"],
        show: true,
        width: 2,
      },
      tooltip: {
        shared: true,
        intersect: false,
        theme: "dark",
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };
    
    var pieChart = new Chart(document.querySelector("#pie-chart"), pieChartOptions);
    pieChart.render();

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
        <input type="number" name="amount[]" class="amount" required>

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