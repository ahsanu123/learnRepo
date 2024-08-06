import { SlickDataView, SlickGrid, SlickRowDetailView, SlickRowSelectionModel } from 'slickgrid'
import 'slickgrid/dist/styles/css/slick-alpine-theme.css'
import 'slickgrid/dist/styles/css/slick.rowdetailview.css'
import 'slickgrid/dist/styles/css//example-demo.css'
var detailView = new SlickRowDetailView({
  cssClass: "detailView-toggle",
  preTemplate: loadingTemplate,
  postTemplate: loadView,
  process: simulateServerCall,
  useRowClick: true,

  // how many grid rows do we want to use for the detail panel
  // also note that the detail view adds an extra 1 row for padding purposes
  // example, if you choosed 6 panelRows, the display will in fact use 5 rows
  panelRows: 6,

  // make only every 2nd row an expandable row,
  // by using the override function to provide custom logic of which row is expandable
  // you can override it here in the options or externally by calling the method on the plugin instance
  expandableOverride: function(row, dataContext, grid) {
    return (dataContext.id % 2 === 1);
  }
});
var fakeNames = ['John Doe', 'Jane Doe', 'Chuck Norris', 'Bumblebee', 'Jackie Chan', 'Elvis Presley', 'Bob Marley', 'Mohammed Ali', 'Bruce Lee', 'Rocky Balboa'];

var columns = [
  { id: "sel", name: "#", field: "num", behavior: "select", cssClass: "cell-selection", width: 40, resizable: false, selectable: false },
  { id: "title", name: "Title", field: "title", width: 110, minWidth: 110, cssClass: "cell-title", sortable: true },
  { id: "duration", name: "Duration", field: "duration", sortable: true },
  { id: "%", name: "% Complete", field: "percentComplete", width: 95, resizable: false, sortable: true },
  { id: "start", name: "Start", field: "start", minWidth: 60 },
  { id: "finish", name: "Finish", field: "finish", minWidth: 60 },
  { id: "effort-driven", name: "Effort Driven", width: 90, minWidth: 20, maxWidth: 90, cssClass: "cell-effort-driven", field: "effortDriven", }
];
var options = {
  editable: false,
  enableAddRow: false,
  enableCellNavigation: true,
  enableColumnReorder: true,
  explicitInitialization: true,
  headerRowHeight: 30,
  showHeaderRow: true,
  autoHeight: true
};

var dataView = new SlickDataView();
var detailView;
var grid = new SlickGrid("#myGrid", dataView, columns, options);
var data = [];
var columnFilters = {};
var sortcol = "title";
var sortdir = 1;


function DataItem(i) {
  this.id = i;
  this.num = i;
  this.percentComplete = Math.round(Math.random() * 100);
  this.effortDriven = (i % 5 == 0);
  this.start = "01/01/2009";
  this.finish = "01/05/2009";
  this.title = "Task " + i;
  this.duration = "5 days";
}

function setMaxRows(amount) {
  var value = document.querySelector("#maxRowInput").value;
  var maxRows = parseInt(value);
  var options = detailView.getOptions();

  if (!isNaN(maxRows)) {
    options.maxRows = maxRows;
  }
  detailView.setOptions(options);
}

function setPanelRows(amount) {
  var value = document.querySelector("#panelRowInput").value;
  var panelRows = parseInt(value);
  var options = detailView.getOptions();

  if (!isNaN(panelRows)) {
    options.panelRows = panelRows;
  }
  detailView.setOptions(options);
}

function hookAssigneeOnClick(itemId) {
  const assigneeElm = document.querySelector("#who-is-assignee_" + itemId);
  if (assigneeElm) {
    assigneeElm.addEventListener("click", assigneHandler.bind(this, itemId));
  }
}

function assigneHandler(itemId) {
  alert("Assignee is " + document.querySelector("#assignee_" + itemId).value);
}

function destroyAssigneeOnClick(itemId) {
  const handler = document.querySelector("#who-is-assignee_" + itemId)
  if (handler) {
    handler.removeEventListener("click", assigneHandler.bind(this, itemId));
  }
}

function loadingTemplate() {
  return '<div class="preload">Loading...</div>';
}

function loadView(itemDetail) {
  return [
    '<div>',
    '<h4>' + itemDetail.title + '</h4>',
    '<div class="detail">',
    '<label>Assignee:</label> <input id="assignee_' + itemDetail.id + '" type="text" value="' + itemDetail.assignee + '"/>',
    '<span style="float: right">Find out who is the Assignee <button id="who-is-assignee_' + itemDetail.id + '">Click Me</button></span></div>',
    '<div class="detail"><label>Reporter:</label> <span>' + itemDetail.reporter + '</span></div>',
    '<div class="detail"><label>Duration:</label> <span>' + itemDetail.duration + '</span></div>',
    '<div class="detail"><label>% Complete:</label> <span>' + itemDetail.percentComplete + '</span></div>',
    '<div class="detail"><label>Start:</label> <span>' + itemDetail.start + '</span></div>',
    '<div class="detail"><label>Finish:</label> <span>' + itemDetail.finish + '</span></div>',
    '<div class="detail"><label>Effort Driven:</label> <span>' + itemDetail.effortDriven + '</span></div>',
    '<div class="detail"><label>Effort Driven:</label> <span>' + itemDetail.effortDriven + '</span></div>',
    '</div>'
  ].join('');
}


function filter(item) {
  for (var columnId in columnFilters) {
    if (columnId !== undefined && columnFilters[columnId] !== "") {
      var column = grid.getColumns()[grid.getColumnIndex(columnId)];

      // IMPORTANT with Row Detail View plugin
      // if the row is a padding row, we just get the value we're filtering on from it's parent
      item = detailView.getFilterItem(item);

      if (item[column.field] !== undefined) {
        var filterResult = typeof item[column.field].indexOf === 'function'
          ? (item[column.field].indexOf(columnFilters[columnId]) === -1)
          : (item[column.field] != columnFilters[columnId]);

        if (filterResult) {
          return false;
        }
      }
    }
  }
  return true;

}


// fill the template with a delay to simulate a server call
function simulateServerCall(item) {
  setTimeout(function() {
    // let's add some property to our item for a better simulation
    var itemDetail = item;
    itemDetail.assignee = fakeNames[randomNumber(0, 9)];
    itemDetail.reporter = fakeNames[randomNumber(0, 9)];

    if (itemDetail.num % 5 == 0) {
      notifyNonTemplatedView(itemDetail)
    } else {
      notifyTemplate(itemDetail)
    }
  }, 1000);
}


// notify the onAsyncResponse with the "args.item" (required property)
// the plugin will then use itemDetail to populate the detail panel with "postTemplate"
function notifyTemplate(itemDetail) {
  detailView.onAsyncResponse.notify({
    "item": itemDetail
  }, undefined, this);
}

// notify the onAsyncResponse with the "args.item" (required property)
// the plugin will then use itemDetail to populate the detail panel with "postTemplate"
function notifyNonTemplatedView(itemDetail) {
  var rowIdx = grid.getData().getIdxById(itemDetail.id);
  var temp =
    "<div class=\"tab\">" +
    "<button class=\"tablinks\" onclick=\"openCity(event, 'London'," + rowIdx + ")\">London</button>" +
    "<button class=\"tablinks\" onclick=\"openCity(event, 'Paris'," + rowIdx + ")\">Paris</button>" +
    "<button class=\"tablinks\" onclick=\"openCity(event, 'Tokyo'," + rowIdx + ")\">Tokyo</button>" +
    "</div>" +

    "<div id=\"London\" class=\"tabcontent\">" +
    "<h3>London</h3>" +
    "<p>London is the capital city of England.</p>" +
    "<button onclick=\"detailView.resizeDetailView(data[" + rowIdx + "])\">Resize detail view</button>" +
    "</div>" +

    "<div id=\"Paris\" class=\"tabcontent\">" +
    "<h3>Paris</h3>" +
    "<p>Paris is the capital of France.</p> " +
    "</div>" +

    "<div id=\"Tokyo\" class=\"tabcontent\">" +
    "<div>" +
    "<h4>Direct view inserting without template</h4>" +
    "<span>This is not using the template</span><br/>" +
    "<button onclick=\"detailView.resizeDetailView(data[" + rowIdx + "])\">Resize detail view</button>" +
    "<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>" +
    "This is to make the loaded area longer" +
    "<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>" +
    "Done Yay" +
    "</div>" +
    "</div>";

  detailView.onAsyncResponse.notify({
    "item": itemDetail,
    // detailView Ignores any template and use what's passed through instead
    "detailView": temp,
  }, undefined, this);
}


/** Callback to open a city from row detail "Task 5" */
function openCity(evt, cityName, rowIdx) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";

  /* You can save the detail view here OR on the filter keyup
   the reason we save the detail view is to keep the entire content of the view
   before doing certain action like filtering/sorting/reorderingColumn/...
  */
  // detailView.saveDetailView(data[rowIdx]);
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function comparer(a, b) {
  var x = a[sortcol], y = b[sortcol];
  return (x == y ? 0 : (x > y ? 1 : -1));
}

// prepare the data
for (var i = 0; i < 5000; i++) {
  data[i] = new DataItem(i);
}

// create the row detail plugin
columns.unshift(detailView.getColumnDefinition());


// register the column
grid.setSelectionModel(new SlickRowSelectionModel({ selectActiveRow: false }));
grid.registerPlugin(detailView);

detailView.onBeforeRowDetailToggle.subscribe(function(e, args) {
  // you coud cancel opening certain rows
  // if (args.item.id === 1) {
  //   e.preventDefault();
  //   return false;
  // }
  console.log('before toggling row detail', args.item);
});


detailView.onAsyncEndUpdate.subscribe(function(e, args) {
  console.log('finished updating the post async template', args);
  hookAssigneeOnClick(args.item.id);
});

// the following subscribers can be useful to Save/Re-Render a View
// when it goes out of viewport or back to viewport range
detailView.onRowOutOfViewportRange.subscribe(function(e, args) {
  destroyAssigneeOnClick(args.item.id);
});

detailView.onRowBackToViewportRange.subscribe(function(e, args) {
  hookAssigneeOnClick(args.item.id);
});

grid.onSort.subscribe(function(e, args) {
  sortdir = args.sortAsc ? 1 : -1;
  sortcol = args.sortCol.field;

  // using native sort with comparer
  // preferred method but can be very slow in IE with huge datasets
  dataView.sort(comparer, args.sortAsc);
});

function filterInputHandler(e) {
  const inputFilter = e.target;
  const columnId = inputFilter.dataset.columnid;
  if (columnId != null) {
    /* we can save the detail view content before filtering (this will save on every keyup)
      OR you can save in other area of your code (like in the "openCity()" function)
      the reason we save the detail view is to keep the entire content of the view
      before doing certain action like filtering/sorting/reorderingColumn/...
      it's up to you to decide where and if you need to save the detail view
    */
    var expandedRows = detailView.getExpandedRows();
    expandedRows.forEach(function(row) {
      detailView.saveDetailView(row);
    });

    // keep filter in global variable & filter dataset by calling a refresh
    columnFilters[columnId] = (inputFilter.value || '').trim();
    dataView.refresh();
  }
}


const headerRowElm = grid.getHeaderRow();
headerRowElm.addEventListener('change', filterInputHandler);
headerRowElm.addEventListener('keyup', filterInputHandler);

grid.onHeaderRowCellRendered.subscribe(function(e, args) {
  if (args.column.field !== 'sel') {
    args.node.innerHTML = ''; // empty it
    const inputElm = document.createElement('input');
    inputElm.className = 'filter';
    inputElm.placeholder = '🔎︎';
    inputElm.dataset.columnid = args.column.id;
    inputElm.value = columnFilters[args.column.id] || '';

    args.node.appendChild(inputElm);
  }
});
