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

  function createCharts(budgetData) {
    // Extract the budgetData
    const incomeData = budgetData.income;
    const expenseData = budgetData.expenses;
    const totalExpenses = budgetData.total_expenses;
  
    // Create columnChart
    new Chart(document.getElementById('column-chart'), {
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


        // Create pieChart
        new Chart(document.getElementById('pie-chart'), {
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
                display: true,
                position: 'top',
                labels: {
                  boxWidth: 20,
                  padding: 10,
                  usePointStyle: true,
                }
              },
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
  }

// Fetch budget_data using AJAX
fetch("/budget_data")
  .then(response => response.json())
  .then(budgetData => {
    // Call the function to create the charts with the budgetData
    createCharts(budgetData);
  })
  .catch(error => {
    console.error("Error fetching budget data:", error);
  });



  /*----- ADD EXPENSE ENTRY -----*/

  // Define the expense categories in an array
  const expenseCategories = [
    "Childcare", "Debt-Payments", "Dining-Out", "Education", "Entertainment", "Gifts/Donations",
    "Groceries", "Health/Medical", "Hobbies/Recreation", "Home-Maintenance", "Insurance",
    "Pet-Expenses", "Rent/Mortgage", "Shopping", "Subscriptions", "Taxes",
    "Transportation", "Travel", "Utilities", "Miscellaneous"
  ];

  // Sort the expense categories alphabetically
  expenseCategories.sort();

  // Function to sort the select menus
  function sortSelectMenus() {
    // Get all select menus with the "category" class
    const selectMenus = document.getElementsByClassName("category");

    // Sort each select menu alphabetically
    Array.from(selectMenus).forEach(function (selectMenu) {
      // Get the current selected value before sorting
      const selectedValue = selectMenu.value;

      // Sort the options alphabetically (excluding the "Select a category" option)
      const options = Array.from(selectMenu.options);
      options.sort(function (a, b) {
        if (a.value === "") return -1; // Keep the "Select a category" option at the top
        if (b.value === "") return 1;
        return a.text.localeCompare(b.text);
      });

      // Clear the select menu
      selectMenu.innerHTML = "";

      // Add the sorted options back to the select menu
      options.forEach(function (option) {
        selectMenu.appendChild(option);
      });

      // Set the previously selected value (if any) after sorting
      selectMenu.value = selectedValue;
    });
  }

  // Call the sortSelectMenus function when the page loads
  window.addEventListener("load", sortSelectMenus);

  // Dynamically add new expense entry when pressing "Add Entry" button
  let addEntryButton = document.getElementById("add-entry");
  let expenseContainer = document.getElementById("expense-container");

  if (addEntryButton) {
    addEntryButton.addEventListener("click", function () {
      let newEntry = document.createElement("div");
      newEntry.classList.add("expense-entry");
      newEntry.innerHTML = `
        <label for="category">Category:</label>
        <select name="category[]" class="category">
          <option disabled selected value="">Select a category</option>
          ${expenseCategories
            .map(category => `<option value="${category}">${category}</option>`)
            .join("")}
        </select>

        <label for="amount">Amount:</label>
        <input type="number" id="amount" name="amount[]" class="amount-input" placeholder="0.00">

        <span class="remove-entry material-icons-outlined">delete</span>
      `;

      expenseContainer.appendChild(newEntry);

      // Sort the select menus after adding the new entry
      sortSelectMenus();
    });
  }

  // Dynamically remove expense entry when pressing "Remove Entry" button
  if (expenseContainer) {
    expenseContainer.addEventListener("click", function (event) {
      let targetElement = event.target; // Clicked element

      if (targetElement.classList.contains("remove-entry")) {
        targetElement.parentElement.remove();

        // Add the removed expense category back to unused_categories
        let removedCategory = targetElement.previousSibling.textContent;
        unusedCategories.push(removedCategory);

      // Sort the select menus again to include the removed category
      sortSelectMenus();
      }
    });
  }

});