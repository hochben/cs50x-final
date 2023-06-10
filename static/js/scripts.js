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



  /*----- ADD EXPENSES FORM ENTRY -----*/

  const addEntryButton = document.getElementById('add-entry');
  const expenseContainer = document.getElementById('expense-container');
  const expenseCountInput = document.getElementById('expense_count');

  addEntryButton.addEventListener('click', function () {
    const newEntry = document.createElement('div');
    newEntry.className = 'expense-entry';
    newEntry.innerHTML = `
      <label for="category[]">Category:</label>
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
        <option value="Transportation">Transportation</option>
        <option value="Travel">Travel</option>
        <option value="Utilities">Utilities</option>
        <option value="">------</option>
        <option value="Miscellaneous">Miscellaneous</option>
      </select>

      <label for="amount[]]>Amount:</label>
      <input type="number" name="amount[]" class="amount" required>
      `;

      expenseContainer.appendChild(newEntry);
    
      // Assign value based on count of expense entries
      expenseCountInput.value = document.getElementsByClassName('expense-entry').length + 1;
    
      // Add event listener to remove button
      const removeButton = document.createElement('button');
      removeButton.className = 'remove-entry';
      removeButton.innerHTML = 'Remove';
      removeButton.addEventListener('click', function () {
        newEntry.remove();

        // Assign value to expenseCountInput based on count of expense entries
        expenseCountInput.value = document.getElementsByClassName('expense-entry').length - 1;
      });
    
      newEntry.appendChild(removeButton);
    });



  /*----- CHARTS -----*/

  /* COLUMN CHART */ 
  var columnChartOptions = {
    colors:['#2e7d32', '#d50000'],
    series: [{
    name: 'Income',
    type: 'column',
    data: [4.2, 4.2, 4.2, 4.2, 4.2, 4.2, 4.2, 4.2, 4.2, 4.2, 4.2, 4.2,]
  }, {
    name: 'Expenses',
    type: 'column',
    data: [3.2, 3, 2.5, 2, 2, 2.6, 3, 3.2, 4.5, 3.5, 4, 4.7,]
  }],
    chart: {
    type: 'bar',
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
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '40%',
    },
  },
  dataLabels: {
    enabled: false,
  },
  fill: {
    opacity: 1, 
  },
  grid: {
    borderColor: "#55596e",
    yaxis: {
      lines: {
        show: true,
      }
    }
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
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    title: {
      style: {
        color: "#f5f7ff",
      },
    },
    axisBorder: {
      show: true,
      color: "#55596e",
    },
    axisTicks: {
      show: true,
      color: "#55596e",
    },
    labels: {
      style: {
        colors: "#f5f7ff",
      }
    },
  },
  yaxis: [
    {
      axisTicks: {
        show: true,
        color: "#55596e",
      },
      axisBorder: {
        show: true,
        color: "#55596e",
      },
      labels: {
        style: {
          color: "#f5f7ff",
        }
      },
      title: {
        text: "Income (thousands)",
        style: {
          color: "#f5f7ff",
        }
      },
    },
    {
      seriesName: 'Income',
      opposite: true,
      axisTicks: {
        show: true,
        color: "#55596e",
      },
      axisBorder: {
        show: true,
        color: "#55596e",
      },
      labels: {
        style: {
          color: "#f5f7ff",
        }
      },
      title: {
        text: "Expenses (thousands)",
        style: {
          color: "#f5f7ff",
        }
      },
    },
  ],
  tooltip: {
    y: {
      formatter: function (val) {
        return "$ " + val + "00"
      }
    }
  },
  };

  var columnChart = new ApexCharts(document.querySelector("#column-chart"), columnChartOptions);
  columnChart.render();

  /* DONUT CHART */ 

});
