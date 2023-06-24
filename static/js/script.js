document.addEventListener('DOMContentLoaded', function() {

  /* ----- SIDEBAR TOGGLE ----- */

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


  /* ----- ACCOUNT DROPDOWN MENU ----- */

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


  /* ----- CHARTS ----- */

  if (document.getElementById('column-chart') && document.getElementById('pie-chart')) {
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
        },
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
    fetch('/budget_data')
      .then(response => response.json())
      .then(budgetData => {
        // Call the function to create the charts with the budgetData
        createCharts(budgetData);
      })
      .catch(error => {
        console.error("Error fetching budget data:", error);
      });
  }


  /* ----- ADD EXPENSE ENTRY ----- */

  // Dynamically add new expense entry when pressing "Add Entry" button
  let addEntryButton = document.getElementById("add-entry");
  let expenseContainer = document.getElementById("new-expenses");

  if (document.getElementById("unused-categories")) {
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

          <span class="removeBtn material-icons-outlined">delete</span>
        `;

        expenseContainer.appendChild(newEntry);

        // Update unusedCategories after adding a new entry
        unusedCategories = unusedCategories.filter(category => category !== newEntry.querySelector('.category').value);
        updateUnusedCategories();
      });
    }
  }

  // Dynamically remove expense entry when pressing "Remove Entry" button
  if (expenseContainer) {
    expenseContainer.addEventListener("click", function (event) {
      let targetElement = event.target; // Clicked element

      if (targetElement.classList.contains("removeBtn")) {
        const category = targetElement.parentElement.querySelector('.category').value;
        targetElement.parentElement.remove();

        // Update unusedCategories after removing an entry
        unusedCategories.push(category);
        updateUnusedCategories();
      }
    });
  }

  // Update the hidden unusedCategories element
  unusedCategories = Array.from(document.querySelectorAll('.category')).map(category => category.value);
  function updateUnusedCategories() {
    document.getElementById("unused-categories").textContent = JSON.stringify(unusedCategories);
  }


  /* ----- UPDATE BUDGET VALUES ----- */

  function updateBudgetValues(updatedValues) {
    fetch('/update_budget_values', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedValues),
    })
      .then(response => {
        if (response.ok) {
          console.log('Budget values updated successfully!');
        } else {
          console.error('Error updating budget values:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error updating budget values:', error);
      });
  }

  
  /* ----- UPDATE/CANCEL/SUBMIT BUTTONS ----- */

  // Get all the necessary elements
  const updateBtns = document.querySelectorAll('.updateBtn');
  const cancelBtns = document.querySelectorAll('.cancelBtn');

  // Variables to store the original and updated values
  let originalValues = {};
  let updatedValues = {};

  // Attach event handlers to each update button
  updateBtns.forEach((updateBtn) => {
    const parentContainer = updateBtn.parentNode;
    const input = parentContainer.querySelector('.amount-input');
    const cancelBtn = parentContainer.querySelector('.cancelBtn');
    const submitBtn = parentContainer.querySelector('.submitBtn');
    // Get the corresponding label element for the input
    const label = input.parentElement.previousElementSibling;

    updateBtn.addEventListener('click', () => {
      originalValues[input.id] = input.value;
      input.disabled = false;
      updateBtn.style.display = 'none';
      cancelBtn.style.display = 'inline-block';
      submitBtn.style.display = 'inline-block';
    });

    cancelBtn.addEventListener('click', () => {
      input.value = originalValues[input.id];
      input.disabled = true;
      updateBtn.style.display = 'inline-block';
      cancelBtn.style.display = 'none';
      submitBtn.style.display = 'none';
    });

    submitBtn.addEventListener('click', () => {
      const categoryId = label.textContent.replace(':', '');
      updatedValues[categoryId] = input.value;
      input.disabled = true;
      updateBtn.style.display = 'inline-block';
      cancelBtn.style.display = 'none';
      submitBtn.style.display = 'none';

      // Update the budget values in the database
      updateBudgetValues(updatedValues);
    });
  });

  // Attach event handlers to each cancel button
  cancelBtns.forEach((cancelBtn) => {
    const parentContainer = cancelBtn.parentNode;
    const input = parentContainer.querySelector('.amount-input');
    const updateBtn = parentContainer.querySelector('.updateBtn');
    const submitBtn = parentContainer.querySelector('.submitBtn');

    cancelBtn.addEventListener('click', () => {
      input.value = originalValues[input.id];
      input.disabled = true;
      updateBtn.style.display = 'inline-block';
      cancelBtn.style.display = 'none';
      submitBtn.style.display = 'none';
    });
  });
  
}); // End of DOMContentLoaded
