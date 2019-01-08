/**
 * CONSTANTS
 */
const ESKER_BASE_URL = "https://as1.ondemand.esker.com/ondemand/webaccess";

window.onload = function() {
  /**
   * Syntactic sugar to use the $ instead of the more verbose document.querySelector
   * Inspired by bling dot js by Paul Irish
   * https://gist.github.com/paulirish/12fb951a8b893a454b32
   */
  window.$ = document.querySelector.bind(document);

  hideAllFieldsByDefault();
  setDefaultValueForSapBapiParams();
};

function hideAllFieldsByDefault() {
  $("#eddQueryFields").style.display = "none";
  $("#sapQueryFields").style.display = "none";
  $("#sapBapiFields").style.display = "none";
  $("#submitButton").style.display = "none";
}

function setDefaultValueForSapBapiParams() {
  $("#sapBapi-sapBapiParams").defaultValue = `{
    "EXPORTS": {},
    "IMPORTS": {},
    "TABLES": {
      "MESSAGES": [],
      "OBJECTLINKS": [],
      "TEXT_LINES": [{
          "TDOBJECT": "KNVV",
          "TDNAME": "000000167110001200",
          "TDID": "0001",
          "TDSPRAS": "EN"
        }
      ]
    },
    "CHANGINGS": {}
  }`;
}

function openQueryURL() {
  const queryTypeSelected = getQueryTypeSelected();
  const queryURL = generateQueryURL(queryTypeSelected);
  window.open(queryURL);
}

function generateQueryURL(queryTypeSelected) {
  switch (queryTypeSelected) {
    case "eddQuery":
      return generateEDDQueryURL();
    case "sapQuery":
      return generateSAPQueryURL();
    case "sapBapi":
      return generateSAPBapiURL();
  }
}

function generateEDDQueryURL() {
  const tables = $("#eddQuery-tables").value;
  const attributes = $("#eddQuery-attributes").value;
  const filter = encodeURIComponent($("#eddQuery-filter").value);
  const maxRecords = $("#eddQuery-maxRecords").value;
  return `${ESKER_BASE_URL}/EddQuery.ashx?debug=yes&TABLES=${tables}&ATTRIBUTES=${attributes}&FILTER=${filter}&MAXRECORDS=${maxRecords}`;
}

function generateSAPQueryURL() {
  const sapConf = $("#sapQuery-sapConf").value;
  const table = $("#sapQuery-table").value;
  const fields = $("#sapQuery-fields").value;
  const options = $("#sapQuery-options").value;
  const rowCount = $("#sapQuery-rowCount").value;
  return `${ESKER_BASE_URL}/SAPQuery.ashx?debug=yes&SAPCONF=${sapConf}&TABLE=${table}&FIELDS=${fields}&OPTIONS=${options}&ROWCOUNT=${rowCount}`;
}

function generateSAPBapiURL() {
  const sapConf = $("#sapBapi-sapConf").value;
  const sapBapiName = $("#sapBapi-sapBapiName").value;
  const sapBapiParams = $("#sapBapi-sapBapiParams").value;
  return `${ESKER_BASE_URL}/SAPCallBapi.ashx?debug=yes&SAPCONF=${sapConf}&SAPBAPINAME=${sapBapiName}&SAPBAPIPARAMS=${sapBapiParams}`;
}

function onSelectQueryType() {
  const queryTypeSelected = getQueryTypeSelected();
  displayElemIfConditionFulfilled(
    "#eddQueryFields",
    queryTypeSelected === "eddQuery"
  );
  displayElemIfConditionFulfilled(
    "#sapQueryFields",
    queryTypeSelected === "sapQuery"
  );
  displayElemIfConditionFulfilled(
    "#sapBapiFields",
    queryTypeSelected === "sapBapi"
  );
  displayElemIfConditionFulfilled(
    "#submitButton",
    queryTypeSelected !== "Choose..."
  );
}

function displayElemIfConditionFulfilled(elementSelector, condition) {
  $(elementSelector).style.display = condition ? "" : "none";
}

function getQueryTypeSelected() {
  return $("#queryType").value;
}
