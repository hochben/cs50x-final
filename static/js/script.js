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

  // Dynamically add new expense entry when pressing "Add Entry" button
  let addEntryButton = document.getElementById("add-entry");
  let expenseContainer = document.getElementById("new-expenses");
  let unusedCategories = JSON.parse(document.getElementById("unused-categories").textContent);

  if (addEntryButton) {
    addEntryButton.addEventListener("click", function () {
      let newEntry = document.createElement("div");
      newEntry.classList.add("new-expenses");
      newEntry.innerHTML = `
        <label for="category">Category:</label>
        <select name="category[]" class="category">
          <option disabled selected value="">Select a category</option>
          ${unusedCategories.map(category => `<option value="${category}">${category}</option>`).join('')}
        </select>
        <label for="amount">Amount:</label>
        <input type="number" id="amount" name="amount[]" class="amount-input" placeholder="0.00" step="0.05">

        <span class="remove-entry material-icons-outlined">delete</span>
      `;

      expenseContainer.appendChild(newEntry);

      // Update unusedCategories after adding a new entry
      unusedCategories = unusedCategories.filter(category => category !== newEntry.querySelector('.category').value);
      updateUnusedCategories();
    });
  }

  // Dynamically remove expense entry when pressing "Remove Entry" button
  if (expenseContainer) {
    expenseContainer.addEventListener("click", function (event) {
      let targetElement = event.target; // Clicked element

      if (targetElement.classList.contains("remove-entry")) {
        const category = targetElement.parentElement.querySelector('.category').value;
        targetElement.parentElement.remove();

        // Update unusedCategories after removing an entry
        unusedCategories.push(category);
        updateUnusedCategories();
      }
    });
  }

  // Update the hidden unusedCategories element
  function updateUnusedCategories() {
    document.getElementById("unused-categories").textContent = JSON.stringify(unusedCategories);
  }


  /*----- UPDATE/CANCEL/SUBMIT BUTTONS -----*/

  // Buttons for income

  // Add event listener to update income button
  let updateIncomeButton = document.querySelector('#update-income');
  if (updateIncomeButton) {
    updateIncomeButton.addEventListener('click', function() {
      let container = this.parentElement;
      let inputField = container.querySelector('.amount-input');
      let cancelButton = container.querySelector('#cancel-income');
      let submitButton = container.querySelector('#submit-income');

      // Enable the input field
      inputField.disabled = false;

      // Hide the update button
      this.style.display = 'none';

      // Show the cancel and submit buttons
      cancelButton.style.display = 'inline-block';
      submitButton.style.display = 'inline-block';

      // Store the current value
      inputField.dataset.originalValue = inputField.value;
    });
  }

  // Add event listener to cancel income button
  let cancelIncomeButton = document.querySelector('#cancel-income');
  if (cancelIncomeButton) {
    cancelIncomeButton.addEventListener('click', function() {
      let container = this.parentElement;
      let inputField = container.querySelector('.amount-input');
      let updateButton = container.querySelector('#update-income');
      let submitButton = container.querySelector('#submit-income');

      // Disable the input field
      inputField.disabled = true;

      // Hide the cancel and submit buttons
      this.style.display = 'none';
      submitButton.style.display = 'none';

      // Show the update button
      updateButton.style.display = 'inline-block';

      // Restore the original value
      let originalValue = inputField.dataset.originalValue;
      inputField.value = originalValue;
    });
  }

  // Add event listener to submit income button
  let submitIncomeButton = document.querySelector('#submit-income');
  if (submitIncomeButton) {
    submitIncomeButton.addEventListener('click', function() {
      let container = this.parentElement;
      let inputField = container.querySelector('.amount-input');
      let updateButton = container.querySelector('#update-income');
      let cancelButton = container.querySelector('#cancel-income');

      // Disable the input field
      inputField.disabled = true;

      // Hide the cancel and submit buttons
      cancelButton.style.display = 'none';
      this.style.display = 'none';

      // Show the update button
      updateButton.style.display = 'inline-block';

      // Save the new value
      let newValue = inputField.value;
      inputField.dataset.originalValue = newValue;
    });
  }

  // Buttons for savings

  // Add event listener to update savings button
  let updateSavingsButton = document.querySelector('#update-savings');
  if (updateSavingsButton) {
    updateSavingsButton.addEventListener('click', function() {
      let container = this.parentElement;
      let inputField = container.querySelector('.amount-input');
      let cancelButton = container.querySelector('#cancel-savings');
      let submitButton = container.querySelector('#submit-savings');

      // Enable the input field
      inputField.disabled = false;

      // Hide the update button
      this.style.display = 'none';

      // Show the cancel and submit buttons
      cancelButton.style.display = 'inline-block';
      submitButton.style.display = 'inline-block';

      // Store the current value
      inputField.dataset.originalValue = inputField.value;
    });
  }

  // Add event listener to cancel savings button
  let cancelSavingsButton = document.querySelector('#cancel-savings');
  if (cancelSavingsButton) {
    cancelSavingsButton.addEventListener('click', function() {
      let container = this.parentElement;
      let inputField = container.querySelector('.amount-input');
      let updateButton = container.querySelector('#update-savings');
      let submitButton = container.querySelector('#submit-savings');

      // Disable the input field
      inputField.disabled = true;

      // Hide the cancel and submit buttons
      this.style.display = 'none';
      submitButton.style.display = 'none';

      // Show the update button
      updateButton.style.display = 'inline-block';

      // Restore the original value
      let originalValue = inputField.dataset.originalValue;
      inputField.value = originalValue;
    });
  }

  // Add event listener to submit savings button
  let submitSavingsButton = document.querySelector('#submit-savings');
  if (submitSavingsButton) {
    submitSavingsButton.addEventListener('click', function() {
      let container = this.parentElement;
      let inputField = container.querySelector('.amount-input');
      let updateButton = container.querySelector('#update-savings');
      let cancelButton = container.querySelector('#cancel-savings');

      // Disable the input field
      inputField.disabled = true;

      // Hide the cancel and submit buttons
      cancelButton.style.display = 'none';
      this.style.display = 'none';

      // Show the update button
      updateButton.style.display = 'inline-block';

      // Save the new value
      let newValue = inputField.value;
      inputField.dataset.originalValue = newValue;
    });
  }

  // Buttons for expenses

  // Add event listeners to update buttons for expenses
  let updateExpenseButtons = document.querySelectorAll('.update-expense');
  updateExpenseButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      let container = this.parentElement;
      let inputField = container.querySelector('.amount-input');
      let cancelButton = container.querySelector('.cancel-expense');
      let submitButton = container.querySelector('.submit-expense');

      // Enable the input field
      inputField.disabled = false;

      // Hide the update button
      this.style.display = 'none';

      // Show the cancel and submit buttons
      cancelButton.style.display = 'inline-block';
      submitButton.style.display = 'inline-block';

      // Store the current value
      inputField.dataset.originalValue = inputField.value;
    });
  });

  // Add event listeners to cancel buttons for expenses
  let cancelExpenseButtons = document.querySelectorAll('.cancel-expense');
  cancelExpenseButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      let container = this.parentElement;
      let inputField = container.querySelector('.amount-input');
      let updateButton = container.querySelector('.update-expense');
      let submitButton = container.querySelector('.submit-expense');

      // Disable the input field
      inputField.disabled = true;

      // Hide the cancel and submit buttons
      this.style.display = 'none';
      submitButton.style.display = 'none';

      // Show the update button
      updateButton.style.display = 'inline-block';

      // Restore the original value
      let originalValue = inputField.dataset.originalValue;
      inputField.value = originalValue;
    });
  });

  // Add event listeners to submit buttons for expenses
  let submitExpenseButtons = document.querySelectorAll('.submit-expense');
  submitExpenseButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      let container = this.parentElement;
      let inputField = container.querySelector('.amount-input');
      let updateButton = container.querySelector('.update-expense');
      let cancelButton = container.querySelector('.cancel-expense');

      // Disable the input field
      inputField.disabled = true;

      // Hide the cancel and submit buttons
      cancelButton.style.display = 'none';
      this.style.display = 'none';

      // Show the update button
      updateButton.style.display = 'inline-block';

      // Save the new value
      let newValue = inputField.value;
      inputField.dataset.originalValue = newValue;
    });
  });


});