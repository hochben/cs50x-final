document.addEventListener('DOMContentLoaded', function() {
  /*----- SIDEBAR TOGGLE -----*/

  let sidebarOpen = false;
  let sidebar = document.getElementById("sidebar");

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

  let dropdownArrow = document.getElementById("dropdown-arrow");
  let dropdownMenu = document.getElementById("dropdown-menu");

  dropdownArrow.addEventListener("click", function () {
    dropdownMenu.style.display = "block";
  });

  document.addEventListener("click", function (event) {
    let targetElement = event.target; // Clicked element

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
  .then(budget_data => {

    // Extract the budget_data from the response
    const incomeData = budget_data.income;
    const expenseData = budget_data.expenses;
    const totalExpenses = budget_data.total_expenses;

    // Debugging
    console.log(incomeData);
    console.log(expenseData);
    console.log(totalExpenses);

    // Create columnChart
    const columnChart = new Chart(document.getElementById('column-chart'), {
      type: 'bar',
      data: {
        labels: ['Income', 'Total Expenses'],
        datasets: [{
          data: [incomeData.amount, totalExpenses.amount],
          backgroundColor: [
            'rgba(52, 121, 82, 0.8)',
            'rgba(204, 60, 67, 0.8)'
          ],
          borderColor: [
            'rgba(52, 121, 82, 0.8)',
            'rgba(204, 60, 67, 0.8)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Income vs. Total Expenses'
          }
        },
        layout: {
          padding: {
            left: 20,
            right: 20,
            top: 20,
            bottom: 20
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    console.log(columnChart);

    // Create pieChart
    const pieChart = new Chart(document.getElementById('pie-chart'), {
      type: 'doughnut',
      data: {
        labels: expenseData.categories,
        datasets: [{
          label: 'Expense Categories',
          data: expenseData.amounts,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#FF8C00',
            '#ADFF2F',
            '#9932CC',
            '#FF1493',
            '#00BFFF',
            '#8A2BE2',
            '#00FF00',
            '#FFD700',
            '#DAA520',
            '#4B0082',
            '#800000',
            '#228B22',
            '#DC143C',
            '#1E90FF',
            '#FF00FF',
            '#FF4500',
            '#FF69B4',
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Total Expenses'
          }
        },
        layout: {
          padding: {
            left: 20,
            right: 20,
            top: 20,
            bottom: 20
          }
        }
      },
    });
  });



  /*----- ADD EXPENSE ENTRY -----*/

  // Dynamically add new expense entry when pressing "Add Entry" button
  let addEntryButton = document.getElementById("add-entry");
  let expenseContainer = document.getElementById("expense-container");
  let expenseCountInput = document.getElementById("expense_count");

  let expenseCount = 0; // Track the number of expense entries

  if (addEntryButton) {
    addEntryButton.addEventListener("click", function () {
      let newEntry = document.createElement("div");
      newEntry.classList.add("expense-entry");
      newEntry.innerHTML = `
        <label for="category">Category:</label>
        <select name="category[]" class="category" required>
          <option disabled selected value="">Select a category</option>
          <option value="Childcare">Childcare</option>
          <option value="Debt-Payments">Debt Payments</option>
          <option value="Dining-Out">Dining Out</option>
          <option value="Education">Education</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Gifts/Donations">Gifts/Donations</option>
          <option value="Groceries">Groceries</option>
          <option value="Health/Medical">Health/Medical</option>
          <option value="Hobbies/Recreation">Hobbies/Recreation</option>
          <option value="Home-Maintenance">Home Maintenance</option>
          <option value="Insurance">Insurance</option>
          <option value="Pet-Expenses">Pet Expenses</option>
          <option value="Rent/Mortgage">Rent/Mortgage</option>
          <option value="Shopping">Shopping</option>
          <option value="Subscriptions">Subscriptions</option>
          <option value="Taxes">Taxes</option>
          <option value="Transportation">Transportation</option>
          <option value="Travel">Travel</option>
          <option value="Utilities">Utilities</option>
          <option disabled value="">------</option>
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
        let targetElement = event.target; // Clicked element

        if (targetElement.classList.contains("remove-entry")) {
          targetElement.parentElement.remove();
          expenseCount--; // Decrement the expense count
          expenseCountInput.value = expenseCount; // Update the hidden expense count input value
        }
      });
  }

});