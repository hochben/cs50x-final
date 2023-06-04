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
  var logoutButton = document.getElementById("logout-button");

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

  logoutButton.addEventListener("click", function () {
    // Handle logout logic here
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
